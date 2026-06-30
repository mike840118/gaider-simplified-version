<template>
    <div class="table-container">
        <table class="alert-bubble-table">
            <thead>
                <tr>
                    <th>序號</th>
                    <th>姓名</th>
                    <th>數值</th>
                    <th>狀態</th>
                    <th>測量時間</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in paginatedData" :key="row.id" class="bubble-row">
                    <td>{{ row.index }}</td>
                    <td>{{ row.name }}</td>
                    <td class="text-red bold">{{ row.value }}</td>
                    <td>{{ row.statusText }}</td>
                    <td>{{ row.time }}</td>
                </tr>
                <tr v-if="paginatedData.length === 0">
                    <td colspan="5" style="padding: 20px; color: #999;">無警報資料</td>
                </tr>
            </tbody>
        </table>
    </div>
    <Pagination :total="filteredData.length" :current="currentPage" @change="currentPage = $event" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Pagination from '@/components/Pagination.vue'

const props = defineProps(['patients', 'metric', 'selectedUserId'])
const { t } = useI18n()
const currentPage = ref(1)

// 監聽父元件過濾條件，變更時重置分頁
watch([() => props.metric, () => props.selectedUserId], () => currentPage.value = 1)

// 警報資料過濾邏輯
const filteredData = computed(() => {
    let list = props.patients.filter(p => p.level === 'WARN' || p.level === 'URGENT')
    if (props.selectedUserId) list = list.filter(p => p.accountId === props.selectedUserId)

    return list.map((p, i) => {
        const d = p.data || {}
        let val = '--', time = '--';

        // 動態抓取對應指標的數值
        if (props.metric === 'bp') val = (d.BloodPressure?.sbp) ? `${d.BloodPressure.sbp}/${d.BloodPressure.dbp}` : '--'
        else if (props.metric === 'spo2') val = d.BloodOxygen?.bo || '--'
        else if (props.metric === 'hr') val = d.HeartBeat?.hb || '--'
        else if (props.metric === 'temp') val = d.BodyTemp?.bodyTemp || '--'
        else if (props.metric === 'hrv') val = d.HDRri?.hrv || '--'

        // 時間處理
        if (p.newTestTime) time = p.newTestTime.replace('T', ' ').substring(0, 16)

        return {
            id: p.accountId,
            index: i + 1,
            name: p.name || '未知',
            value: val,
            statusText: p.level === 'URGENT' ? '緊急' : '預警',
            time: time
        }
    }).filter(x => x.value !== '--')
})

const paginatedData = computed(() => filteredData.value.slice((currentPage.value - 1) * 10, currentPage.value * 10))
</script>

<style scoped>
/* 確保樣式定義完整 */
.table-container {
    flex: 1;
    overflow-y: auto;
    padding: 4px;
}

.alert-bubble-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 12px;
    text-align: center;
    font-size: 14px;
}

.alert-bubble-table th {
    color: #333;
    font-weight: bold;
    padding: 0 12px 8px 12px;
    border-bottom: none;
}

.bubble-row td {
    background: white;
    padding: 12px;
    border-top: 1px solid #eaeaea;
    border-bottom: 1px solid #eaeaea;
    color: #555;
}

.bubble-row td:first-child {
    border-left: 1px solid #eaeaea;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
}

.bubble-row td:last-child {
    border-right: 1px solid #eaeaea;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
}

.text-red {
    color: #ef4444;
}

.bold {
    font-weight: bold;
}
</style>