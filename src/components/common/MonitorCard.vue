<template>
  <div
    :class="['monitor-card', info.status === 'danger' ? 'monitor-red' : info.status === 'warning' ? 'monitor-yellow' : 'monitor-green']">
    <div class="sosDialog" v-if="info.sos">
      <div class="sosTag">
        <div class="sosBtn" @click="handleToLocation(info.id)">sos</div>
      </div>
    </div>

    <div class="header">
      <div class="header-left">
        <a class="avatar-wrap" @click="routeUserInfo(info.id)">
          <div class="avatar">
            <img v-if="info.hasAvatar" :src="info.avatarUrl" alt="avatar" />

            <div v-else style="font-size: 24px; text-align:center; line-height:40px;">
              <img :src="personIcon" alt="Person" />
            </div>
          </div>
        </a>
        <div class="user-basic">
          <div class="name"><a>{{ info.name || $t('common.unknown') }}</a></div>
          <div class="age-gender">
            <span>{{ info.age }}{{ $t('common.age') }}</span>
            <span class="gender-text">{{ info.gender }}</span>
          </div>
        </div>
      </div>
      <div class="header-right">
        <a @click="setUserInfo(info.id)">
          <img :src="editIcon" class="edit-icon" alt="edit" />
        </a>
        <div :style="{
          position: 'absolute',
          top: '32px',
          right: '10px',
          lineHeight: '1',
          fontSize: '12px',
          color: info.electricity < 20 ? '#D66764' : '#88B74F'
        }">
          🔋 {{ info.electricity }}%
        </div>
      </div>
    </div>

    <div class="data-grid">
      <div class="grid-item g-hr" @click="routeUserInfo(info.id, 'heartRate')">
        <div class="label c-hr"> <img :src="hrIcon" class="edit-icon" alt="edit" /> {{ $t('card.hr') }}</div>
        <div class="value">{{ info.hr }}<span class="unit">bpm</span></div>
      </div>

      <div class="grid-item g-spo2" @click="routeUserInfo(info.id, 'bloodOxygen')">
        <div class="label c-spo2"><img :src="SpO2Icon" class="edit-icon" alt="edit" /> {{ $t('card.spo2') }}</div>
        <div class="value">{{ info.spo2 }}<span class="unit">%</span></div>
      </div>

      <div class="grid-item g-temp" @click="routeUserInfo(info.id, 'temperature')">
        <div class="label c-temp"><img :src="TempIcon" class="edit-icon" alt="edit" /> {{ $t('card.temp') }}</div>
        <div class="value">{{ info.temp }}<span class="unit">°C</span></div>
      </div>

      <div class="grid-item g-bp" @click="routeUserInfo(info.id, 'bloodPressure')"
        :class="info.bpAlert ? 'bkBorder-red' : ''">
        <div class="label c-bp"><img :src="BpIcon" class="edit-icon" alt="edit" /> {{ $t('card.bp') }}</div>
        <div class="value">{{ info.bpSys }}/{{ info.bpDia }}<span class="unit">mmHg</span></div>
      </div>

      <div class="grid-item g-hrv" @click="routeUserInfo(info.id, 'rri')">
        <div class="label c-hrv"><img :src="HrvIcon" class="edit-icon" alt="edit" /> {{ $t('card.hrv') }}</div>
        <div class="value">{{ info.hrv }}</div>
      </div>

      <div class="grid-item g-step" @click="routeUserInfo(info.id, 'yd')">
        <div class="label c-step"><img :src="StepIcon" class="edit-icon" alt="edit" /> {{ $t('card.step') }}</div>
        <div class="value">{{ info.step }}</div>
      </div>

      <div class="grid-item g-chart" @click="routeUserInfo(info.id, 'rri')">
        <div class="rri-label">RRI</div>
        <div ref="chartRef" class="chart"></div>
      </div>

      <div class="grid-item g-kcal" @click="routeUserInfo(info.id, 'yd')">
        <div class="label c-kcal"><img :src="KcalIcon" class="edit-icon" alt="edit" /> {{ $t('card.kcal') }}</div>
        <div class="value">{{ info.kcal }}</div>
      </div>

      <div class="grid-item g-heat" @click="routeUserInfo(info.id, 'sunstroke')">
        <div class="status-icon-wrap c-heat-bg">
          <img :src="HeatStrokeIcon" class="edit-icon" alt="edit" />
        </div>
        <div class="status-text">
          <div class="s-label">{{ $t('card.heat_stroke') }}</div>
          <div class="s-value" :class="info.heat === 'warning' ? 'c-red' : 'c-green'">
            {{ info.heat ? $t('status.' + info.heat) : '--' }}
          </div>
        </div>
      </div>

      <div class="grid-item g-fatigue" @click="routeUserInfo(info.id, 'fatigue')">
        <div :style="{
          position: 'absolute',
          top: '32px',
          right: '10px',
          lineHeight: '1',
          fontSize: '12px',
          color: batteryColor
        }">
          {{ batteryIcon }} {{ info.electricity }}%
        </div>
        <div class="status-icon-wrap c-heat-bg">
          <img :src="TiredIcon" class="edit-icon" alt="edit" />
        </div>
        <div class="status-text">

          <div class="s-label">{{ $t('card.fatigue') }}</div>
          <div class="s-value"
            :class="info.fatigue === 'recovery' ? 'c-blue' : (info.fatigue === 'warning' ? 'c-red' : 'c-green')">
            {{ info.fatigue ? $t('status.' + info.fatigue) : '--'
            }}
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="org">
        <span style="margin-right: 4px;">📶</span> {{ info.location }}
      </div>
      <div class="time">{{ info.time }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import personIcon from '@/assets/icons/Profile.png'
import editIcon from '@/assets/icons/monitorCard/Edit.svg'
import hrIcon from '@/assets/icons/monitorCard/HR.svg'
import SpO2Icon from '@/assets/icons/monitorCard/SpO2.svg'
import TempIcon from '@/assets/icons/monitorCard/Temp.svg'
import BpIcon from '@/assets/icons/monitorCard/Bp.svg'
import HrvIcon from '@/assets/icons/monitorCard/HRV.svg'
import StepIcon from '@/assets/icons/monitorCard/Step.svg'
import KcalIcon from '@/assets/icons/monitorCard/kcal.svg'
import HeatStrokeIcon from '@/assets/icons/monitorCard/HeatStroke.svg'
import TiredIcon from '@/assets/icons/monitorCard/Tired.svg'
const props = defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['handleToLocation', 'setUserInfo', 'routeUserInfo'])

const chartRef = ref(null)
let chartInstance = null

const handleToLocation = (id) => emit('handleToLocation', id)
const setUserInfo = (id) => emit('setUserInfo', id)
const routeUserInfo = (id, path) => emit('routeUserInfo', id, path)
const batteryIcon = computed(() => {
  const val = props.info.electricity
  if (val >= 90) return '🔋'   // 全滿
  if (val >= 60) return '🔋'   // 7成 (這裡您可以用不同圖示，例如 🪫 有一半)
  if (val >= 20) return '🪫'   // 3成
  return '🪫'                 // 0成 (低電量)
})

// 設定顏色邏輯
const batteryColor = computed(() => {
  const val = props.info.electricity
  if (val >= 60) return '#88B74F' // 綠色
  if (val >= 20) return '#E7AF57' // 黃色 (3成)
  return '#D66764'               // 紅色 (0成)
})
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  const mockData = Array.from({ length: 60 }, () => Math.floor(Math.random() * 200) + 600)

  const option = {
    grid: { top: 8, bottom: 0, left: -10, right: -10 },
    xAxis: { show: false, type: "category", data: Array(mockData.length).fill("") },
    yAxis: { show: false, type: "value", min: 'dataMin', max: 'dataMax' },
    backgroundColor: 'rgba(0, 0, 0, 0)',
    series: [
      {
        data: mockData,
        type: "line",
        smooth: 0.4,
        showSymbol: false,
        lineStyle: { color: "#56CCEC", width: 1.5 },
        areaStyle: { opacity: 0.1, color: "#56CCEC" }
      }
    ]
  }
  chartInstance.setOption(option)
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})
</script>

<style scoped>
/* 這裡的 CSS 完全保持與你剛才提供的一致，不需任何更動 */
* {
  box-sizing: border-box;
}

.monitor-card {
  width: 100%;
  height: 100%;
  background: #192731;
  border-radius: 12px;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
  padding: 10px;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.monitor-card img {
  width: 18px;
}

.monitor-green {
  border: 4px solid #88B74F;
}

.monitor-red {
  border: 4px solid #D66764;
}

.monitor-yellow {
  border: 4px solid #E7AF57;
}

.sosDialog {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.sosDialog .sosTag {
  width: 100px;
  height: 40px;
  background: rgba(168, 42, 39, 0.4);
  border-radius: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 9px 3px #a82a27;
}

.sosDialog .sosBtn {
  width: 90px;
  height: 34px;
  background: #a82a27;
  border-radius: 34px;
  text-align: center;
  line-height: 34px;
  color: #fff;
  cursor: pointer;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #111;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #2F4955;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-basic {
  display: flex;
  flex-direction: column;
}

.name a {
  font-size: 16px;
  font-weight: bold;
  color: #88c0d0;
  text-decoration: none;
}

.age-gender {
  font-size: 12px;
  color: #b0c4de;
  margin-top: 2px;
}

.gender-text {
  margin-left: 10px;
}

.header-right {
  cursor: pointer;
}

.edit-icon {
  font-size: 10px !important;
  color: #5f7a8c;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1px;
  background-color: #2F4955;
  border: 1px solid #2F4955;
  border-radius: 8px;
  overflow: hidden;
}

.grid-item {
  background-color: #1e2a33;
  padding: 6px 6px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.grid-item:hover {
  background-color: #263642;
}

.g-hr {
  grid-column: span 4;
}

.g-spo2 {
  grid-column: span 4;
}

.g-temp {
  grid-column: span 4;
}

.g-bp {
  grid-column: span 6;
}

.g-hrv {
  grid-column: span 3;
}

.g-step {
  grid-column: span 3;
}

.g-kcal {
  grid-column: span 3;
}

.g-chart {
  grid-column: span 9;
  position: relative;
  padding: 0;
  min-height: 50px;
}

.g-heat {
  grid-column: span 6;
  flex-direction: row;
  gap: 6px;
  align-items: center;
}

.g-fatigue {
  grid-column: span 6;
  flex-direction: row;
  gap: 6px;
  align-items: center;
}

.label {
  font-size: 10px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
  font-weight: 500;
}

.icon-small {
  font-size: 14px;
}

.value {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  align-items: baseline;
}

.unit {
  font-size: 10px;
  color: #b0c4de;
  font-weight: normal;
  margin-left: 2px;
}

.g-hr .value,
.g-spo2 .value,
.g-temp .value {
  font-size: 18px;
}

.g-hrv .value,
.g-step .value,
.g-kcal .value {
  font-size: 15px;
}

.status-icon-wrap {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon {
  font-size: 16px;
}

.status-text {
  text-align: left;
  display: flex;
  flex-direction: column;
}

.s-label {
  font-size: 9px;
  color: #b0c4de;
  margin-bottom: 0px;
}

.s-value {
  font-size: 12px;
  font-weight: bold;
}

.rri-label {
  position: absolute;
  top: 2px;
  right: 6px;
  font-size: 9px;
  color: #b0c4de;
  z-index: 2;
}

.chart {
  width: 100%;
  height: 100%;
}

.c-hr {
  color: #f472b6;
}

.c-spo2 {
  color: #38bdf8;
}

.c-temp {
  color: #fb923c;
}

.c-bp {
  color: #818cf8;
}

.c-hrv {
  color: #f472b6;
}

.c-step {
  color: #94a3b8;
}

.c-kcal {
  color: #94a3b8;
}

.c-heat {
  color: #f87171;
}

.c-heat-bg {
  background: rgba(248, 113, 113, 0.15);
}

.c-fatigue {
  color: #4ade80;
}

.c-fatigue-bg {
  background: rgba(74, 222, 128, 0.15);
}

.c-red {
  color: #D66764;
}

.c-green {
  color: #83C03D;
}

.c-blue {
  color: #56CCEC;
}

.c-orange {
  color: #E7AF57;
}

.c-gray {
  color: #94a3b8;
}

.bkBorder {
  border: 1px solid #7c0808da;
  color: white;
  background-color: #7c0808da !important;
}

.bkBorder-red {
  border: 1px solid #7c0808da;
  color: white;
  background-color: #7c0808da !important;
}

.bkBorder-orange {
  border: 1px solid #c27d0e;
  color: white;
  background-color: #a36502 !important;
}

.bkBorder-blue,
.bkBorder-green {
  background-color: #1e2a33 !important;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 10px;
  color: #b0c4de;
}

.org {
  display: flex;
  align-items: center;
}
</style>
