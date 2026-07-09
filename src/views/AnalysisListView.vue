<template>
  <div class="home-container">
    <div class="filter-section">
      <input type="text" v-model="searchQuery" :placeholder="$t('common.search_placeholder')" class="search-input" />
      <button class="search-btn">{{ $t('common.search') }}</button>
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
import { useI18n } from 'vue-i18n'
import MonitorCard from '@/components/common/MonitorCard.vue'
import rawPatientData from '@/mock/patients.json'

const { t } = useI18n()
const searchQuery = ref('')

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
      name: item.name || t('common.unknown'),
      age: age,
      gender: item.gender === 'WOMAN' ? t('common.woman', '女') : t('common.man', '男'),
      hasAvatar: !!item.url,
      avatarUrl: item.url,
      electricity: item.electricity ?? 0,
      batteryLevel: item.electricity > 20 ? 'high' : 'low',
      hr: item.data.HeartBeat?.hb || 0,
      spo2: item.data.BloodOxygen?.bo || 0,
      temp: item.data.BodyTemp?.bodyTemp || 36.5,
      bpSys: item.data.BloodPressure?.sbp || 0,
      bpDia: item.data.BloodPressure?.dbp || 0,
      hrv: item.data.HDRri?.hrv || 0,
      step: item.data.WalkStep?.step || 0,
      kcal: Math.round(item.data.WalkStep?.cal || 0),
      heat: item.sunstroke ? 'warning' : 'normal',
      fatigue: fatigueKey,
      location: item.companyName || t('common.unknown', '未知'),
      status: status,
      sos: item.sos || false
    }
  })
}

const mockPatients = ref(formatData(rawPatientData.data.data))

// 🟢 定義排序權重：SOS(4) > 危險/紅框(3) > 警告/黃框(2) > 正常/綠框(1)
const getPriorityScore = (patient) => {
  if (patient.sos) return 4
  if (patient.status === 'danger') return 3
  if (patient.status === 'warning') return 2
  return 1
}

// 🟢 過濾並加入排序邏輯
const filteredPatients = computed(() => {
  // ⚠️ 加上 [... ] 展開運算符來「淺拷貝」陣列，避免 .sort() 污染原來的響應式資料
  let list = [...mockPatients.value]

  // 1. 先做模糊搜尋過濾
  if (searchQuery.value.trim()) {
    const keyword = searchQuery.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(keyword))
  }

  // 2. 依照權重分數進行降冪排序 (分數高的排前面)
  return list.sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
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
  align-items: center;
  /* 讓按鈕與輸入框垂直居中對齊 */
}

.search-input {
  background-color: #1a222c;
  border: 1px solid #2a3543;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  width: 200px;
  outline: none;
}

.search-btn {
  background-color: #243545;
  border: 1px solid #2a3543;
  color: #8da2b5;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.search-btn:hover {
  background-color: #2a3d4f;
  color: white;
}

/* ⭐ 新增的匯出按鈕樣式 (配合深色主題) */
.btn-export {
  background-color: #0ea5e9;
  /* 亮藍色，使其明顯 */
  border: 1px solid #0ea5e9;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: opacity 0.2s, background-color 0.2s;
  margin-left: auto;
  /* 將匯出按鈕推到最右側 */
}

.btn-export:hover {
  background-color: #0284c7;
}

/* ⭐ 平板滑動吸附核心 */
.cards-grid {
  flex: 1;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  gap: 20px;
  padding: 20px 0;
  /* 調整內距避免切到陰影 */
}

.cards-page {
  flex: 0 0 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
  scroll-snap-align: start;
}

.cards-grid>* {
  scroll-snap-align: start;
}

.cards-grid.grid-tablet {
  grid-template-columns: repeat(2, 1fr);
}

.no-data {
  color: #8da2b5;
  text-align: center;
  grid-column: 1 / -1;
  padding-top: 50px;
}

.cards-grid::-webkit-scrollbar {
  display: none;
}
</style>
