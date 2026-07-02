<template>
  <div class="indoor-map-container">
    <div class="indoor-map-wrapper">
      <img src="@/assets/images/location.png" alt="Indoor Map" class="indoor-image" />

      <div v-for="patient in patients" :key="patient.id" class="indoor-marker"
        :class="{ 'is-selected': selected?.id === patient.id }"
        :style="{ top: patient.indoorY + '%', left: patient.indoorX + '%' }" @click="handleClick(patient)">

        <div class="pin-dot" :class="patient.sos ? 'bg-red' : (patient.status === 'ONLINE' ? 'bg-green' : 'bg-gray')">
          <div v-if="patient.sos" class="sos-ring"></div>
        </div>
        <div class="pin-label">{{ patient.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>


const handleClick = (patient) => {
  // 室內地圖點擊標記，可以自行加入選中邏輯或 Emit 事件
  console.log('Clicked in indoor map:', patient.name)
}
</script>

<style scoped>
.indoor-map-container {
  width: 100%;
  height: 100%;
  background-color: #2c3e50;
  /* 若圖片有透明度，給個深色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.indoor-map-wrapper {
  position: relative;
  max-width: 95%;
  max-height: 95%;
  /* 讓容器貼齊內部圖片比例 */
  display: inline-block;
}

.indoor-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* 室內標記樣式 */
.indoor-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 2;
}

.indoor-marker.is-selected {
  transform: translate(-50%, -50%) scale(1.3);
  z-index: 10;
}

.pin-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
}

.pin-label {
  background: rgba(255, 255, 255, 0.85);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  color: #333;
  margin-top: 4px;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 顏色設定 */
.bg-green {
  background-color: #10b981;
}

.bg-gray {
  background-color: #9ca3af;
}

.bg-red {
  background-color: #ef4444;
}

/* 警報動畫 */
.sos-ring {
  position: absolute;
  top: -6px;
  left: -6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: rgba(239, 68, 68, 0.6);
  animation: pulse 1s infinite ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }

  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
</style>
