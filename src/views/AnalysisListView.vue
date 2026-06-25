<template>
  <div class="home-container">
    <div class="filter-section">
      <input type="text" v-model="searchQuery" placeholder="姓名" class="search-input" />
      <button class="search-btn">🔍 搜尋</button>
    </div>

    <div class="cards-grid">
      <div v-for="(page, pageIndex) in pagedData" :key="pageIndex" class="cards-page">
        <MonitorCard v-for="patient in page" :key="patient.id" :info="patient" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import MonitorCard from '@/components/common/MonitorCard.vue'
import rawPatientData from '@/mock/patients.json'

const breakpoints = useBreakpoints({ tablet: 768, desktop: 1024 })
const isTablet = breakpoints.between('tablet', 'desktop')

const searchQuery = ref('')
const itemsPerPage = 8 // 一次顯示 8 個

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

    return {
      id: item.accountId,
      name: item.name || '未知',
      age: age,
      gender: item.gender === 'WOMAN' ? '女' : '男',
      hasAvatar: !!item.url,
      avatarUrl: item.url,
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
      status: status,
      sos: item.sos || false
    }
  })
}

const mockPatients = ref(formatData(rawPatientData.data.data))

const filteredPatients = computed(() => {
  if (!searchQuery.value.trim()) return mockPatients.value
  const keyword = searchQuery.value.toLowerCase()
  return mockPatients.value.filter(p => p.name.toLowerCase().includes(keyword))
})

const pagedData = computed(() => {
  const result = []
  const list = filteredPatients.value
  for (let i = 0; i < list.length; i += 8) {
    result.push(list.slice(i, i + 8))
  }
  return result
})

</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  overflow: hidden;
}

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

/* ⭐ 平板滑動吸附核心 */
.cards-grid {
  flex: 1;
  display: flex;
  /* 改用 flex，確保卡片橫向排成一列 */
  overflow-x: auto;
  /* 允許水平滑動 */
  overflow-y: hidden;

  /* 關鍵：捲動吸附效果 (強迫吸附在每一頁的開頭) */
  scroll-snap-type: x mandatory;
  gap: 20px;
  padding: 20px;
}

/* 每一頁的容器，假設我們讓 8 個卡片放在一個群組裡 */
.cards-page {
  flex: 0 0 100%;
  /* 強制每一頁佔滿整個容器寬度 */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* 4x2 的排版 */
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
  scroll-snap-align: start;
  /* 這是滑動吸附的關鍵 */
}

/* 確保卡片會自動吸附對齊 */
.cards-grid>* {
  scroll-snap-align: start;
}

.cards-grid.grid-tablet {
  grid-template-columns: repeat(2, 1fr);
  /* 2欄 x 4列 = 8個 */
}

.no-data {
  color: #8da2b5;
  text-align: center;
  grid-column: 1 / -1;
  padding-top: 50px;
}

/* 隱藏滾動條但保持滑動功能 */
.cards-grid::-webkit-scrollbar {
  display: none;
}
</style>