<template>
  <div class="history-tab-wrapper">
    <div class="toolbar">
      <button @click="handleExport" class="btn-export">
        📥 {{ $t('history_tab.export_excel') }}
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>{{ $t('data_manage.table.index') }}</th>
            <th>{{ $t('data_manage.table.avatar') }}</th>
            <th>{{ $t('data_manage.table.name') }}</th>
            <th>{{ $t('data_manage.table.gender') }}</th>
            <th>{{ $t('data_manage.table.version') }}</th>
            <th>{{ $t('data_manage.table.value') }}</th>
            <th>{{ $t('data_manage.table.status') }}</th>
            <th>{{ $t('data_manage.table.measure_time') }}</th>
            <th>{{ $t('data_manage.table.platform') }}</th>
            <th>{{ $t('data_manage.table.version') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <td>{{ row.index }}</td>
            <td>
              <div class="avatar-placeholder-sm">
                <img v-if="row.avatar" :src="row.avatar" alt="User Avatar" class="user-avatar"
                  referrerpolicy="no-referrer" @error="row.avatar = null" />
                <img v-else :src="userIcon" alt="User Icon" style="width: 24px;" />
              </div>
            </td>
            <td>{{ row.name }}</td>
            <td>{{ row.gender }}</td>
            <td class="mac-text">{{ row.mac }}</td>
            <td class="bold">{{ row.value }}</td>
            <td><span :class="['status-tag', getStatusColor(row.levelCode)]">{{ row.statusText }}</span></td>
            <td>{{ row.time }}</td>
            <td>{{ row.platform }}</td>
            <td>{{ row.version }}</td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td colspan="10" style="padding: 40px; color: #999; text-align: center;">{{ $t('history_tab.no_data') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination :total="filteredData.length" :current="currentPage" @change="currentPage = $event" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Pagination from '@/components/Pagination.vue'
import { exportToExcel } from '@/utils/export.js'
import { useI18n } from 'vue-i18n'
import userIcon from '@/assets/icons/Profile.png'
const { t } = useI18n()

const props = defineProps(['patients', 'metric', 'selectedUserId'])
const currentPage = ref(1)

watch([() => props.metric, () => props.selectedUserId], () => currentPage.value = 1)

const filteredData = computed(() => {
  let list = props.patients || []
  if (props.selectedUserId) list = list.filter(p => p.accountId === props.selectedUserId)

  let allRecords = []
  list.forEach(p => {
    const records = p.records ? (p.records[props.metric] || []) : []
    records.forEach(r => {
      let val = '--'
      if (props.metric === 'bp') val = `${r.sbp}/${r.dbp}`
      else if (props.metric === 'spo2') val = r.bo
      else if (props.metric === 'hr') val = r.hb
      else if (props.metric === 'temp') val = r.bodyTemp
      else if (props.metric === 'hrv') val = r.hrv

      allRecords.push({
        id: p.accountId + '_' + r.testTime,
        avatar: p.url, // 取得 API 的圖片網址
        name: p.name || '未知',
        rawGender: p.gender,
        gender: p.gender === 'WOMAN' ? t('common.woman') : t('common.man'),
        mac: p.deviceCode || '--',
        value: val,
        levelCode: r.level,
        statusText: r.level === 'URGENT' ? t('status.urgent') : r.level === 'WARN' ? t('status.warning') : t('status.normal'),
        time: r.testTime.replace('T', ' ').substring(0, 19),
        rawTime: new Date(r.testTime).getTime(),
        platform: 'Android',
        version: 'V1.2.3'
      })
    })
  })

  return allRecords.sort((a, b) => b.rawTime - a.rawTime).map((item, i) => {
    item.index = i + 1
    return item
  })
})

const paginatedData = computed(() => filteredData.value.slice((currentPage.value - 1) * 10, currentPage.value * 10))

const getStatusColor = (code) => {
  if (code === 'URGENT') return 'text-red'
  if (code === 'WARN') return 'text-yellow'
  return 'text-green'
}

const handleExport = () => {
  const exportData = filteredData.value.map(row => ({
    [t('data_manage.table.index')]: row.index,
    [t('data_manage.table.name')]: row.name,
    [t('data_manage.table.gender')]: row.gender,
    [t('data_manage.table.mac')]: row.mac,
    [t('data_manage.table.value')]: row.value,
    [t('data_manage.table.status')]: row.statusText,
    [t('data_manage.table.time')]: row.time
  }))

  const fileName = `${t('data_manage.sub_tabs.historyData')}_${t(`card.${props.metric}`)}`
  exportToExcel(exportData, fileName, [])
}
</script>

<style scoped>
/* 整個 Tab 的最外層容器，確保它佔滿剩餘高度並允許內部彈性縮放 */
.history-tab-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* 匯出按鈕的工具列，固定在最上方 */
.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
  flex-shrink: 0;
  /* 確保不管下面表格多長，這裡都不會被壓縮或捲走 */
}

/* 美化匯出按鈕 */
.btn-export {
  background-color: #0ea5e9;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-export:hover {
  background-color: #0284c7;
}

/* 表格專屬的滾動容器 */
.table-container {
  width: 100%;
  flex: 1;
  /* 自動填滿工具列與分頁器中間的所有空間 */
  overflow: auto;
  /* 重點：捲軸只會出現在這裡 */
  border-bottom: 1px solid #e2e8f0;
}

.data-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  font-size: 13px;
  text-align: center;
}

.data-table th {
  background: #f8fafc;
  padding: 12px;
  color: #666;
  position: sticky;
  /* 讓表格標題固定在表頭 */
  top: 0;
  z-index: 10;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

.avatar-placeholder-sm {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin: 0 auto;
  overflow: hidden;
  /* 隱藏超出的圖片部分 */
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 自動縮放並裁切填滿 */
}

.mac-text {
  font-family: monospace;
  color: #555;
}

.bold {
  font-weight: bold;
  font-size: 15px;
}

.text-green {
  color: #10b981;
  font-weight: bold;
}

.text-yellow {
  color: #f59e0b;
  font-weight: bold;
}

.text-red {
  color: #ef4444;
  font-weight: bold;
}
</style>
