<template>
    <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
        <div class="modal-content">
            <button class="close-btn" @click="closeModal">✕</button>
            <h2 class="modal-title">{{ announcement.title }}</h2>
            <div class="modal-body">
                {{ announcement.content }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    isOpen: { type: Boolean, default: false },
    announcement: { type: Object, default: () => ({ title: '', content: '' }) }
})
const emit = defineEmits(['close'])
const closeModal = () => { emit('close') }
</script>
<style scoped>
/* 黑色半透明遮罩 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    /* 確保在最上層 */
}

/* 白色對話框本體 */
.modal-content {
    background: #ffffff;
    width: 90%;
    max-width: 600px;
    /* 依照圖示稍微寬一點 */
    border-radius: 8px;
    padding: 32px;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 關閉按鈕 */
.close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    font-size: 20px;
    color: #666;
    cursor: pointer;
    transition: color 0.2s;
}

.close-btn:hover {
    color: #000;
}

/* 標題樣式 */
.modal-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-top: 0;
    margin-bottom: 24px;
    line-height: 1.4;
    padding-right: 24px;
    /* 避免文字蓋到關閉按鈕 */
}

/* 內文樣式 */
.modal-body {
    font-size: 14px;
    color: #333;
    line-height: 1.8;
    /* 增加行距提升閱讀舒適度 */
    white-space: pre-line;
    /* 這是關鍵：會把資料中的 \n 轉換為真實換行 */
}
</style>