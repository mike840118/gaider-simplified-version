<template>
  <div class="home-container">
    <div class="filter-section">
      <input type="text" v-model="searchQuery" placeholder="姓名" class="search-input" />
      <button class="search-btn">🔍 搜尋</button>
    </div>

    <div class="cards-grid" :class="{ 'grid-tablet': isTablet }">
      <MonitorCard v-for="patient in paginatedPatients" :key="patient.id" :info="patient" />

      <div v-if="filteredPatients.length === 0" class="no-data">
        找不到符合名稱的用戶
      </div>
    </div>

    <div v-if="filteredPatients.length > 0" class="footer-pagination">
      <span>共 {{ filteredPatients.length }} 項</span>
      <select disabled class="page-size-select">
        <option>{{ itemsPerPage }}項/頁</option>
      </select>

      <div class="pages">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button>

        <button v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }"
          @click="changePage(page)">
          {{ page }}
        </button>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
      </div>
      <span>前往 <input type="number" v-model.number="currentPage" min="1" :max="totalPages" class="page-goto" /> 頁</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import MonitorCard from '@/components/common/MonitorCard.vue'

// ⭐ 1. 直接引入你剛剛存的 JSON 檔案
import rawPatientData from '@/mock/patients.json'

// --- 斷點判斷 ---
const breakpoints = useBreakpoints({
  tablet: 768,
  desktop: 1024,
})
const isTablet = breakpoints.between('tablet', 'desktop')

// --- 搜尋與分頁設定 ---
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 15

// ⭐ 2. 資料轉換器 (Data Mapper)
// ⭐ 資料轉換器 (Data Mapper)
const formatData = (sourceArray) => {
  return sourceArray.map(item => {
    let age = 60
    if (item.birthday) {
      const birthYear = new Date(item.birthday).getFullYear()
      age = 2026 - birthYear
    }

    let status = 'normal'
    if (item.level === 'WARN') status = 'warning'
    if (item.level === 'URGENT') status = 'danger'

    let fatigueKey = 'no_data'
    const fatigueCode = item.data.HDRri?.fatigue
    if (fatigueCode === 'MILD_FATIGUE') fatigueKey = 'recovery'
    if (fatigueCode === 'SEVERE_FATIGUE') fatigueKey = 'warning'
    if (fatigueCode === 'NORMAL') fatigueKey = 'normal'

    // 👇 修改這裡：動態產生「現在 ~ 過去3天內」的隨機時間
    const now = new Date()
    // 3 天的毫秒數 = 3天 * 24小時 * 60分 * 60秒 * 1000毫秒
    const maxPastMs = 3 * 24 * 60 * 60 * 1000
    // 產生一個隨機的扣除毫秒數
    const randomMs = Math.floor(Math.random() * maxPastMs)
    // 得到一個新的隨機過去時間
    const randomDate = new Date(now.getTime() - randomMs)

    // 格式化為 YYYY-MM-DD HH:mm
    const yyyy = randomDate.getFullYear()
    const mm = String(randomDate.getMonth() + 1).padStart(2, '0')
    const dd = String(randomDate.getDate()).padStart(2, '0')
    const hh = String(randomDate.getHours()).padStart(2, '0')
    const min = String(randomDate.getMinutes()).padStart(2, '0')
    const timeStr = `${yyyy}-${mm}-${dd} ${hh}:${min}`

    return {
      id: item.accountId,
      name: item.name || '未知',
      age: age,
      gender: item.gender === 'WOMAN' ? '女' : '男',
      hasAvatar: !!item.url, // 👈 新增
      avatarUrl: item.url,   // 👈 新增
      hr: item.data.HeartBeat?.hb || 0,
      spo2: item.data.BloodOxygen?.bo || 0,
      temp: item.data.BodyTemp?.bodyTemp || 36.5,
      bpSys: item.data.BloodPressure?.sbp || 0,
      bpDia: item.data.BloodPressure?.dbp || 0,
      hrv: item.data.HDRri?.hrv || 0,
      step: item.data.WalkStep?.step || 0,
      kcal: Math.round(item.data.WalkStep?.cal || 0),

      heat: item.sunstroke ? 'warning' : 'normal_heat',
      fatigue: fatigueKey,
      location: item.companyName || '未知',

      // 👇 把產生好的隨機動態時間塞進來
      time: timeStr,

      status: status,
      bpAlert: item.data.BloodPressure?.level !== 'NORMAL',
      sos: item.sos || false
    }
  })
}

// ⭐ 3. 初始化假資料：直接抓 JSON 裡面的 data.data 陣列來轉換
const mockPatients = ref(formatData(rawPatientData.data.data))

// --- 搜尋過濾與多重條件排序邏輯 (保持不變) ---
const filteredPatients = computed(() => {
  let result = mockPatients.value

  if (searchQuery.value.trim()) {
    const keyword = searchQuery.value.toLowerCase()
    result = result.filter(patient =>
      patient.name.toLowerCase().includes(keyword)
    )
  }

  return result.sort((a, b) => {
    if (a.sos !== b.sos) return a.sos ? -1 : 1

    const aIsDanger = a.status === 'danger'
    const bIsDanger = b.status === 'danger'
    if (aIsDanger !== bIsDanger) return aIsDanger ? -1 : 1

    const aIsWarning = a.status === 'warning'
    const bIsWarning = b.status === 'warning'
    if (aIsWarning !== bIsWarning) return aIsWarning ? -1 : 1

    const timeA = new Date(a.time.replace(/-/g, '/')).getTime()
    const timeB = new Date(b.time.replace(/-/g, '/')).getTime()
    return timeB - timeA
  })
})

watch(searchQuery, () => {
  currentPage.value = 1
})

// --- 分頁邏輯 (保持不變) ---
const totalPages = computed(() => {
  return Math.ceil(filteredPatients.value.length / itemsPerPage) || 1
})

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPatients.value.slice(start, end)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<style scoped>
/* 1. 鎖定整個頁面的高度，不讓它撐破外層 */
.home-container {
  display: flex;
  flex-direction: column;
  /* 扣除 Layout 的 header(64px) 與 padding 上下(24px+24px=48px) */
  height: calc(100vh - 64px - 48px);
  overflow: hidden;
  /* 強制不允許外層出現滾動條 */
}

/* 2. 頂部搜尋列：固定高度不被壓縮 */
.filter-section {
  flex-shrink: 0;
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  background-color: #1a222c;
  border: 1px solid #2a3543;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  width: 200px;
}

.search-btn {
  background-color: #243545;
  border: 1px solid #2a3543;
  color: #8da2b5;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

/* 3. ⭐ 卡片網格區：讓這裡成為唯一的滾動區域 ⭐ */
.cards-grid {
  flex: 1;
  /* 佔滿所有剩餘的中間空間 */
  overflow-y: auto;
  /* 只有這裡會出現上下滾動條 */

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  /* 你指定的 5px 間距 */
  align-content: start;
  /* 避免卡片數量不夠時，被垂直拉長 */
  padding-right: 8px;
  /* 預留一點空間給滾動條，畫面更好看 */
}

/* 平板直向的 3 欄設定 */
.cards-grid.grid-tablet {
  grid-template-columns: repeat(3, 1fr);
}

.no-data {
  color: #8da2b5;
  font-size: 14px;
  padding: 20px 0;
  grid-column: 1 / -1;
  text-align: center;
}

/* 4. 底部分頁區：固定在最下方不被壓縮 */
.footer-pagination {
  flex-shrink: 0;
  margin-top: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #8da2b5;
  padding-top: 12px;
  border-top: 1px solid #2a3543;
}

.page-size-select {
  padding: 4px;
  border-radius: 4px;
  background-color: #1a222c;
  color: #8da2b5;
  border: 1px solid #2a3543;
}

.pages {
  display: flex;
  gap: 4px;
}

.pages button {
  padding: 4px 10px;
  border: 1px solid #2a3543;
  background: #1a222c;
  color: #8da2b5;
  border-radius: 4px;
  cursor: pointer;
}

.pages button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pages button.active {
  background: #4db8ff;
  color: #121921;
  font-weight: bold;
  border-color: #4db8ff;
}

.page-goto {
  width: 40px;
  text-align: center;
  padding: 2px;
  background-color: #1a222c;
  color: white;
  border: 1px solid #2a3543;
  border-radius: 4px;
}

/* 美化卡片區的滾動條 (可選，讓它符合深色主題) */
.cards-grid::-webkit-scrollbar {
  width: 6px;
}

.cards-grid::-webkit-scrollbar-track {
  background: #121921;
}

.cards-grid::-webkit-scrollbar-thumb {
  background: #2a3543;
  border-radius: 3px;
}

.cards-grid::-webkit-scrollbar-thumb:hover {
  background: #4db8ff;
}
</style>