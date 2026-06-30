<template>
    <div class="alert-panel-container">
        <div class="filter-bar">
            <input type="text" class="filter-input" :placeholder="$t('alert_panel.search_name')" />
            <input type="text" class="filter-input" :placeholder="$t('alert_panel.search_mac')" />
            <div class="date-input-wrapper">
                <span class="icon-calendar">📅</span>
                <input type="date" class="filter-date" value="2026-05-31" />
            </div>
            <div class="date-input-wrapper">
                <span class="icon-calendar">📅</span>
                <input type="date" class="filter-date" value="2026-06-30" />
            </div>
            <button class="btn btn-search">
                <span class="icon">🔍</span> {{ $t('alert_panel.btn_search') }}
            </button>
            <button class="btn btn-export">
                <span class="icon">📥</span> {{ $t('alert_panel.btn_export') }}
            </button>
        </div>

        <div class="table-container">
            <table class="alert-table">
                <thead>
                    <tr>
                        <th width="5%">{{ $t('alert_panel.table.index', '序號') }}</th>
                        <th width="15%">{{ $t('alert_panel.table.alert_time', '警報時間') }}</th>
                        <th width="15%">{{ $t('alert_panel.table.name', '姓名') }}</th>
                        <th width="12%">{{ $t('alert_panel.table.phone', '聯絡電話') }}</th>
                        <th width="15%">{{ $t('alert_panel.table.source', '來源') }}</th>
                        <th width="10%">{{ $t('alert_panel.table.device_model', '設備型號') }}</th>
                        <th width="10%">{{ $t('alert_panel.table.status', '處理狀態') }}</th>
                        <th width="10%">{{ $t('alert_panel.table.record', '處理記錄') }}</th>
                        <th width="10%">{{ $t('alert_panel.table.action', '操作') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in mockAlerts" :key="item.id">
                        <td class="text-center">{{ index + 1 }}</td>
                        <td class="text-center">{{ item.time }}</td>
                        <td class="text-center">{{ item.name }}</td>
                        <td class="text-center">{{ item.phone }}</td>
                        <td class="text-center">{{ item.mac }}</td>
                        <td class="text-center">{{ item.model }}</td>
                        <td class="text-center text-red">{{ item.status }}</td>
                        <td class="text-center">{{ item.record }}</td>
                        <td class="text-center">
                            <a href="#" class="edit-link" @click.prevent="">{{ $t('alert_panel.edit', '✎ 編輯') }}</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
// 引入您的 patients.json 資料
import rawPatientData from '@/mock/patients.json'

const { t } = useI18n()

// 抓取 JSON 中有警報狀態的資料 (sos 為 true，或者是 level 不是 NORMAL)
const alertPatients = rawPatientData.data.data.filter(p => p.sos || p.level !== 'NORMAL')

// 動態映射資料到表格
const mockAlerts = ref(alertPatients.map((p, index) => {
    // 格式化時間：將 JSON 中的 "2026-06-24T08:03:38Z" 替換成 "2026-06-24 08:03:38"
    const formattedTime = p.newTestTime ? p.newTestTime.replace('T', ' ').replace('Z', '') : ''

    return {
        id: p.accountId || index,
        time: formattedTime,
        name: p.name || '未知使用者',
        phone: '無資料', // JSON 中目前沒有提供電話欄位
        mac: p.deviceCode || '未知設備',
        model: '900P', // JSON 中目前無型號，先用假資料代替
        status: p.sos ? t('status.urgent', '緊急') : t('alert_panel.unhandled', '未處理'),
        record: ''
    }
}))
</script>

<style scoped>
.alert-panel-container {
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    padding: 20px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

/* 頂部搜尋區 */
.filter-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    align-items: center;
}

.filter-input,
.filter-date {
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
    outline: none;
}

.filter-input {
    width: 180px;
}

.filter-input::placeholder {
    color: #bfbfbf;
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
    pointer-events: none;
}

.filter-date {
    padding-left: 32px;
    width: 130px;
    color: #555;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: opacity 0.2s;
}

.btn:hover {
    opacity: 0.8;
}

.btn-search,
.btn-export {
    background-color: #3bc8f6;
}

/* 表格區 */
.table-container {
    flex: 1;
    overflow-y: auto;
}

.alert-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    color: #333;
}

.alert-table th,
.alert-table td {
    padding: 16px 8px;
    border-bottom: 1px solid #f0f0f0;
}

.alert-table th {
    font-weight: bold;
    color: #262626;
}

.text-center {
    text-align: center;
}

.text-red {
    color: #ff4d4f;
}

.edit-link {
    color: #1890ff;
    text-decoration: none;
    font-size: 13px;
}

.edit-link:hover {
    text-decoration: underline;
}

/* 分頁區 */
.pagination-bar {
    display: flex;
    align-items: center;
    margin-top: 20px;
    font-size: 13px;
    color: #666;
}

.total-count {
    margin-right: 16px;
}

.page-select {
    padding: 4px 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    margin-right: 24px;
    color: #666;
}

.page-numbers {
    display: flex;
    gap: 4px;
    margin-right: 24px;
}

.page-btn {
    min-width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #d9d9d9;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    color: #333;
}

.page-btn.active {
    background: #3bc8f6;
    color: white;
    border-color: #3bc8f6;
}

.page-btn.text-gray {
    color: #ccc;
    cursor: not-allowed;
}

.page-jump {
    display: flex;
    align-items: center;
    gap: 8px;
}

.jump-input {
    width: 40px;
    height: 32px;
    text-align: center;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
}
</style>