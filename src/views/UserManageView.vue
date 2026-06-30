<template>
    <div class="user-management-container">
        <div class="action-header">
            <input type="text" v-model="searchQuery" placeholder="用戶姓名" class="search-input" />
            <button class="btn-search">🔍 搜尋</button>
            <button class="btn-add">➕ 新增</button>
        </div>

        <div class="user-grid">
            <div v-for="user in paginatedUsers" :key="user.id" class="user-card">
                <button class="edit-btn">✏️</button>
                <div class="avatar-container">
                    <img v-if="user.hasAvatar" :src="user.avatarUrl" class="avatar-photo" alt="avatar" />
                    <div v-else class="avatar-placeholder">{{ user.gender === '女' ? '👩' : '👨' }}</div>
                </div>
                <div class="user-name">{{ user.name }}</div>
                <div class="user-meta">{{ user.age }}歲 &nbsp; {{ user.gender }}</div>
            </div>

            <div v-if="filteredUsers.length === 0" class="no-data">
                找不到符合名稱的用戶
            </div>
        </div>

        <div v-if="filteredUsers.length > 0" class="footer-pagination">
            <span>共 {{ filteredUsers.length }} 項</span>
            <select disabled class="page-size-select">
                <option>{{ itemsPerPage }}項/頁</option>
            </select>

            <div class="pages">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
                <button v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }"
                    @click="changePage(page)">
                    {{ page }}
                </button>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
            </div>
            <span>前往 <input type="number" v-model.number="currentPage" min="1" :max="totalPages" class="page-goto" />
                頁</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// ⭐ 引入我們先前存好的 JSON 檔案
import rawPatientData from '@/mock/patients.json'

// --- 1. 搜尋與分頁設定 ---
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 15

// ⭐ 2. 資料轉換器 (Data Mapper)
const formatUsers = (sourceArray) => {
    return sourceArray.map((item, index) => {
        // 計算年齡
        let age = 60
        if (item.birthday) {
            const birthYear = new Date(item.birthday).getFullYear()
            age = 2026 - birthYear
        }

        return {
            id: item.accountId || index,
            name: item.name || '未知',
            age: age,
            gender: item.gender === 'WOMAN' ? '女' : '男',
            // 判斷 URL 是否有值，並存起來
            hasAvatar: !!item.url,
            avatarUrl: item.url
        }
    })
}

// 載入轉換後的真實資料
const mockUsers = ref(formatUsers(rawPatientData.data.data))

// --- 3. 搜尋過濾邏輯 ---
const filteredUsers = computed(() => {
    if (!searchQuery.value.trim()) return mockUsers.value
    const keyword = searchQuery.value.toLowerCase()
    return mockUsers.value.filter(user =>
        user.name.toLowerCase().includes(keyword)
    )
})

watch(searchQuery, () => {
    currentPage.value = 1
})

// --- 4. 分頁邏輯 ---
const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage) || 1
})

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredUsers.value.slice(start, end)
})

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}
</script>

<style scoped>
/* 鎖定外層高度，防止外層滾輪 */
.user-management-container {
    background: #f4f7f9;
    padding: 20px;
    height: calc(100vh - 155px);
    border-radius: 8px;
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.action-header {
    flex-shrink: 0;
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 20px;
}

.search-input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 220px;
}

.btn-search {
    background: #8cd3ff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.btn-add {
    background: #bdf2fa;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    color: #2f4955;
}

/* ⭐ 將這裡設為唯一滾動區 */
.user-grid {
    flex: 1;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    align-content: start;
    padding-right: 8px;
}

.user-card {
    background: white;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.edit-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
}

.avatar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
}

/* ⭐ 新增真實大頭貼的樣式 */
.avatar-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    /* 確保照片填滿圓形不變形 */
    border: 1px solid #cbd5e1;
}

.avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    border: 1px solid #cbd5e1;
    overflow: hidden;
}

.user-name {
    font-size: 18px;
    font-weight: bold;
    color: #2f4955;
    margin-bottom: 4px;
}

.user-meta {
    font-size: 13px;
    color: #666;
}

.no-data {
    grid-column: 1 / -1;
    text-align: center;
    color: #666;
    padding: 20px 0;
}

/* 底部固定分頁 */
.footer-pagination {
    flex-shrink: 0;
    margin-top: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #666;
    padding-top: 16px;
    border-top: 1px solid #cbd5e1;
}

.page-size-select {
    padding: 4px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background: white;
}

.pages {
    display: flex;
    gap: 4px;
}

.pages button {
    padding: 4px 10px;
    border: 1px solid #ccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;
}

.pages button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pages button.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.page-goto {
    width: 40px;
    text-align: center;
    padding: 2px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

/* 美化滾動條 */
.user-grid::-webkit-scrollbar {
    width: 6px;
}

.user-grid::-webkit-scrollbar-track {
    background: #f1f5f9;
}

.user-grid::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.user-grid::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>