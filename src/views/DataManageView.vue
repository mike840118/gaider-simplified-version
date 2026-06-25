<template>
    <div class="data-wrapper">
        <div class="user-sidebar">
            <div class="sidebar-header">用戶列表 (共 {{ patientsList.length }} 人)</div>
            <div class="user-list-box">
                <div class="user-item" :class="{ active: selectedUserId === null }" @click="selectedUserId = null">
                    <div class="user-icon placeholder">👥</div>
                    <span class="user-name-text">全部用戶</span>
                </div>

                <div v-for="user in patientsList" :key="user.accountId" class="user-item"
                    :class="{ active: selectedUserId === user.accountId }" @click="selectedUserId = user.accountId">

                    <img v-if="user.url" :src="user.url" class="user-icon photo" alt="avatar" />

                    <div v-else class="user-icon placeholder">
                        {{ user.gender === 'WOMAN' ? '👩' : '👨' }}
                    </div>

                    <span class="user-name-text">{{ user.name || '未知' }}</span>
                </div>
            </div>
        </div>
        <div class="data-content">
            <div class="metric-tabs">
                <button :class="{ active: currentMetric === 'bp' }" @click="currentMetric = 'bp'">血壓</button>
                <button :class="{ active: currentMetric === 'spo2' }" @click="currentMetric = 'spo2'">血氧</button>
                <button :class="{ active: currentMetric === 'hr' }" @click="currentMetric = 'hr'">心率</button>
                <button :class="{ active: currentMetric === 'temp' }" @click="currentMetric = 'temp'">體溫</button>
                <button :class="{ active: currentMetric === 'hrv' }" @click="currentMetric = 'hrv'">HRV</button>
            </div>

            <div class="sub-tabs">
                <span :class="{ active: subTab === 'history' }" @click="subTab = 'history'">歷史資料</span>
                <span :class="{ active: subTab === 'alert' }" @click="subTab = 'alert'">警報資料</span>
                <span :class="{ active: subTab === 'analysis' }" @click="subTab = 'analysis'">統計分析</span>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>序號</th>
                            <th>大頭貼</th>
                            <th>姓名</th>
                            <th>性別</th>
                            <th>來源 (MAC)</th>
                            <th>
                                數值
                                <span class="unit-hint">
                                    {{ currentMetric === 'bp' ? '(mmHg)' : currentMetric === 'spo2' ? '(%)' :
                                        currentMetric
                                            === 'hr' ? '(bpm)' : currentMetric === 'temp' ? '(°C)' : '' }}
                                </span>
                            </th>
                            <th>狀態</th>
                            <th>測量時間</th>
                            <th>平台</th>
                            <th>版本號</th>
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
                                    <div v-else class="avatar-placeholder-sm">{{ row.gender === '女' ? '👩' : '👨' }}
                                    </div>
                                </div>
                            </td>
                            <td>{{ row.name }}</td>
                            <td>{{ row.gender }}</td>
                            <td class="mac-text">{{ row.mac }}</td>
                            <td class="bold">{{ row.value }}</td>
                            <td>
                                <span class="status-tag" :class="getStatusColor(row.status)">
                                    {{ row.status }}
                                </span>
                            </td>
                            <td>{{ row.time }}</td>
                            <td>{{ row.platform }}</td>
                            <td>{{ row.version }}</td>
                        </tr>
                        <tr v-if="paginatedTableData.length === 0">
                            <td colspan="10" style="padding: 40px; color: #999;">此分類尚無測量資料</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-footer" v-if="filteredTableData.length > 0">
                <span>共 {{ filteredTableData.length }} 項</span>
                <select class="page-size" disabled>
                    <option>{{ itemsPerPage }}項/頁</option>
                </select>
                <div class="pagination-row">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
                    <button v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }"
                        @click="changePage(page)">
                        {{ page }}
                    </button>
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
                </div>
                <span>前往 <input type="number" v-model.number="currentPage" min="1" :max="totalPages"
                        class="goto-input" /> 頁</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// ⭐ 引入我們先前存好的 JSON 檔案
import rawPatientData from '@/mock/patients.json'

// 狀態管理
const currentMetric = ref('bp') // bp | spo2 | hr | temp | hrv
const subTab = ref('history')
const selectedUserId = ref(null) // null 代表顯示全部
const currentPage = ref(1)
const itemsPerPage = 10

// 解析 JSON 資料
const patientsList = ref(rawPatientData.data.data)

// 將英文狀態轉換為中文
const formatStatus = (level) => {
    if (level === 'NORMAL') return '正常'
    if (level === 'WARN') return '預警'
    if (level === 'URGENT') return '緊急'
    return '無資料'
}

// 根據狀態取得對應的 CSS class
const getStatusColor = (status) => {
    if (status === '正常') return 'text-green'
    if (status === '預警') return 'text-yellow'
    if (status === '緊急') return 'text-red'
    return 'text-gray'
}

// 核心資料轉換器：依據目前選中的指標 (currentMetric) 動態產生表格資料
const filteredTableData = computed(() => {
    // 1. 過濾選中的用戶
    let list = patientsList.value
    if (selectedUserId.value) {
        list = list.filter(p => p.accountId === selectedUserId.value)
    }

    // 2. 映射對應的資料
    const mappedList = list.map((p, index) => {
        let val = '--'
        let status = '無資料'
        let timeStr = '--'
        const d = p.data || {}

        // 依據上方 Tab 切換讀取的子物件
        if (currentMetric.value === 'bp') {
            val = (d.BloodPressure?.sbp && d.BloodPressure?.dbp) ? `${d.BloodPressure.sbp} / ${d.BloodPressure.dbp}` : '--'
            status = formatStatus(d.BloodPressure?.level)
            timeStr = d.BloodPressure?.testTime || '--'
        }
        else if (currentMetric.value === 'spo2') {
            val = d.BloodOxygen?.bo ? `${d.BloodOxygen.bo}` : '--'
            status = formatStatus(d.BloodOxygen?.level)
            timeStr = d.BloodOxygen?.testTime || '--'
        }
        else if (currentMetric.value === 'hr') {
            val = d.HeartBeat?.hb ? `${d.HeartBeat.hb}` : '--'
            status = formatStatus(d.HeartBeat?.level)
            timeStr = d.HeartBeat?.testTime || '--'
        }
        else if (currentMetric.value === 'temp') {
            val = d.BodyTemp?.bodyTemp ? `${d.BodyTemp.bodyTemp}` : '--'
            status = formatStatus(d.BodyTemp?.level)
            timeStr = d.BodyTemp?.testTime || '--'
        }
        else if (currentMetric.value === 'hrv') {
            val = d.HDRri?.hrv ? `${d.HDRri.hrv}` : '--'
            status = formatStatus(d.HeartBeat?.level) // HRV 暫時參考心率狀態
            timeStr = d.HDRri?.testTime || '--'
        }

        // 時間格式化 (去掉 T 和 Z)
        if (timeStr !== '--') {
            timeStr = timeStr.replace('T', ' ').substring(0, 16)
        }

        return {
            id: p.accountId,
            index: index + 1,
            name: p.name || '未知',
            gender: p.gender === 'WOMAN' ? '女' : '男',
            hasAvatar: !!p.url, // 👈 新增：判斷有沒有照片網址
            avatarUrl: p.url,   // 👈 新增：儲存照片網址
            mac: p.deviceCode || '--',
            value: val,
            status: status,
            time: timeStr,
            platform: p.deviceCode?.includes(':') ? 'Android' : 'iOS', // 用 MAC 格式假裝判斷平台
            version: 'V1.2.3'
        }
    })

    // 3. 過濾掉完全沒有該項資料的列，讓畫面更乾淨
    return mappedList.filter(item => item.value !== '--')
})

// 分頁邏輯
const totalPages = computed(() => {
    return Math.ceil(filteredTableData.value.length / itemsPerPage) || 1
})

const paginatedTableData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredTableData.value.slice(start, end)
})

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

// 當切換指標或用戶時，重置回第一頁
watch([currentMetric, selectedUserId], () => {
    currentPage.value = 1
})
</script>

<style scoped>
/* ⭐ 表格內的小頭像樣式 */
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

/* 整體外框 */
.data-wrapper {
    display: flex;
    gap: 20px;
    background: #f4f7f9;
    padding: 16px;
    height: calc(100vh - 150px);
    /* 扣除 Header 的高度 */
    color: #333;
    font-family: sans-serif;
}

/* 左側用戶列表 */
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

/* 修改：讓 user-item 變成橫向 Flex 排版，確保頭像與文字對齊 */
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
    /* 頭像與文字的間距 */
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

/* ⭐ 新增：側邊欄的小頭像統一尺寸與樣式 */
.user-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    flex-shrink: 0;
    /* 防止頭像被文字擠壓變形 */
}

/* 真實照片 */
.user-icon.photo {
    object-fit: cover;
    border: 1px solid #cbd5e1;
}

/* 預設圖示 (背景顏色與置中) */
.user-icon.placeholder {
    background: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border: 1px solid #cbd5e1;
}

/* 確保文字太長時會出現刪節號 (...)，而不會破版 */
.user-name-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}

/* 右側資料內容區 */
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
    border-color: #3b82f6;
    color: #2563eb;
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
    color: #111;
    font-weight: bold;
}

.sub-tabs span.active::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 3px;
    background: #333;
}

.table-container {
    width: 100%;
    /* 保持原本的高度限制，讓它可以在畫面內上下滾動 */
    max-height: calc(100vh - 350px);
    overflow: auto;
    /* 允許上下、左右出現滾動條 */
    border-bottom: 1px solid #e2e8f0;
}

/* ⭐ 表格本體 */
.data-table {
    width: 100%;
    /* 👈 關鍵 1：設定表格最小寬度。
       當螢幕小於 900px 時，不再硬擠文字，而是讓外層出現「橫向滾動條」 */
    min-width: 900px;
    border-collapse: collapse;
    font-size: 13px;
    text-align: center;
}

/* ⭐ 表頭設定 */
.data-table th {
    background: #f8fafc;
    padding: 12px;
    color: #666;
    /* 👈 關鍵 2：利用 sticky 鎖定表頭，這樣上下滾動時表頭永遠置頂，而且不會有對齊跑掉的問題 */
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
    /* 強制表頭文字絕對不換行 */
}

/* 確保 Sticky 表頭的背景不會透明漏出底下的字 */
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
    /* 👈 關鍵 3：防止內容被擠壓成直的 */
    white-space: nowrap;
}

.data-table tr.highlighted {
    background-color: #f8fafc;
}

/* 針對特定欄位可以做微調，讓畫面更好看 */
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

.mac-text {
    font-family: monospace;
    color: #555;
    font-size: 12px;
}

.bold {
    font-weight: bold;
    font-size: 15px;
}

/* 狀態顏色設定 */
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

/* 底部導覽列 */
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