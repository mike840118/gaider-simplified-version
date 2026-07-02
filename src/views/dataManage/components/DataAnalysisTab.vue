<template>
  <div class="analysis-tab-wrapper">
    <div class="filter-bar">
      <div class="date-input-wrapper">
        <span class="icon-calendar">📅</span>
        <input type="date" class="filter-date" value="2026-06-23" />
      </div>
      <span style="color: #666;">至</span>
      <div class="date-input-wrapper">
        <span class="icon-calendar">📅</span>
        <input type="date" class="filter-date" value="2026-06-30" />
      </div>
      <button class="btn btn-search"><span class="icon">🔍</span> 搜尋</button>

      <div class="toggle-switch">
        <span class="active">動態</span>
        <label class="switch"><input type="checkbox" checked><span class="slider round"></span></label>
        <span>靜態</span>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h4 class="chart-title">依狀態分析</h4>
        <div ref="statusChartRef" class="echart-container"></div>
      </div>

      <div class="chart-card">
        <h4 class="chart-title">依性別統計</h4>
        <div ref="genderChartRef" class="echart-container"></div>
      </div>

      <div class="chart-card full-width">
        <h4 class="chart-title">依年齡分析</h4>
        <div ref="ageChartRef" class="echart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  patients: Array,
  metric: String,
  selectedUserId: Number
})

const statusChartRef = ref(null)
const genderChartRef = ref(null)
const ageChartRef = ref(null)

let statusChart, genderChart, ageChart

// 分析資料邏輯 (動態計算)
const analyzeData = () => {
  let list = props.patients
  if (props.selectedUserId) list = list.filter(p => p.accountId === props.selectedUserId)

  let normalCount = 0, warnCount = 0, urgentCount = 0
  let maleCount = 0, femaleCount = 0

  // 簡單的假資料年齡分佈矩陣 [0-30, 31-40, 41-50, 51-60, 61-70, 71-80, 80+]
  let ageData = {
    normal: [50, 5, 2, 8, 10, 8, 3],
    warn: [2, 0, 1, 3, 1, 1, 0],
    urgent: [0, 0, 1, 2, 1, 2, 0]
  }

  list.forEach(p => {
    // 性別統計
    if (p.gender === 'WOMAN') femaleCount++
    else maleCount++

    // 狀態統計 (依據當前 metric)
    let levelCode = 'NORMAL'
    const d = p.data || {}
    if (props.metric === 'bp') levelCode = d.BloodPressure?.level || 'NORMAL'
    else if (props.metric === 'spo2') levelCode = d.BloodOxygen?.level || 'NORMAL'
    else if (props.metric === 'hr') levelCode = d.HeartBeat?.level || 'NORMAL'
    else if (props.metric === 'temp') levelCode = d.BodyTemp?.level || 'NORMAL'

    if (levelCode === 'URGENT') urgentCount++
    else if (levelCode === 'WARN') warnCount++
    else normalCount++
  })

  return { normalCount, warnCount, urgentCount, maleCount, femaleCount, ageData }
}

const renderCharts = () => {
  if (!statusChartRef.value || !genderChartRef.value || !ageChartRef.value) return
  const data = analyzeData()

  // 1. 狀態圓餅圖 (對齊圖片顏色：正常藍、預警綠、緊急黃)
  if (!statusChart) statusChart = echarts.init(statusChartRef.value)
  statusChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 10, top: 'center', icon: 'circle' },
    color: ['#63c2e6', '#66c2a5', '#ffd92f'],
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['40%', '50%'],
      data: [
        { value: data.normalCount, name: '正常' },
        { value: data.warnCount, name: '預警' },
        { value: data.urgentCount, name: '緊急' }
      ],
      label: { show: false }
    }]
  })

  // 2. 性別圓餅圖 (對齊圖片顏色：男紅、女藍)
  if (!genderChart) genderChart = echarts.init(genderChartRef.value)
  genderChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 10, top: 'center', icon: 'circle' },
    color: ['#f16b6f', '#63c2e6'],
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['40%', '50%'],
      data: [
        { value: data.maleCount || 1, name: '男' }, // 如果左側單選一人，圓餅圖可能只有一個值
        { value: data.femaleCount || 0, name: '女' }
      ],
      label: { show: false }
    }]
  })

  // 3. 年齡長條圖 (堆疊)
  if (!ageChart) ageChart = echarts.init(ageChartRef.value)
  ageChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { right: 10, top: 0, icon: 'circle' },
    color: ['#63c2e6', '#66c2a5', '#ffd92f'],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['0-30', '31-40', '41-50', '51-60', '61-70', '71-80', '80以上'], axisLine: { show: false }, axisTick: { show: false } },
    yAxis: { type: 'value', axisLabel: { formatter: '{value} %' }, splitLine: { lineStyle: { color: '#f0f0f0' } } },
    series: [
      { name: '正常', type: 'bar', stack: 'total', barWidth: '30%', data: data.ageData.normal },
      { name: '預警', type: 'bar', stack: 'total', data: data.ageData.warn },
      { name: '緊急', type: 'bar', stack: 'total', data: data.ageData.urgent }
    ]
  })
}

onMounted(() => nextTick(() => renderCharts()))
watch([() => props.metric, () => props.selectedUserId], () => renderCharts(), { deep: true })
</script>

<style scoped>
.analysis-tab-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding-right: 8px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
}

.date-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.date-input-wrapper .icon-calendar {
  position: absolute;
  left: 10px;
  font-size: 14px;
  color: #bfbfbf;
}

.filter-date {
  padding: 8px 12px 8px 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #555;
}

.btn-search {
  background-color: #3bc8f6;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}

/* Switch Toggle (共用) */
.toggle-switch {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #999;
}

.toggle-switch .active {
  color: #3bc8f6;
  font-weight: bold;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
}

input:checked+.slider {
  background-color: #3bc8f6;
}

input:checked+.slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

/* 圖表網格佈局 */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-card {
  background: white;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.chart-card.full-width {
  grid-column: span 2;
}

.chart-title {
  margin: 0 0 16px 0;
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.echart-container {
  width: 100%;
  height: 250px;
}
</style>
