<template>
    <div class="table-footer" v-if="total > 0">
        <span>{{ $t('pagination.total', { count: total }) }}</span>

        <select class="page-size" disabled>
            <option>{{ $t('pagination.page_size', { size: pageSize }) }}</option>
        </select>

        <div class="pagination-row">
            <button @click="changePage(current - 1)" :disabled="current === 1">&lt;</button>

            <button v-for="page in totalPages" :key="page" :class="{ active: current === page }"
                @click="changePage(page)">
                {{ page }}
            </button>

            <button @click="changePage(current + 1)" :disabled="current === totalPages">&gt;</button>
        </div>

        <span>{{ $t('pagination.goto') }}
            <input type="number" :value="current" @change="handleJump" class="goto-input" />
            {{ $t('pagination.page') }}
        </span>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    total: { type: Number, required: true },
    current: { type: Number, required: true },
    pageSize: { type: Number, default: 10 }
})

const emit = defineEmits(['change'])

const totalPages = computed(() => Math.ceil(props.total / props.pageSize) || 1)

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        emit('change', page)
    }
}

const handleJump = (event) => {
    const val = parseInt(event.target.value)
    changePage(val)
}
</script>

<style scoped>
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