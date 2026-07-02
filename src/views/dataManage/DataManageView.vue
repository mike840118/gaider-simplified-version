<template>
  <div class="data-wrapper">
    <div class="user-sidebar">
      <div class="sidebar-header">{{ $t('data_manage.user_list', { count: patientsList.length }) }}</div>
      <div class="user-list-box">
        <div class="user-item" :class="{ active: selectedUserId === null }" @click="selectedUserId = null">
          <div class="user-icon placeholder">👥</div>
          <span class="user-name-text">{{ $t('data_manage.all_users', '全部用戶') }}</span>
        </div>

        <div v-for="user in patientsList" :key="user.accountId" class="user-item"
          :class="{ active: selectedUserId === user.accountId }" @click="selectedUserId = user.accountId">
          <div class="user-icon placeholder">
            {{ user.gender === 'WOMAN' ? '👩' : '👨' }}
          </div>
          <span class="user-name-text">{{ user.name || $t('common.unknown') }}</span>
        </div>
      </div>
    </div>
    <div class="data-content">
      <div class="metric-tabs">
        <button :class="{ active: currentMetric === 'bp' }" @click="currentMetric = 'bp'">{{ $t('data_manage.tabs.bp',
          '血壓') }}</button>
        <button :class="{ active: currentMetric === 'spo2' }" @click="currentMetric = 'spo2'">{{
          $t('data_manage.tabs.spo2', '血氧') }}</button>
        <button :class="{ active: currentMetric === 'hr' }" @click="currentMetric = 'hr'">{{ $t('data_manage.tabs.hr',
          '心率') }}</button>
        <button :class="{ active: currentMetric === 'temp' }" @click="currentMetric = 'temp'">{{
          $t('data_manage.tabs.temp', '體溫') }}</button>
        <button :class="{ active: currentMetric === 'hrv' }" @click="currentMetric = 'hrv'">{{
          $t('data_manage.tabs.hrv', 'HRV') }}</button>
      </div>

      <div class="sub-tabs">
        <span :class="{ active: subTab === 'history' }" @click="subTab = 'history'">{{
          $t('data_manage.sub_tabs.history', '歷史資料') }}</span>
        <span :class="{ active: subTab === 'alert' }" @click="subTab = 'alert'">{{ $t('data_manage.sub_tabs.alert',
          '警報資料') }}</span>
        <span :class="{ active: subTab === 'analysis' }" @click="subTab = 'analysis'">{{
          $t('data_manage.sub_tabs.analysis', '統計分析') }}</span>
      </div>

      <DataHistoryTab v-if="subTab === 'history'" :patients="patientsList" :metric="currentMetric"
        :selectedUserId="selectedUserId" />
      <DataAlertTab v-else-if="subTab === 'alert'" :patients="patientsList" :metric="currentMetric"
        :selectedUserId="selectedUserId" />
      <DataAnalysisTab v-else-if="subTab === 'analysis'" :patients="patientsList" :metric="currentMetric"
        :selectedUserId="selectedUserId" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 🌟 匯入您新產生的三萬筆資料庫
import rawPatientData from '@/mock/patients_new.json'

import DataHistoryTab from './components/DataHistoryTab.vue'
import DataAlertTab from './components/DataAlertTab.vue'
import DataAnalysisTab from './components/DataAnalysisTab.vue'

const subTab = ref('history')
const currentMetric = ref('hr')
const selectedUserId = ref(null)

const patientsList = ref(rawPatientData.data.data)
</script>

<style scoped>
/* (保留您原本 DataManageView 的所有樣式，此處省略以節省版面) */
.data-wrapper {
  display: flex;
  gap: 20px;
  background: #f4f7f9;
  padding: 16px;
  height: calc(100vh - 100px);
  border-radius: 8px;
  color: #333;
  font-family: sans-serif;
}

.user-sidebar {
  width: 240px;
  background: white;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar-header {
  background: #2f4955;
  color: white;
  padding: 12px;
  font-weight: bold;
  font-size: 15px;
  flex-shrink: 0;
}

.user-list-box {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-item {
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  color: #555;
  border: 1px solid transparent;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-item:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.user-item.active {
  background: #e0f2fe;
  border-color: #3b82f6;
  color: #1d4ed8;
  font-weight: bold;
}

.user-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
}

.user-icon.placeholder {
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 1px solid #cbd5e1;
}

.user-name-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.data-content {
  flex: 1;
  background: white;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.metric-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
  flex-shrink: 0;
}

.metric-tabs button {
  padding: 6px 20px;
  border: 1px solid #cbd5e1;
  background: white;
  color: #64748b;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.metric-tabs button.active {
  background: #e0f2fe;
  border-color: #3bc8f6;
  color: #3bc8f6;
  font-weight: bold;
}

.sub-tabs {
  display: flex;
  gap: 16px;
  font-size: 15px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 8px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.sub-tabs span {
  cursor: pointer;
  color: #666;
  position: relative;
  padding-bottom: 4px;
}

.sub-tabs span.active {
  color: #3bc8f6;
  font-weight: bold;
}

.sub-tabs span.active::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 3px;
  background: #3bc8f6;
}
</style>
