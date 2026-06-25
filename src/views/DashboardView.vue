<template>
    <div class="dashboard-wrapper">
        <div class="alert-banner" v-if="sosPatients.length > 0">
            <div class="alert-text">🔔 緊急：{{ sosPatients[0].companyName || '未知地點' }} 的 {{ sosPatients[0].name }}
                觸發SOS警報！</div>
            <div class="alert-actions">
                <button class="btn-yellow">立即定位</button>
                <button class="btn-red-outline">關閉警報</button>
            </div>
        </div>

        <div class="grid-layout top-section">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="title line-black">我的會員</div>
                    <div class="value">{{ totalMembers }}<span class="unit">人</span></div>
                </div>
                <div class="stat-card">
                    <div class="title line-red">今日新增</div>
                    <div class="value text-red">3<span class="unit">人</span></div>
                </div>
                <div class="stat-card">
                    <div class="title line-blue">待處理事件</div>
                    <div class="value text-blue">{{ pendingEvents }}<span class="unit">件</span></div>
                </div>
                <div class="stat-card">
                    <div class="title line-purple">今日測量</div>
                    <div class="value text-purple">{{ totalMembers }}<span class="unit">人</span></div>
                </div>
                <div class="stat-card">
                    <div class="title line-darkred">今日健康異常</div>
                    <div class="value text-darkred">{{ abnormalHealthCount }}<span class="unit">人</span></div>
                </div>
                <div class="stat-card">
                    <div class="title line-yellow">今日安全異常</div>
                    <div class="value text-yellow">{{ sosCount }}<span class="unit">人</span></div>
                </div>
            </div>

            <div class="panel actions-panel">
                <h3 class="panel-title">管理設定</h3>
                <div class="action-btn-grid">
                    <button class="action-btn border-black">新增會員</button>
                    <button class="action-btn border-red">檔案管理</button>
                    <button class="action-btn border-blue">綁定設備</button>
                    <button class="action-btn border-purple">床位分配</button>
                    <button class="action-btn border-green has-badge">健康諮詢<span class="badge">2</span></button>
                    <button class="action-btn border-yellow">交班日誌</button>
                </div>
            </div>
        </div>

        <div class="panel charts-section">
            <h3 class="panel-title">管理設定</h3>
            <div class="charts-grid">
                <div class="chart-box">
                    <div class="box-title">在線總覽</div>
                    <div class="online-stats">
                        <div class="main-online"><span class="text-green huge">{{ onlineCount }}</span> / {{
                            totalMembers }}</div>
                        <div class="sub-text">在線 / 總人數</div>
                        <div class="divider"></div>
                        <div class="sub-stats">
                            <div>低電量 <span class="text-yellow bold">{{ lowBatteryCount }}</span>人</div>
                            <div class="vertical-line"></div>
                            <div>離線 <span class="text-gray bold">{{ offlineCount }}</span>人</div>
                        </div>
                    </div>
                    <a href="#" class="more-link">查看詳情 ></a>
                </div>

                <div class="chart-box">
                    <div class="box-title">風險等級統計</div>
                    <div class="pie-layout">
                        <div ref="pieChartRef" class="pie-chart"></div>
                        <div class="pie-legend">
                            <div><span class="dot bg-red"></span>緊急 <span class="ml-auto">{{ urgentCount }}人</span>
                            </div>
                            <div><span class="dot bg-yellow"></span>預警 <span class="ml-auto">{{ warningCount }}人</span>
                            </div>
                            <div><span class="dot bg-green"></span>正常 <span class="ml-auto">{{ normalCount }}人</span>
                            </div>
                        </div>
                    </div>
                    <a href="#" class="more-link">查看詳情 ></a>
                </div>

                <div class="chart-box center-content">
                    <div class="box-title">環境中暑預警</div>
                    <div class="temp-display">
                        <span class="icon-temp">🌡️</span>
                        <div class="temp-info">
                            <div class="temp-status" :class="sunstrokeCount > 0 ? 'text-red' : 'text-green'">
                                室溫 {{ sunstrokeCount > 0 ? '偏高' : '正常' }}
                            </div>
                            <div class="temp-value" :class="sunstrokeCount > 0 ? 'text-red' : 'text-green'">
                                {{ sunstrokeCount > 0 ? '31.2' : '26.5' }} <span class="unit">°C</span>
                            </div>
                        </div>
                    </div>
                    <div class="high-risk">高風險使用者 <span class="text-red bold">{{ sunstrokeCount }}</span>人</div>
                    <a href="#" class="more-link">查看詳情 ></a>
                </div>

                <div class="chart-box">
                    <div class="box-title">今日事件總數</div>
                    <div class="event-list">
                        <div><span class="dot bg-red"></span>緊急事件 <span class="ml-auto text-red">{{ urgentCount +
                                sosCount }} 件</span></div>
                        <div><span class="dot bg-yellow"></span>預警事件 <span class="ml-auto text-yellow">{{ warningCount
                                }} 件</span></div>
                        <div><span class="dot bg-blue"></span>一般提醒 <span class="ml-auto text-blue">5 件</span></div>
                    </div>
                    <a href="#" class="more-link">查看詳情 ></a>
                </div>
            </div>
        </div>

        <div class="panel events-section">
            <h3 class="panel-title">實時動態</h3>
            <div class="event-columns">
                <div class="col">
                    <div class="evt-item" v-for="n in 5" :key="'col1-' + n">
                        <span class="time">剛剛</span> <span class="bold">{{ dynamicPatients[n - 1]?.name || 'User'
                            }}</span> 上傳了健康訊息
                    </div>
                </div>
                <div class="col">
                    <div class="evt-item" v-for="n in 5" :key="'col2-' + n">
                        <span class="time">1小時前</span> <span class="bold">{{ dynamicPatients[n + 4]?.name || 'User'
                            }}</span> 設備已連線
                    </div>
                </div>
                <div class="col">
                    <div class="evt-item" v-for="n in 5" :key="'col3-' + n">
                        <span class="time">3小時前</span> <span class="bold">{{ dynamicPatients[n + 9]?.name || 'User'
                            }}</span> 完成了血壓量測
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'

// ⭐ 引入我們先前存好的 JSON 檔案
import rawPatientData from '@/mock/patients.json'

// --- 資料統計邏輯 ---
const dynamicPatients = ref(rawPatientData.data.data)

// 總人數
const totalMembers = computed(() => dynamicPatients.value.length)

// 在線與離線狀態
const onlineCount = computed(() => dynamicPatients.value.filter(p => p.deviceState === 'ONLINE').length)
const offlineCount = computed(() => dynamicPatients.value.filter(p => p.deviceState === 'OFFLINE').length)

// 低電量 (假設小於 30% 算低電量)
const lowBatteryCount = computed(() => dynamicPatients.value.filter(p => p.electricity < 30).length)

// 風險等級統計 (依據 JSON 內的 level 欄位)
const normalCount = computed(() => dynamicPatients.value.filter(p => p.level === 'NORMAL').length)
const warningCount = computed(() => dynamicPatients.value.filter(p => p.level === 'WARN').length)
const urgentCount = computed(() => dynamicPatients.value.filter(p => p.level === 'URGENT').length)

// 安全異常與緊急事件
const sosPatients = computed(() => dynamicPatients.value.filter(p => p.sos === true))
const sosCount = computed(() => sosPatients.value.length)
const sunstrokeCount = computed(() => dynamicPatients.value.filter(p => p.sunstroke === true).length)

// 綜合指標
const pendingEvents = computed(() => sosCount.value + urgentCount.value)
const abnormalHealthCount = computed(() => warningCount.value + urgentCount.value)


// --- 圓餅圖初始化 ---
const pieChartRef = ref(null)

const initPieChart = () => {
    if (!pieChartRef.value) return
    const chart = echarts.init(pieChartRef.value)

    // 將計算出來的數據帶入圓餅圖的 data
    const option = {
        tooltip: { trigger: 'item' },
        color: ['#10b981', '#f59e0b', '#ef4444'], // 綠(正常)、橘(預警)、紅(緊急)
        series: [
            {
                name: '風險等級',
                type: 'pie',
                radius: ['50%', '80%'],
                avoidLabelOverlap: false,
                label: { show: false, position: 'center' },
                data: [
                    { value: normalCount.value, name: '正常' },
                    { value: warningCount.value, name: '預警' },
                    { value: urgentCount.value, name: '緊急' }
                ]
            }
        ]
    }
    chart.setOption(option)
}

onMounted(() => {
    nextTick(() => {
        initPieChart()
    })
})
</script>


<style scoped>
/* 覆蓋掉外層暗色背景，改為淺色系 */
.dashboard-wrapper {
    background-color: #f4f7f9;
    min-height: 100%;
    padding: 20px;
    color: #333;
    font-family: sans-serif;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* 警報區塊 */
.alert-banner {
    background-color: #dc2626;
    color: white;
    border-radius: 8px;
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
}

.alert-actions button {
    padding: 6px 16px;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 10px;
    border: none;
}

.btn-yellow {
    background-color: #fbbf24;
    color: #b45309;
}

.btn-red-outline {
    background-color: transparent;
    border: 1px solid white !important;
    color: white;
}

/* 共用面板樣式 */
.panel {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.panel-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #111;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
}

/* 第一層 Layout */
.top-section {
    display: flex;
    gap: 16px;
}

.stats-grid {
    flex: 2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.actions-panel {
    flex: 1.2;
}

/* 統計小卡 */
.stat-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    border: 1px solid #eee;
}

.stat-card .title {
    font-size: 14px;
    color: #555;
    margin-bottom: 12px;
    display: inline-block;
    padding-bottom: 4px;
}

.stat-card .value {
    font-size: 28px;
    font-weight: bold;
    color: #9ca3af;
}

/* 預設灰 */
.stat-card .unit {
    font-size: 14px;
    margin-left: 4px;
    font-weight: normal;
}

/* 底線顏色 */
.line-black {
    border-bottom: 2px solid #333;
}

.line-red {
    border-bottom: 2px solid #ef4444;
}

.line-blue {
    border-bottom: 2px solid #3b82f6;
}

.line-purple {
    border-bottom: 2px solid #a855f7;
}

.line-darkred {
    border-bottom: 2px solid #991b1b;
}

.line-yellow {
    border-bottom: 2px solid #eab308;
}

/* 文字顏色 */
.text-red {
    color: #ef4444 !important;
}

.text-blue {
    color: #3b82f6 !important;
}

.text-purple {
    color: #a855f7 !important;
}

.text-darkred {
    color: #991b1b !important;
}

.text-yellow {
    color: #eab308 !important;
}

.text-green {
    color: #10b981 !important;
}

.text-gray {
    color: #6b7280 !important;
}

.bold {
    font-weight: bold;
}

.huge {
    font-size: 32px;
}

/* 按鈕區 */
.action-btn-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.action-btn {
    background: white;
    border-radius: 6px;
    padding: 12px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
}

.action-btn:hover {
    background: #f9fafb;
}

.border-black {
    border: 1px solid #ccc;
    color: #333;
}

.border-red {
    border: 1px solid #fca5a5;
    color: #ef4444;
}

.border-blue {
    border: 1px solid #93c5fd;
    color: #3b82f6;
}

.border-purple {
    border: 1px solid #d8b4fe;
    color: #a855f7;
}

.border-green {
    border: 1px solid #86efac;
    color: #10b981;
}

.border-yellow {
    border: 1px solid #fde047;
    color: #eab308;
}

.has-badge {
    position: relative;
}

.badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 第二層 圖表區 */
.charts-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.chart-box {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    position: relative;
}

.box-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 16px;
}

.more-link {
    position: absolute;
    bottom: 12px;
    right: 16px;
    font-size: 12px;
    color: #3b82f6;
    text-decoration: none;
}

.online-stats {
    text-align: center;
    margin-top: 10px;
}

.divider {
    height: 1px;
    background: #eee;
    margin: 12px 0;
}

.sub-stats {
    display: flex;
    justify-content: center;
    gap: 16px;
    font-size: 14px;
}

.vertical-line {
    width: 1px;
    background: #ddd;
}

.pie-layout {
    display: flex;
    align-items: center;
    height: 120px;
}

.pie-chart {
    width: 100px;
    height: 100px;
}

.pie-legend {
    flex: 1;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.pie-legend>div {
    display: flex;
    align-items: center;
}

.dot {
    width: 10px;
    height: 10px;
    display: inline-block;
    margin-right: 8px;
}

.bg-red {
    background: #ef4444;
}

.bg-yellow {
    background: #eab308;
}

.bg-green {
    background: #10b981;
}

.bg-blue {
    background: #3b82f6;
}

.ml-auto {
    margin-left: auto;
}

.center-content {
    text-align: center;
}

.temp-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 10px 0;
}

.icon-temp {
    font-size: 40px;
}

.temp-info {
    text-align: left;
}

.temp-status {
    font-size: 12px;
    font-weight: bold;
}

.temp-value {
    font-size: 24px;
    font-weight: bold;
}

.high-risk {
    font-size: 13px;
    margin-top: 8px;
}

.event-list {
    font-size: 13px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 10px;
}

.event-list>div {
    display: flex;
    align-items: center;
}

/* 第三層 實時動態 */
.event-columns {
    display: flex;
    gap: 24px;
}

.col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.evt-item {
    font-size: 13px;
    color: #444;
}

.evt-item .time {
    color: #aaa;
    margin-right: 8px;
    display: inline-block;
    width: 60px;
}
</style>