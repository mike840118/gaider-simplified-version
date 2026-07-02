<template>
  <div class="table-container">
    <div style="display:flex; justify-content:flex-end; margin-bottom: 12px;">
      <button @click="handleExport"
        style="background:#0ea5e9; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">
        📥 匯出 Excel
      </button>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>序號</th>
          <th>大頭貼</th>
          <th>姓名</th>
          <th>性別</th>
          <th>來源</th>
          <th>數值</th>
          <th>狀態</th>
          <th>測量時間</th>
          <th>平台</th>
          <th>版本號</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in paginatedData" :key="row.id">
          <td>{{ row.index }}</td>
          <td>
            <div class="avatar-placeholder-sm">{{ row.rawGender === 'WOMAN' ? '👩' : '👨' }}</div>
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
          <td colspan="10" style="padding: 40px; color: #999; text-align: center;">查無資料</td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination :total="filteredData.length" :current="currentPage" @change="currentPage = $event" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Pagination from '@/components/Pagination.vue'
import { exportToExcel } from '@/utils/export.js'

const props = defineProps(['patients', 'metric', 'selectedUserId'])
const currentPage = ref(1)

watch([() => props.metric, () => props.selectedUserId], () => currentPage.value = 1)

// 🌟 扁平化展開所有歷史紀錄
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
        name: p.name || '未知',
        rawGender: p.gender,
        gender: p.gender === 'WOMAN' ? '女' : '男',
        mac: p.deviceCode || '--',
        value: val,
        levelCode: r.level,
        statusText: r.level === 'URGENT' ? '緊急' : r.level === 'WARN' ? '預警' : '正常',
        time: r.testTime.replace('T', ' ').substring(0, 19),
        rawTime: new Date(r.testTime).getTime(),
        platform: 'Android',
        version: 'V1.2.3'
      })
    })
  })

  // 依據時間由新到舊排序
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
    "序號": row.index, "姓名": row.name, "性別": row.gender, "來源": row.mac,
    "數值": row.value, "狀態": row.statusText, "測量時間": row.time
  }))
  exportToExcel(exportData, `健康歷史資料_${props.metric}`, [])
}
</script>

<style scoped>
.table-container {
  width: 100%;
  max-height: calc(100vh - 350px);
  overflow: auto;
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
