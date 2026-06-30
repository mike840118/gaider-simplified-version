<template>
    <div class="dashboard-wrapper">
        <div class="alert-dropdown-container" v-if="sosPatients.length > 0">
            <div class="alert-backdrop" v-if="isAlertExpanded" @click="isAlertExpanded = false"></div>

            <div class="alert-stack" :style="{ zIndex: isAlertExpanded ? 900 : 1 }"
                @click="isAlertExpanded = !isAlertExpanded">
                <div class="alert-banner"
                    v-for="(patient, index) in (isAlertExpanded ? sosPatients : sosPatients.slice(0, 1))"
                    :key="patient.id" :class="{ 'mt-2': index > 0 }">

                    <div class="alert-text" style="cursor: pointer;">
                        <span class="bell-icon">
                            <span v-if="index === 0">🔔<span class="badge top-badge">{{ sosCount }}</span></span>
                            <span v-else style="visibility: hidden;">🔔</span>
                        </span>
                        緊急：{{ patient.companyName || '未知' }} 床 {{ patient.name }} 觸發跌倒警報！
                    </div>

                    <div class="alert-actions">
                        <button class="btn-yellow" @click="openSosModal(patient)">立即處理</button>
                        <button class="btn-red-outline">關閉警報</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel announcement-panel">
            <div class="panel-header">
                <div class="title-with-icon">
                    <span class="announce-icon">📢<span class="badge top-badge">2</span></span>
                    <h3 class="panel-title mb-0">公告</h3>
                </div>
                <select class="date-select">
                    <option>今天</option>
                </select>
            </div>
            <ul class="announce-list">
                <li v-for="item in announcements" :key="item.id" @click="openAnnouncement(item)"
                    style="cursor: pointer;">
                    <span :class="item.type === 'yellow' ? 'dot-yellow' : 'dot-gray'"></span>
                    <span class="a-tag">{{ item.tag }}</span>
                    <span class="a-title">{{ item.title.replace(item.tag, '') }} <span class="a-desc">{{
                        item.previewDesc }}</span></span>
                    <span class="a-time">{{ item.time }}</span>
                </li>
            </ul>
        </div>

        <div class="middle-section">
            <div class="stats-grid">
                <div class="stat-card" v-for="stat in stats" :key="stat.title">
                    <div class="stat-icon" :class="stat.colorClass">{{ stat.icon }}</div>
                    <div class="stat-info">
                        <div class="title">{{ stat.title }}</div>
                        <div class="value">{{ stat.value }}<span class="unit">人</span></div>
                    </div>
                </div>
            </div>
            <div class="panel actions-panel">
                <h3 class="panel-title border-bottom-0">管理設定</h3>
                <div class="action-btn-grid">
                    <button class="action-btn border-black text-black" @click="isAddMemberOpen = true">新增會員</button>
                    <button class="action-btn border-red text-red" @click="isFileManageOpen = true">檔案管理</button>

                    <button class="action-btn border-blue text-blue">綁定設備</button>
                    <button class="action-btn border-purple text-purple">入院・入所<br>管理</button>
                    <button class="action-btn border-green text-green">系統記錄</button>
                    <button class="action-btn border-yellow text-yellow">交班日誌</button>
                </div>
            </div>
        </div>

        <div class="bottom-section">
            <div class="panel overview-panel">
                <h3 class="panel-title border-bottom-0">數據總覽</h3>
                <div class="overview-list">
                    <div class="list-header">夜間安全偵測 22 : 00 - 06 : 00</div>
                    <div class="list-item" v-for="log in safetyLogs" :key="log.id">
                        <span class="time c-gray">{{ log.time }}</span>
                        <span class="desc"><strong>{{ log.desc }}</strong></span>
                        <span class="status-btn" :class="log.patient.sos ? 'bg-yellow' : 'bg-light-gray'"
                            @click="openSosModal(log.patient)">
                            {{ log.status }}
                        </span>
                    </div>
                </div>
                <a href="#" class="more-link mt-auto">查看更多 ></a>
            </div>

            <div class="panel heat-panel">
                <h3 class="panel-title border-bottom-0">環境中暑預警</h3>
                <div class="temp-display">
                    <span class="icon-temp text-red">🌡️</span>
                    <div class="temp-info">
                        <div class="temp-status text-red">室溫 偏高</div>
                        <div class="temp-value text-red">31.2 <span class="unit">°C</span></div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="high-risk">高風險使用者</div>
                <div class="risk-count text-red">{{ sunstrokeCount }}<span class="unit-black">人</span></div>
                <a href="#" class="more-link mt-auto">查看詳情 ></a>
            </div>

            <div class="panel event-panel">
                <h3 class="panel-title border-bottom-0">今日事件總數</h3>
                <div class="event-list mt-3">
                    <div class="e-row">
                        <span><span class="dot bg-red"></span>緊急事件</span>
                        <span class="text-red bold">{{ urgentCount + sosCount }} <span
                                class="unit-black">件</span></span>
                    </div>
                    <div class="e-row">
                        <span><span class="dot bg-yellow"></span>預警事件</span>
                        <span class="text-yellow bold">{{ warningCount }} <span class="unit-black">件</span></span>
                    </div>
                    <div class="e-row">
                        <span><span class="dot bg-blue"></span>一般提醒</span>
                        <span class="text-blue bold">5 <span class="unit-black">件</span></span>
                    </div>
                </div>
                <a href="#" class="more-link mt-auto">查看詳情 ></a>
            </div>
        </div>

        <AnnouncementModal :is-open="isModalOpen" :announcement="selectedAnnouncement" @close="isModalOpen = false" />
        <SosDetailModal :is-open="isSosModalOpen" :patient="selectedSosPatient" @close="isSosModalOpen = false" />
        <AddMemberModal :is-open="isAddMemberOpen" @close="isAddMemberOpen = false" />
        <UpdateManagementModal :is-open="isFileManageOpen" @close="isFileManageOpen = false" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import rawPatientData from '@/mock/patients.json'
import AnnouncementModal from './components/AnnouncementModal.vue'
import SosDetailModal from './components/SosDetailModal.vue'
// 匯入我們剛剛新增的兩個元件 (請依照您的實際資料夾結構調整路徑)
import AddMemberModal from './components/AddMemberModal.vue'
import UpdateManagementModal from './components/UpdateManagementModal.vue'
const patients = ref(rawPatientData.data.data)

// --- 計算屬性 ---
const totalMembers = computed(() => patients.value.length)
const sosPatients = computed(() => patients.value.filter(p => p.sos === true))
const sosCount = computed(() => sosPatients.value.length)
const urgentCount = computed(() => patients.value.filter(p => p.level === 'URGENT').length)
const warningCount = computed(() => patients.value.filter(p => p.level === 'WARN').length)
const onlineCount = computed(() => patients.value.filter(p => p.deviceState === 'ONLINE').length)
const offlineCount = computed(() => patients.value.filter(p => p.deviceState === 'OFFLINE').length)
const lowBatteryCount = computed(() => patients.value.filter(p => p.electricity < 30).length)
const sunstrokeCount = computed(() => patients.value.filter(p => p.sunstroke === true).length)
const pendingEvents = computed(() => sosCount.value + urgentCount.value)

// 統計卡片資料
const stats = computed(() => [
    { title: '總會員人數', value: totalMembers.value, icon: '👤', colorClass: 'c-gray' },
    { title: '今日新增', value: 5, icon: '➕', colorClass: 'c-blue' },
    { title: '待處理事件', value: pendingEvents.value, icon: '📋', colorClass: 'c-blue' },
    { title: '在線人數', value: onlineCount.value, icon: '📶', colorClass: 'c-blue' },
    { title: '離線人數', value: offlineCount.value, icon: '📴', colorClass: 'c-gray' },
    { title: '設備低電量', value: lowBatteryCount.value, icon: '🔋', colorClass: 'c-gray' }
])

// 安全偵測列表
const safetyLogs = computed(() => patients.value.filter(p => p.level !== 'NORMAL').slice(0, 4).map(p => ({
    id: p.accountId, patient: p, time: '剛剛', desc: `${p.companyName} ${p.name} 異常`, status: p.sos ? '立即處理' : '處理中'
})))

// --- 彈窗狀態 ---
const isModalOpen = ref(false)
const selectedAnnouncement = ref({})
const isAlertExpanded = ref(false)
const isSosModalOpen = ref(false)
const selectedSosPatient = ref({})

// 加入控制這兩個新 Modal 的響應式變數
const isAddMemberOpen = ref(false)
const isFileManageOpen = ref(false)


const openSosModal = (p) => { selectedSosPatient.value = p; isSosModalOpen.value = true; isAlertExpanded.value = false; }
const openAnnouncement = (item) => { selectedAnnouncement.value = item; isModalOpen.value = true; }


const announcements = ref([
    {
        id: 1,
        tag: '【重要宣導】',
        title: '【重要宣導】因應呼吸道傳染病高峰期，請全體同仁落實患者健康監測與 App 即時通報',
        previewDesc: '- 各位照護與臨床同仁好：因應近期季節性流感及呼...',
        time: '下午 1:50',
        type: 'yellow',
        content: '各位照護與臨床同仁好：\n\n因應近期季節性流感及呼吸道傳染病進入高峰期，為確保院內/機構內感染控制，請各單位務必落實以下防疫措施：\n\n1. 每日測量並記錄患者體溫及呼吸道症狀。\n2. 若發現異常，請立即透過 App 即時通報系統上傳。\n3. 接觸高風險個案請確實穿戴防護裝備。\n\n感謝各位同仁的配合與辛勞。\n[發布日期] 2026-06-29'
    },
    {
        id: 2,
        tag: '【健康宣導】',
        title: '【健康宣導】盛夏高溫來襲，請加強留意[長者/患者]水分攝取',
        previewDesc: '- 各位同仁辛苦了：近日氣溫持續攀升，因[長者/重症患者]常因口渴感覺遲鈍或表達不...',
        time: '上午 10:00',
        type: 'yellow',
        content: '各位同仁辛苦了：\n\n近日氣溫持續攀升，因[長者/重症患者]常因口渴感覺遲鈍或表達不清，容易引發脫水或中暑危險，請依下列原則加強照護：\n\n1. 定時提供溫開水，並記錄每日飲水量。\n2. 留意室內溫度與通風，必要時調整空調設定。\n3. 若觀察到尿量減少、皮膚乾燥等脫水前兆，請提早介入處理。\n\n預防勝於治療，請大家多加留心。\n[發布日期] 2026-06-29'
    },
    {
        id: 3,
        tag: '【照護宣導】',
        title: '【照護宣導】請同仁務必落實「防跌五大巡查」，並善用平台即時回報環境隱患',
        previewDesc: '- 各位同仁好：近期各樓層[住民/患者]跌倒風險評估指數有所...',
        time: '上午 08:42',
        type: 'gray',
        content: '各位同仁好：\n\n近期各樓層[住民/患者]跌倒風險評估指數有所變動，為維護個案安全，請全體一線照護同仁於每班交班後，落實以下防跌巡查：\n\n1.床邊安全檢查：請確認[住民/患者]離床或臥床時，床欄已確實拉起、病床輪子鎖固定，且離床警報器功能正常。\n\n2.環境環境巡檢：若發現走道有積水、照明昏暗、或無障礙扶手鬆動等狀況，請立即拍攝現場照片，並透過平台的「後勤修繕/環境回報」專區上傳通報，以便總務組第一時間進行修繕。\n\n3.平台評估同步更新：針對高風險個案，請於每週固定評估日，在平台內的「跌倒風險評估表」更新最新數據，以利接班同仁掌握最新防範重點。\n\n防跌工作人人有責，多一分留意，少一分遺憾。\n[發布日期] 2026-06-29'
    }
])
</script>
<style scoped>
* {
    box-sizing: border-box;
}

.dashboard-wrapper {
    background-color: #f4f7f9;
    min-height: 100vh;
    border-radius: 8px;
    padding: 20px;
    color: #333;
    font-family: 'Arial', sans-serif;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* ================= 1. 緊急警報 ================= */
.alert-banner {
    background-color: #d81e06;
    color: white;
    border-radius: 30px;
    padding: 10px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 10px rgba(216, 30, 6, 0.3);
}

.alert-text {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 0.5px;
}

.bell-icon {
    position: relative;
    font-size: 20px;
    margin-right: 12px;
}

.top-badge {
    position: absolute;
    top: -5px;
    right: -8px;
    background: #ff9800;
    color: white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid white;
}

.alert-actions button {
    padding: 6px 18px;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 10px;
    font-size: 14px;
}

.btn-yellow {
    background-color: #fadb14;
    color: #d81e06;
    border: none;
}

.btn-red-outline {
    background-color: transparent;
    border: 1px solid white;
    color: white;
}

/* ================= 共用 Panel ================= */
.panel {
    background: white;
    border-radius: 8px;
    padding: 16px 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    border: 1px solid #eaeaea;
    display: flex;
    flex-direction: column;
}

.panel-title {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.border-bottom-0 {
    border-bottom: none !important;
}

.mt-auto {
    margin-top: auto;
}

.more-link {
    text-align: right;
    font-size: 12px;
    color: #3b82f6;
    text-decoration: none;
    margin-top: 12px;
}

/* ================= 2. 公告區塊 ================= */
.announcement-panel {
    padding: 12px 20px;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.title-with-icon {
    display: flex;
    align-items: center;
    gap: 8px;
}

.announce-icon {
    position: relative;
    font-size: 22px;
    color: #fadb14;
}

.mb-0 {
    margin-bottom: 0;
}

.date-select {
    padding: 2px 10px;
    border: 1px solid #ddd;
    border-radius: 12px;
    font-size: 12px;
    color: #666;
    outline: none;
}

.announce-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.announce-list li {
    display: flex;
    align-items: center;
    padding: 8px 0;
    font-size: 13px;
    border-bottom: 1px dashed #f0f0f0;
}

.announce-list li:last-child {
    border-bottom: none;
}

.dot-yellow {
    width: 6px;
    height: 6px;
    background-color: #fadb14;
    border-radius: 50%;
    margin-right: 8px;
    flex-shrink: 0;
}

.dot-gray {
    width: 6px;
    height: 6px;
    background-color: #ccc;
    border-radius: 50%;
    margin-right: 8px;
    flex-shrink: 0;
}

.a-tag {
    font-weight: bold;
    color: #333;
    margin-right: 4px;
    flex-shrink: 0;
}

.a-title {
    color: #333;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.a-desc {
    color: #999;
}

.a-time {
    color: #999;
    font-size: 12px;
    margin-left: 16px;
    flex-shrink: 0;
}

/* ================= 3. 中間區塊 ================= */
.middle-section {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 16px;
}

/* 統計卡片 */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 12px;
}

.stat-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    border: 1px solid #eaeaea;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}

.stat-icon {
    font-size: 32px;
    width: 40px;
    text-align: center;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-info .title {
    font-size: 13px;
    color: #333;
    font-weight: bold;
    margin-bottom: 4px;
}

.stat-info .value {
    font-size: 24px;
    font-weight: bold;
    color: #555;
    display: flex;
    align-items: baseline;
}

.unit {
    font-size: 12px;
    font-weight: normal;
    margin-left: 2px;
}

.link-small {
    font-size: 12px;
    color: #3b82f6;
    text-decoration: none;
    margin-left: 8px;
    font-weight: normal;
}

/* 管理設定按鈕 */
.actions-panel {
    justify-content: flex-start;
}

.action-btn-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 12px;
    height: 100%;
}

.action-btn {
    background: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 50px;
}

.action-btn:hover {
    background: #f9fafb;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.border-black {
    border: 1.5px solid #333;
}

.border-red {
    border: 1.5px solid #ef4444;
}

.border-blue {
    border: 1.5px solid #3b82f6;
}

.border-purple {
    border: 1.5px solid #a855f7;
}

.border-green {
    border: 1.5px solid #10b981;
}

.border-yellow {
    border: 1.5px solid #eab308;
}

.text-black {
    color: #333;
}

.text-red {
    color: #ef4444;
}

.text-blue {
    color: #3b82f6;
}

.text-purple {
    color: #a855f7;
}

.text-green {
    color: #10b981;
}

.text-yellow {
    color: #eab308;
}

/* ================= 4. 底部區塊 ================= */
.bottom-section {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 16px;
    flex: 1;
}

/* 數據總覽列表 */
.overview-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 13px;
}

.list-header {
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
}

.list-item {
    display: flex;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid #f5f5f5;
}

.list-item .time {
    width: 80px;
    flex-shrink: 0;
}

.list-item .desc {
    flex: 1;
    color: #333;
}

.status-btn {
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: bold;
}

.bg-yellow {
    background: #fadb14;
    color: #333;
}

.bg-light-gray {
    background: #f0f0f0;
    color: #333;
}

.outline-gray {
    border: 1px solid #ccc;
    color: #999;
}

/* 中暑預警 */
.heat-panel {
    text-align: center;
    align-items: center;
}

.temp-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 10px;
}

.icon-temp {
    font-size: 48px;
}

.temp-info {
    text-align: left;
}

.temp-status {
    font-size: 13px;
    font-weight: bold;
}

.temp-value {
    font-size: 28px;
    font-weight: bold;
    display: flex;
    align-items: baseline;
}

.divider {
    width: 80%;
    height: 1px;
    background: #eaeaea;
    margin: 16px 0;
}

.high-risk {
    font-size: 13px;
    color: #333;
    margin-bottom: 4px;
}

.risk-count {
    font-size: 24px;
    font-weight: bold;
}

.unit-black {
    font-size: 12px;
    color: #333;
    font-weight: normal;
    margin-left: 2px;
}

/* 事件總數 */
.event-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    padding: 0 10px;
}

.e-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #333;
}

.dot {
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 2px;
    margin-right: 8px;
}

.bg-red {
    background: #ef4444;
}

.bg-yellow {
    background: #fadb14;
}

.bg-blue {
    background: #3b82f6;
}

/* 通用文字顏色 */
.c-gray {
    color: #999;
}

.c-blue {
    color: #8bc34a;
    /* 配合圖示顏色，圖示通常偏青綠/藍 */
}

.bold {
    font-weight: bold;
}

/* 新增的警報下拉容器樣式 */
.alert-dropdown-container {
    position: relative;
    width: 100%;
    min-height: 44px;
    /* 預留第一行的高度，避免下方內容跳動 */
    margin-bottom: 16px;
    /* 原本 dashboard-wrapper 的 gap 放進來 */
}

.alert-stack {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
}

/* 展開時的點擊遮罩，用於點擊空白處關閉 */
.alert-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 899;
}

.mt-2 {
    margin-top: 8px;
}

/* 請確保您原本的 .alert-banner 樣式有保留，以下為覆蓋調整 */
.alert-banner {
    background-color: #d81e06;
    color: white;
    border-radius: 30px;
    padding: 10px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 10px rgba(216, 30, 6, 0.3);
    z-index: 900;
}
</style>