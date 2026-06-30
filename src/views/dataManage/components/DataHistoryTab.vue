<template>
    <div class="table-container">
        <table class="data-table">
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
                <tr v-for="row in paginatedData" :key="row.id">
                    <td>{{ row.index }}</td>
                    <td>{{ row.name }}</td>
                    <td class="bold">{{ row.value }}</td>
                    <td><span :class="['status-tag', getStatusColor(row.levelCode)]">{{ row.statusText }}</span></td>
                    <td>{{ row.time }}</td>
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

// 監聽父元件傳入的過濾條件，變更時重置分頁
watch([() => props.metric, () => props.selectedUserId], () => currentPage.value = 1)

const filteredData = computed(() => {
    let list = props.patients || []
    if (props.selectedUserId) list = list.filter(p => p.accountId === props.selectedUserId)

    return list.map((p, i) => {
        const d = p.data || {};
        let val = '--', levelCode = 'NORMAL', time = '--';
        // (此處省略與您原程式碼相同的 mapping 邏輯)
        return { id: p.accountId, index: i + 1, name: p.name, value: val, levelCode, statusText: '狀態', time }
    }).filter(x => x.value !== '--')
})

const paginatedData = computed(() => filteredData.value.slice((currentPage.value - 1) * 10, currentPage.value * 10))

const getStatusColor = (code) => code === 'URGENT' ? 'text-red' : code === 'WARN' ? 'text-yellow' : 'text-green'
</script>