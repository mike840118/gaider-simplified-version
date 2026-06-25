<script setup>
import { ref } from 'vue'

const currentTab = ref('outdoor') // outdoor | indoor | alert
const userStatusTab = ref('online') // online | offline | sos | all

const mockDevices = ref([
    { id: 'a4211', name: 'a4211', active: true },
    { id: 'isac', name: 'Isac', active: false },
    { id: 'jenny', name: 'Jenny', active: false },
    { id: 'kendrick', name: 'Kendrick', active: false }
])
</script>

<template>
    <div class="location-container">
        <div class="top-tabs">
            <button :class="['tab-btn', { active: currentTab === 'outdoor' }]"
                @click="currentTab = 'outdoor'">室外定位</button>
            <button :class="['tab-btn', { active: currentTab === 'indoor' }]"
                @click="currentTab = 'indoor'">室內定位</button>
            <button :class="['tab-btn', { active: currentTab === 'alert' }]" @click="currentTab = 'alert'">警報處理</button>
        </div>

        <div class="main-layout">
            <div class="sidebar">
                <h3 class="sidebar-title">室外定位</h3>
                <div class="search-box">
                    <div class="section-label">設備訊息</div>
                    <select class="dropdown-select">
                        <option>全部</option>
                    </select>
                    <input type="text" placeholder="依設備碼搜尋" class="input-text" />
                    <input type="text" placeholder="依姓名搜尋" class="input-text" />
                </div>

                <div class="status-tabs">
                    <span :class="{ active: userStatusTab === 'online' }" @click="userStatusTab = 'online'">線上</span>
                    <span :class="{ active: userStatusTab === 'offline' }" @click="userStatusTab = 'offline'">離線</span>
                    <span :class="{ active: userStatusTab === 'sos' }" @click="userStatusTab = 'sos'">SOS</span>
                    <span :class="{ active: userStatusTab === 'all' }" @click="userStatusTab = 'all'">全部</span>
                </div>

                <div class="device-list">
                    <div v-for="device in mockDevices" :key="device.id"
                        :class="['device-item', { active: device.active }]">
                        {{ device.name }}
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
                    <button class="map-view-btn active">室外定位</button>
                    <button class="map-view-btn">活動軌跡</button>
                </div>
                <div id="map" class="map-canvas">
                    <div class="map-placeholder">
                        <span class="map-icon">🗺️</span>
                        <p>Google Map 區塊 (請在此容器串接地圖 API)</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.location-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
    font-family: sans-serif;
    color: #333;
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
    height: calc(100vh - 140px);
    overflow: hidden;
}

/* 左側側邊欄 */
.sidebar {
    width: 280px;
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
}

.status-tabs span.active {
    color: #3b82f6;
    border-bottom: 2px solid #3b82f6;
    font-weight: bold;
    margin-bottom: -8px;
}

.device-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.device-item {
    padding: 10px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #e6e9ed;
    font-size: 13px;
    cursor: pointer;
    text-align: center;
}

.device-item.active {
    background: #e0f2fe;
    border-color: #7dd3fc;
    font-weight: bold;
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
}

.map-top-bar {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    display: flex;
    gap: 4px;
    background: rgba(255, 255, 255, 0.9);
    padding: 4px;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.map-view-btn {
    padding: 4px 12px;
    border: none;
    font-size: 12px;
    cursor: pointer;
    background: transparent;
    border-radius: 3px;
}

.map-view-btn.active {
    background: #2f4955;
    color: white;
}

.map-canvas {
    flex: 1;
    background: #e5e9f0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.map-placeholder {
    text-align: center;
    color: #777;
}

.map-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 8px;
}
</style>