<template>
  <div class="home-container">
    <div class="filter-section">
      <input type="text" v-model="searchQuery" :placeholder="$t('common.search_placeholder')" class="search-input" />
      <button class="search-btn">🔍 {{ $t('common.search') }}</button>

      <button class="btn-export" @click="handleExport">
        <span class="icon">📥</span> 匯出 Excel報表
      </button>
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
import { exportToExcel } from '@/utils/export.js'; // 匯入轉檔工具

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

// 處理匯出 Excel 的邏輯
const handleExport = () => {
  // 針對「過濾後的平坦資料 (filteredPatients)」進行映射，而非分頁後的二維資料
  const exportData = filteredPatients.value.map((row, index) => {

    // 簡單的狀態文字轉換
    const statusMap = { 'normal': '正常', 'warning': '預警', 'danger': '緊急' }
    const heatMap = { 'normal': '正常', 'warning': '警戒' }
    const fatigueMap = { 'normal': '正常', 'warning': '警戒', 'recovery': '回復', 'no_data': '無資料' }

    return {
      "序號": index + 1,
      "姓名": row.name,
      "性別": row.gender,
      "年齡": row.age,
      "心率 (bpm)": row.hr,
      "血氧 (%)": row.spo2,
      "體溫 (°C)": row.temp,
      "血壓 (mmHg)": `${row.bpSys}/${row.bpDia}`,
      "HRV": row.hrv,
      "今日步數": row.step,
      "消耗熱量 (kcal)": row.kcal,
      "中暑風險": heatMap[row.heat] || '無資料',
      "疲勞度": fatigueMap[row.fatigue] || '無資料',
      "整體狀態": statusMap[row.status] || '正常',
      "設備電量 (%)": row.electricity,
      "所在位置": row.location
    }
  });

  exportToExcel(exportData, '健康監測卡片數據總表', []);
};
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
