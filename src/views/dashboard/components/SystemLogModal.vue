<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content log-modal">
            <div class="modal-header">
                <h2 class="modal-title">{{ $t('system_log.title', '系統記錄') }}</h2>
                <button class="close-btn" @click="closeModal">✕</button>
            </div>

            <div class="log-grid">
                <div class="log-item" v-for="(log, index) in systemLogs" :key="index">
                    <span class="log-time">{{ log.time }}</span>
                    <span class="log-name">{{ log.name }}</span>
                    <span class="log-action">{{ log.action }}</span>
                </div>
            </div>

            <div class="modal-footer">
                <a href="#" class="export-link" @click.prevent="">
                    {{ $t('system_log.export_report', '輸出本日報告') }}
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import rawPatientData from '@/mock/patients.json'

const props = defineProps({
    isOpen: Boolean
})

const emit = defineEmits(['close'])
const closeModal = () => emit('close')

const { t } = useI18n()

// 根據 JSON 資料動態產生系統紀錄
const systemLogs = computed(() => {
    let generatedLogs = []
    const patients = rawPatientData.data.data

    patients.forEach(p => {
        if (!p.newTestTime) return

        // 格式化時間為 HH:mm 格式
        const dateObj = new Date(p.newTestTime)
        const timeStr = `${String(dateObj.getUTCHours()).padStart(2, '0')}:${String(dateObj.getUTCMinutes()).padStart(2, '0')}`

        // 判斷 1: SOS 預警
        if (p.sos) {
            generatedLogs.push({
                rawTime: dateObj.getTime() + 100, // 稍微排序用
                time: timeStr,
                name: p.name || t('common.unknown', '未知'),
                action: t('system_log.action.sos_alert', 'SOS設備預警操作')
            })
        }

        // 判斷 2: 設備電量低 (< 30%)
        if (p.electricity < 30) {
            generatedLogs.push({
                rawTime: dateObj.getTime() + 50,
                time: timeStr,
                name: p.name || t('common.unknown', '未知'),
                action: t('system_log.action.low_battery', '設備電量低')
            })
        }

        // 判斷 3: 健康訊息上傳 (依據 level 判斷正常或異常)
        if (p.level === 'NORMAL') {
            generatedLogs.push({
                rawTime: dateObj.getTime(),
                time: timeStr,
                name: p.name || t('common.unknown', '未知'),
                action: t('system_log.action.upload_normal', '上傳了健康訊息 (正常)')
            })
        } else {
            generatedLogs.push({
                rawTime: dateObj.getTime(),
                time: timeStr,
                name: p.name || t('common.unknown', '未知'),
                action: t('system_log.action.upload_abnormal', '上傳了健康訊息 (異常)')
            })
        }
    })

    // 依據時間反向排序 (最新的在前面)
    generatedLogs.sort((a, b) => b.rawTime - a.rawTime)

    // 為了符合截圖的排版，我們取前 12 筆資料 (剛好雙排各 6 個)
    return generatedLogs.slice(0, 12)
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content.log-modal {
    background: white;
    border-radius: 8px;
    padding: 24px 32px;
    position: relative;
    max-width: 900px;
    /* 加寬以容納雙排 */
    width: 90%;
    max-height: 85vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 16px;
    margin-bottom: 20px;
}

.modal-title {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

.close-btn {
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
}

.close-btn:hover {
    color: #333;
}

/* 雙排 Grid 佈局 */
.log-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* 左右各一半 */
    column-gap: 40px;
    row-gap: 20px;
    overflow-y: auto;
    padding-bottom: 20px;
}

.log-item {
    display: flex;
    align-items: center;
    font-size: 15px;
    color: #333;
}

.log-time {
    color: #999;
    width: 50px;
    flex-shrink: 0;
    font-family: monospace;
    font-size: 14px;
}

.log-name {
    font-weight: bold;
    margin-right: 8px;
    color: #222;
}

.log-action {
    color: #444;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    padding-top: 16px;
}

.export-link {
    color: #1890ff;
    text-decoration: none;
    font-size: 14px;
}

.export-link:hover {
    text-decoration: underline;
}
</style>