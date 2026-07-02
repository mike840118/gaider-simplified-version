<template>
  <div class="table-container">
    <div class="filter-bar">
      <input type="text" class="filter-input" placeholder="請輸入使用者姓名" />
      <div class="date-input-wrapper">
        <span class="icon-calendar">📅</span>
        <input type="date" class="filter-date" value="2026-06-23" />
      </div>
      <span style="color: #666;">至</span>
      <div class="date-input-wrapper">
        <span class="icon-calendar">📅</span>
        <input type="date" class="filter-date" value="2026-06-30" />
      </div>
      <button class="btn btn-search">🔍 搜尋</button>
      <div class="toggle-switch">
        <span class="active">動態</span>
        <label class="switch"><input type="checkbox" checked><span class="slider round"></span></label>
        <span>靜態</span>
      </div>
    </div>

    <table class="alert-bubble-table">
      <thead>
        <tr>
          <th>序號</th>
          <th>大頭貼</th>
          <th>姓名</th>
          <th>性別</th>
          <th>來源</th>
          <th>數值 ⬍</th>
          <th>狀態 ⬍</th>
          <th>測量時間 ⬍</th>
          <th>平台</th>
          <th>版本號</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in paginatedData" :key="row.id" class="bubble-row">
          <td>{{ row.index }}</td>
          <td>
            <div class="avatar-placeholder-sm">{{ row.rawGender === 'WOMAN' ? '👩' : '👨' }}</div>
          </td>
          <td class="text-blue">{{ row.name }}</td>
          <td>{{ row.gender }}</td>
          <td class="mac-text">{{ row.mac }}</td>
          <td class="text-red bold">{{ row.value }}</td>
          <td :class="row.levelCode === 'URGENT' ? 'text-red bold' : 'text-yellow bold'">{{ row.statusText }}</td>
          <td>{{ row.time }}</td>
          <td>{{ row.platform }}</td>
          <td>{{ row.version }}</td>
        </tr>
        <tr v-if="paginatedData.length === 0">
          <td colspan="10" style="padding: 40px; color: #999;">太棒了！無任何警報資料</td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination :total="filteredData.length" :current="currentPage" @change="currentPage = $event" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Pagination from '@/components/Pagination.vue'

const props = defineProps(['patients', 'metric', 'selectedUserId'])
const currentPage = ref(1)

watch([() => props.metric, () => props.selectedUserId], () => currentPage.value = 1)

// 🌟 扁平化展開並過濾「僅限警報」
const filteredData = computed(() => {
  let list = props.patients || []
  if (props.selectedUserId) list = list.filter(p => p.accountId === props.selectedUserId)

  let allRecords = []
  list.forEach(p => {
    const records = p.records ? (p.records[props.metric] || []) : []
    records.forEach(r => {
      // 🚨 只挑選預警和緊急的資料
      if (r.level === 'WARN' || r.level === 'URGENT') {
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
          statusText: r.level === 'URGENT' ? '緊急' : '預警',
          time: r.testTime.replace('T', ' ').substring(0, 19),
          rawTime: new Date(r.testTime).getTime(),
          platform: 'Android',
          version: 'V1.2.3'
        })
      }
    })
  })

  return allRecords.sort((a, b) => b.rawTime - a.rawTime).map((item, i) => {
    item.index = i + 1
    return item
  })
})

const paginatedData = computed(() => filteredData.value.slice((currentPage.value - 1) * 10, currentPage.value * 10))
</script>

<style scoped>
/* 頂部過濾與開關 */
.filter-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  width: 160px;
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
  border-radius: 34px;
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
  border-radius: 50%;
}

input:checked+.slider {
  background-color: #3bc8f6;
}

input:checked+.slider:before {
  transform: translateX(20px);
}

/* 圓角泡泡表格設計 */
.table-container {
  flex: 1;
  overflow-y: auto;
  padding: 4px;
}

.alert-bubble-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
  text-align: center;
  font-size: 14px;
}

.alert-bubble-table th {
  color: #333;
  font-weight: bold;
  padding: 0 12px 8px 12px;
  border-bottom: none;
}

.bubble-row td {
  background: white;
  padding: 12px;
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  color: #555;
}

.bubble-row td:first-child {
  border-left: 1px solid #eaeaea;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
}

.bubble-row td:last-child {
  border-right: 1px solid #eaeaea;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}

.avatar-placeholder-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin: 0 auto;
}

.text-blue {
  color: #3bc8f6;
}

.text-yellow {
  color: #f59e0b;
}

.text-red {
  color: #ef4444;
}

.bold {
  font-weight: bold;
}

.mac-text {
  font-family: monospace;
  color: #888;
}
</style>
