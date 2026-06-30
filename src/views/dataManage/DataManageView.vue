<template>
    <div class="data-wrapper">
        <div class="user-sidebar">
            <div class="sidebar-header">{{ $t('data_manage.user_list', { count: patientsList.length }) }}</div>
            <div class="user-list-box">
                <div class="user-item" :class="{ active: selectedUserId === null }" @click="selectedUserId = null">
                    <div class="user-icon placeholder">👥</div>
                    <span class="user-name-text">{{ $t('data_manage.all_users') }}</span>
                </div>

                <div v-for="user in patientsList" :key="user.accountId" class="user-item"
                    :class="{ active: selectedUserId === user.accountId }" @click="selectedUserId = user.accountId">
                    <img v-if="user.url" :src="user.url" class="user-icon photo" alt="avatar" />
                    <div v-else class="user-icon placeholder">
                        {{ user.gender === 'WOMAN' ? '👩' : '👨' }}
                    </div>
                    <span class="user-name-text">{{ user.name || $t('common.unknown') }}</span>
                </div>
            </div>
        </div>
        <div class="data-content">
            <div class="metric-tabs">
                <button :class="{ active: currentMetric === 'bp' }" @click="currentMetric = 'bp'">{{
                    $t('data_manage.tabs.bp', '血壓') }}</button>
                <button :class="{ active: currentMetric === 'spo2' }" @click="currentMetric = 'spo2'">{{
                    $t('data_manage.tabs.spo2', '血氧') }}</button>
                <button :class="{ active: currentMetric === 'hr' }" @click="currentMetric = 'hr'">{{
                    $t('data_manage.tabs.hr', '心率') }}</button>
                <button :class="{ active: currentMetric === 'temp' }" @click="currentMetric = 'temp'">{{
                    $t('data_manage.tabs.temp', '體溫') }}</button>
                <button :class="{ active: currentMetric === 'hrv' }" @click="currentMetric = 'hrv'">{{
                    $t('data_manage.tabs.hrv', 'HRV') }}</button>
            </div>

            <div class="sub-tabs">
                <span :class="{ active: subTab === 'history' }" @click="subTab = 'history'">歷史資料</span>
                <span :class="{ active: subTab === 'alert' }" @click="subTab = 'alert'">警報資料</span>
                <span :class="{ active: subTab === 'analysis' }" @click="subTab = 'analysis'">統計分析</span>
            </div>

            <template v-if="subTab === 'history'">
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>{{ $t('data_manage.table.index') }}</th>
                                <th>{{ $t('data_manage.table.avatar') }}</th>
                                <th>{{ $t('data_manage.table.name') }}</th>
                                <th>{{ $t('data_manage.table.gender') }}</th>
                                <th>{{ $t('data_manage.table.mac') }}</th>
                                <th>
                                    {{ $t('data_manage.table.value') }}
                                    <span class="unit-hint">
                                        {{ currentMetric === 'bp' ? '(mmHg)' : currentMetric === 'spo2' ? '(%)' :
                                            currentMetric === 'hr' ? '(bpm)' : currentMetric === 'temp' ? '(°C)' : '' }}
                                    </span>
                                </th>
                                <th>{{ $t('data_manage.table.status') }}</th>
                                <th>{{ $t('data_manage.table.measure_time') }}</th>
                                <th>{{ $t('data_manage.table.platform') }}</th>
                                <th>{{ $t('data_manage.table.version') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in paginatedTableData" :key="row.id"
                                :class="{ highlighted: index % 2 !== 0 }">
                                <td>{{ row.index }}</td>
                                <td>
                                    <div class="table-avatar-container">
                                        <img v-if="row.hasAvatar" :src="row.avatarUrl" class="avatar-photo-sm"
                                            alt="avatar" />
                                        <div v-else class="avatar-placeholder-sm">{{ row.rawGender === 'WOMAN' ? '👩' :
                                            '👨' }}</div>
                                    </div>
                                </td>
                                <td>{{ row.name }}</td>
                                <td>{{ row.gender }}</td>
                                <td class="mac-text">{{ row.mac }}</td>
                                <td class="bold">{{ row.value }}</td>
                                <td>
                                    <span class="status-tag" :class="getStatusColor(row.levelCode)">
                                        {{ row.statusText }}
                                    </span>
                                </td>
                                <td>{{ row.time }}</td>
                                <td>{{ row.platform }}</td>
                                <td>{{ row.version }}</td>
                            </tr>
                            <tr v-if="paginatedTableData.length === 0">
                                <td colspan="10" style="padding: 40px; color: #999;">{{
                                    $t('data_manage.table.no_data_in_category') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table-footer" v-if="filteredTableData.length > 0">
                    <span>{{ $t('pagination.total', { count: filteredTableData.length }) }}</span>
                    <select class="page-size" disabled>
                        <option>{{ $t('pagination.page_size', { size: itemsPerPage }) }}</option>
                    </select>
                    <div class="pagination-row">
                        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
                        <button v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }"
                            @click="changePage(page)">{{ page }}</button>
                        <button @click="changePage(currentPage + 1)"
                            :disabled="currentPage === totalPages">&gt;</button>
                    </div>
                    <span>{{ $t('pagination.goto') }} <input type="number" v-model.number="currentPage" min="1"
                            :max="totalPages" class="goto-input" /> {{ $t('pagination.page') }}</span>
                </div>
            </template>

            <DataAlertTab v-else-if="subTab === 'alert'" :patients="patientsList" :metric="currentMetric"
                :selectedUserId="selectedUserId" />

            <DataAnalysisTab v-else-if="subTab === 'analysis'" :patients="patientsList" :metric="currentMetric"
                :selectedUserId="selectedUserId" />

        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import rawPatientData from '@/mock/patients.json'

// 引入新寫的兩個子元件 (請依照實際路徑調整)
import DataAlertTab from './components/DataAlertTab.vue'
import DataAnalysisTab from './components/DataAnalysisTab.vue'

const { t } = useI18n()

const currentMetric = ref('hr') // 預設切換到心率
const subTab = ref('alert')     // 預設切換到警報資料以符合截圖
const selectedUserId = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

const patientsList = ref(rawPatientData.data.data)

const formatStatus = (level) => {
    if (level === 'NORMAL') return t('status.normal', '正常')
    if (level === 'WARN') return t('status.warn', '預警')
    if (level === 'URGENT') return t('status.urgent', '緊急')
    return t('status.no_data', '無資料')
}

const getStatusColor = (levelCode) => {
    if (levelCode === 'NORMAL') return 'text-green'
    if (levelCode === 'WARN') return 'text-yellow'
    if (levelCode === 'URGENT') return 'text-red'
    return 'text-gray'
}

const filteredTableData = computed(() => {
    let list = patientsList.value
    if (selectedUserId.value) list = list.filter(p => p.accountId === selectedUserId.value)

    const mappedList = list.map((p, index) => {
        let val = '--', levelCode = null, timeStr = '--'
        const d = p.data || {}

        if (currentMetric.value === 'bp') { val = (d.BloodPressure?.sbp && d.BloodPressure?.dbp) ? `${d.BloodPressure.sbp} / ${d.BloodPressure.dbp}` : '--'; levelCode = d.BloodPressure?.level; timeStr = d.BloodPressure?.testTime || '--'; }
        else if (currentMetric.value === 'spo2') { val = d.BloodOxygen?.bo ? `${d.BloodOxygen.bo}` : '--'; levelCode = d.BloodOxygen?.level; timeStr = d.BloodOxygen?.testTime || '--'; }
        else if (currentMetric.value === 'hr') { val = d.HeartBeat?.hb ? `${d.HeartBeat.hb}` : '--'; levelCode = d.HeartBeat?.level; timeStr = d.HeartBeat?.testTime || '--'; }
        else if (currentMetric.value === 'temp') { val = d.BodyTemp?.bodyTemp ? `${d.BodyTemp.bodyTemp}` : '--'; levelCode = d.BodyTemp?.level; timeStr = d.BodyTemp?.testTime || '--'; }
        else if (currentMetric.value === 'hrv') { val = d.HDRri?.hrv ? `${d.HDRri.hrv}` : '--'; levelCode = d.HeartBeat?.level; timeStr = d.HDRri?.testTime || '--'; }

        if (timeStr !== '--') timeStr = timeStr.replace('T', ' ').substring(0, 16)

        return {
            id: p.accountId, index: index + 1, name: p.name || t('common.unknown'),
            gender: p.gender === 'WOMAN' ? '女' : '男', rawGender: p.gender,
            hasAvatar: !!p.url, avatarUrl: p.url, mac: p.deviceCode || '--',
            value: val, levelCode: levelCode, statusText: formatStatus(levelCode), time: timeStr,
            platform: p.deviceCode?.includes(':') ? 'Android' : 'iOS', version: 'V1.2.3'
        }
    })
    return mappedList.filter(item => item.value !== '--')
})

const totalPages = computed(() => Math.ceil(filteredTableData.value.length / itemsPerPage) || 1)
const paginatedTableData = computed(() => filteredTableData.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage))
const changePage = (page) => { if (page >= 1 && page <= totalPages.value) currentPage.value = page }

watch([currentMetric, selectedUserId], () => currentPage.value = 1)
</script>

<style scoped>
/* 原有的所有 CSS 保持不變，可直接保留 */
.table-avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar-photo-sm {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #cbd5e1;
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
    border: 1px solid #cbd5e1;
}

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

.user-icon.photo {
    object-fit: cover;
    border: 1px solid #cbd5e1;
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

.data-table th::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 2px;
    background: #e2e8f0;
}

.data-table td {
    padding: 12px;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
}

.data-table tr.highlighted {
    background-color: #f8fafc;
}

.mac-text {
    font-family: monospace;
    color: #555;
    font-size: 12px;
}

.bold {
    font-weight: bold;
    font-size: 15px;
}

.unit-hint {
    font-size: 11px;
    color: #94a3b8;
    font-weight: normal;
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

.text-gray {
    color: #9ca3af;
}

.table-footer {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #666;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
    flex-shrink: 0;
}

.page-size {
    padding: 4px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background: #f8fafc;
}

.pagination-row {
    display: flex;
    gap: 4px;
}

.pagination-row button {
    padding: 4px 10px;
    border: 1px solid #ccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;
}

.pagination-row button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.pagination-row button.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.goto-input {
    width: 40px;
    text-align: center;
    padding: 2px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>