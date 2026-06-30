<template>
    <div class="location-container">
        <div class="top-tabs">
            <button :class="['tab-btn', { active: currentTab === 'outdoor' }]"
                @click="currentTab = 'outdoor'">室外定位</button>
            <button :class="['tab-btn', { active: currentTab === 'indoor' }]"
                @click="currentTab = 'indoor'">室內定位</button>
            <button :class="['tab-btn', { active: currentTab === 'alert' }]" @click="currentTab = 'alert'">警報處理</button>
        </div>

        <div class="main-layout" v-if="currentTab !== 'alert'">
            <div class="sidebar">
                <h3 class="sidebar-title">{{ currentTab === 'outdoor' ? '室外定位' : '室內定位' }}</h3>
                <div class="search-box">
                    <div class="section-label">設備訊息</div>
                    <select class="dropdown-select">
                        <option>全部</option>
                    </select>
                    <input type="text" placeholder="依設備碼搜尋" class="input-text" />
                    <input type="text" placeholder="依姓名搜尋" class="input-text" />
                </div>

                <div class="status-tabs">
                    <span :class="{ active: userStatusTab === 'online' }" @click="userStatusTab = 'online'">線上 ({{
                        onlineCount }})</span>
                    <span :class="{ active: userStatusTab === 'offline' }" @click="userStatusTab = 'offline'">離線 ({{
                        offlineCount }})</span>
                    <span :class="{ active: userStatusTab === 'sos' }" @click="userStatusTab = 'sos'">SOS</span>
                    <span :class="{ active: userStatusTab === 'all' }" @click="userStatusTab = 'all'">全部</span>
                </div>

                <div class="device-list">
                    <div v-for="device in filteredPatients" :key="device.id"
                        :class="['device-item', { active: selectedPatient?.id === device.id }]"
                        @click="selectedPatient = device">
                        <div class="device-info">
                            <span
                                :class="['status-dot', device.sos ? 'bg-red' : (device.status === 'ONLINE' ? 'bg-green' : 'bg-gray')]"></span>
                            {{ device.name }}
                        </div>
                        <span class="device-status-text">{{ device.sos ? '求救' : (device.status === 'ONLINE' ? '在線' :
                            '離線') }}</span>
                    </div>
                </div>

                <div class="pagination">
                    <button class="page-btn">&lt;</button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">&gt;</button>
                </div>
            </div>

            <div class="map-area">
                <div class="map-top-bar">
                    <button class="map-view-btn active">{{ currentTab === 'outdoor' ? '室外定位' : '室內平面圖' }}</button>
                    <button class="map-view-btn">活動軌跡</button>
                </div>

                <OutdoorMap v-if="currentTab === 'outdoor'" :patients="filteredPatients" :selected="selectedPatient" />
                <IndoorMap v-if="currentTab === 'indoor'" :patients="indoorPatients" :selected="selectedPatient" />
            </div>
        </div>

        <div class="alert-layout" v-else>
            <AlertPanel />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import rawPatientData from '@/mock/patients.json'

// 引入需要的子元件
import OutdoorMap from './components/OutdoorMap.vue'
import IndoorMap from './components/IndoorMap.vue'
import AlertPanel from './components/AlertPanel.vue'

const currentTab = ref('outdoor') // outdoor | indoor | alert
const userStatusTab = ref('all') // online | offline | sos | all
const selectedPatient = ref(null)

// 定義幾個台灣主要城市的基準座標
const cities = [
    { name: '台北', lat: 25.0330, lng: 121.5434 },
    { name: '台中', lat: 24.1477, lng: 120.6736 },
    { name: '台南', lat: 22.9997, lng: 120.2270 },
    { name: '高雄', lat: 22.6273, lng: 120.3014 },
    { name: '花蓮', lat: 23.9778, lng: 121.6044 },
    { name: '宜蘭', lat: 24.7566, lng: 121.7530 }
]

// 處理 JSON 資料
const allPatients = ref(rawPatientData.data.data.map(p => {
    // 隨機挑選一個城市
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    return {
        id: p.accountId,
        name: p.name || '未知使用者',
        status: p.deviceState, // 'ONLINE' 或 'OFFLINE'
        sos: p.sos,
        // 在選中的城市座標加上一點隨機偏移（讓他們散佈在市區各處）
        lat: randomCity.lat + (Math.random() * 0.04 - 0.02),
        lng: randomCity.lng + (Math.random() * 0.04 - 0.02),
        // 隨機產生室內座標百分比 (10% ~ 90%)
        indoorX: 10 + Math.random() * 80,
        indoorY: 10 + Math.random() * 80
    }
}))

// 計算數量
const onlineCount = computed(() => allPatients.value.filter(p => p.status === 'ONLINE').length)
const offlineCount = computed(() => allPatients.value.filter(p => p.status === 'OFFLINE').length)

// 左側列表過濾
const filteredPatients = computed(() => {
    return allPatients.value.filter(p => {
        if (userStatusTab.value === 'online') return p.status === 'ONLINE'
        if (userStatusTab.value === 'offline') return p.status === 'OFFLINE'
        if (userStatusTab.value === 'sos') return p.sos === true
        return true
    })
})

// 室內地圖固定只取前 10 筆資料展示
const indoorPatients = computed(() => {
    return allPatients.value.slice(0, 10)
})

</script>

<style scoped>
.location-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: calc(100vh - 120px);
    border-radius: 8px;
    padding: 16px;
    font-family: sans-serif;
    color: #333;
    background: #f4f7f9;
    box-sizing: border-box;
}

.top-tabs {
    display: flex;
    gap: 8px;
}

.tab-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: #2f4955;
    color: white;
    cursor: pointer;
    font-size: 14px;
}

.tab-btn.active {
    background: #8cd3ff;
    color: #121921;
    font-weight: bold;
}

.main-layout {
    display: flex;
    gap: 16px;
    background: white;
    border-radius: 8px;
    border: 1px solid #c8d6e5;
    height: calc(100vh - 80px);
    overflow: hidden;
}

/* 警報處理的滿版佈局設定 */
.alert-layout {
    background: white;
    border-radius: 8px;
    height: calc(100vh - 80px);
    overflow: hidden;
}

/* 左側側邊欄 */
.sidebar {
    width: 300px;
    border-right: 1px solid #c8d6e5;
    display: flex;
    flex-direction: column;
    padding: 16px;
    background: #f8fafc;
}

.sidebar-title {
    margin: 0 0 12px 0;
    font-size: 16px;
    color: #2f4955;
    font-weight: bold;
}

.search-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
}

.section-label {
    font-size: 13px;
    font-weight: bold;
    color: #555;
}

.dropdown-select,
.input-text {
    padding: 6px 10px;
    border: 1px solid #ccd1d9;
    border-radius: 4px;
    font-size: 13px;
    width: 100%;
    box-sizing: border-box;
}

.status-tabs {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #e6e9ed;
    padding-bottom: 6px;
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
}

.status-tabs span {
    cursor: pointer;
    padding: 2px 4px;
    transition: 0.2s;
}

.status-tabs span.active {
    color: #3b82f6;
    border-bottom: 2px solid #3b82f6;
    font-weight: bold;
    margin-bottom: -8px;
}

/* 設備列表 */
.device-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-right: 4px;
}

.device-item {
    padding: 10px 12px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #e6e9ed;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
}

.device-item:hover {
    border-color: #a0c4ff;
}

.device-item.active {
    background: #e0f2fe;
    border-color: #3b82f6;
    font-weight: bold;
}

.device-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}

.bg-green {
    background-color: #10b981;
}

.bg-gray {
    background-color: #9ca3af;
}

.bg-red {
    background-color: #ef4444;
    box-shadow: 0 0 6px #ef4444;
}

.device-status-text {
    font-size: 12px;
    color: #888;
    font-weight: normal;
}

.pagination {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-top: 12px;
}

.page-btn {
    padding: 4px 8px;
    border: 1px solid #ccd1d9;
    background: white;
    font-size: 12px;
    cursor: pointer;
    border-radius: 3px;
}

.page-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

/* 右側地圖區 */
.map-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #e5e9f0;
}

.map-top-bar {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1000;
    display: flex;
    gap: 4px;
    background: rgba(255, 255, 255, 0.95);
    padding: 4px;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.map-view-btn {
    padding: 6px 14px;
    border: none;
    font-size: 12px;
    cursor: pointer;
    background: transparent;
    border-radius: 3px;
    font-weight: bold;
    color: #555;
}

.map-view-btn.active {
    background: #2f4955;
    color: white;
}
</style>