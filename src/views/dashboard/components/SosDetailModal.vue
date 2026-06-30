<template>
    <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
        <div class="modal-wrapper">
            <button class="close-btn" @click="closeModal">✕</button>

            <div class="modal-layout">
                <div class="left-panel">
                    <div class="section-header">{{ $t('sos.detail_title') }}</div>
                    <div class="patient-info">
                        <div class="bed-text">{{ patient.companyName || $t('common.unknown') }}</div>
                        <div class="name-text">{{ patient.name }}</div>
                        <div class="time-text">
                            <span class="c-gray">{{ $t('sos.trigger_time') }}</span><br>
                            <span class="bold">{{ $t('sos.trigger_desc') }}</span>
                        </div>
                        <div class="loc-text">
                            <span class="c-gray">{{ $t('sos.current_location') }}</span><br>
                            <span class="bold loc-highlight">{{ $t('sos.location_desc') }}</span>
                        </div>
                        <div class="device-text c-gray">{{ $t('sos.device_type') }}</div>
                    </div>

                    <div class="section-header mt-4">{{ $t('sos.handle_title') }}</div>
                    <div class="action-form">
                        <button class="status-btn" :class="{ active: selectedAction === 'dispatched' }"
                            @click="selectedAction = 'dispatched'">{{ $t('sos.actions.dispatched') }}</button>

                        <button class="status-btn" :class="{ active: selectedAction === 'completed' }"
                            @click="selectedAction = 'completed'">{{ $t('sos.actions.completed') }}</button>

                        <button class="status-btn" :class="{ active: selectedAction === 'false_alarm' }"
                            @click="selectedAction = 'false_alarm'">{{ $t('sos.actions.false_alarm') }}</button>

                        <button class="confirm-btn" @click="handleConfirm">{{ $t('common.confirm') }}</button>
                    </div>
                </div>

                <div class="right-panel">
                    <div class="map-container">
                        <img :src="locationMap" alt="Floor Plan" class="map-img" />

                        <div class="location-marker">
                            <div class="pulse-ring"></div>
                            <div class="marker-avatar">
                                <img v-if="patient.hasAvatar" :src="patient.avatarUrl" />
                                <span v-else>{{ patient.gender === 'WOMAN' ? '👩' : '👨' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { useI18n } from 'vue-i18n' // 👈 引入 i18n
import locationMap from '@/assets/images/location.png'

const { t } = useI18n()
const props = defineProps({
    isOpen: { type: Boolean, default: false },
    patient: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['close'])

const selectedAction = ref('')
const remark = ref('')

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        selectedAction.value = ''
        remark.value = ''
    }
})

const closeModal = () => emit('close')

const handleConfirm = () => {
    if (!selectedAction.value) {
        alert(t('sos.please_select_action')) // 👈 i18n
        return
    }
    closeModal()
}
</script>
<style scoped>
/* 遮罩層 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-wrapper {
    background: #fff;
    width: 90%;
    max-width: 1000px;
    height: 80vh;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.close-btn {
    position: absolute;
    top: 12px;
    right: 16px;
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    z-index: 10;
}

/* 雙欄佈局 */
.modal-layout {
    display: flex;
    height: 100%;
}

/* 左側控制面板 */
.left-panel {
    width: 300px;
    background: #f9f9f9;
    padding: 24px;
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
}

.section-header {
    font-size: 16px;
    font-weight: bold;
    border-bottom: 2px solid #ccc;
    padding-bottom: 8px;
    margin-bottom: 16px;
    color: #333;
}

.patient-info {
    line-height: 1.8;
    font-size: 14px;
}

.bed-text {
    font-size: 14px;
    color: #555;
}

.name-text {
    font-size: 28px;
    font-weight: bold;
    color: #111;
    margin-bottom: 8px;
    letter-spacing: 2px;
}

.c-gray {
    color: #888;
}

.bold {
    font-weight: bold;
    color: #333;
}

.loc-highlight {
    font-size: 18px;
}

.mt-4 {
    margin-top: 24px;
}

/* 表單區塊 */
.action-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.status-btn {
    background: white;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 10px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    transition: 0.2s;
}

.status-btn.active {
    background: #eef2f6;
    border-color: #3b82f6;
    color: #3b82f6;
    font-weight: bold;
}

.remark-input {
    min-height: 80px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    resize: none;
    font-family: inherit;
    margin-top: 10px;
}

.confirm-btn {
    background: #1e3a5f;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
}

/* 右側地圖區塊 */
.right-panel {
    flex: 1;
    padding: 20px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
}

.map-container {
    width: 100%;
    height: 100%;
    border: 2px solid #ccc;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    background: #fafafa;
}

.map-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.8;
}

/* 核心：雷達定位點動畫 */
.location-marker {
    position: absolute;
    top: 60%;
    left: 50%;
    /* 這裡控制點位的位置 */
    transform: translate(-100%, 300%);
    width: 40px;
    height: 40px;
}

.marker-avatar {
    width: 100%;
    height: 100%;
    background: #fff;
    border: 2px solid #ef4444;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
}

.marker-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.pulse-ring {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(239, 68, 68, 0.4);
    border-radius: 50%;
    z-index: 1;
    animation: pulse 1.5s infinite ease-out;
}

@keyframes pulse {
    0% {
        transform: scale(0.3);
        opacity: 1;
    }

    100% {
        transform: scale(1.2);
        opacity: 0;
    }
}
</style>