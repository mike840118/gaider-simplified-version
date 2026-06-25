<template>
    <div class="desktop-layout">
        <header class="top-navbar">
            <div class="logo-area">
                <span class="logo-icon">💠</span>
                <h1>{{ $t('layout.title') }}</h1>
            </div>

            <nav class="nav-links">
                <RouterLink to="/" class="nav-item">{{ $t('layout.nav.dashboard') }}</RouterLink>
                <RouterLink to="/analysisList" class="nav-item">{{ $t('layout.nav.analysis') }}</RouterLink>
                <RouterLink to="/location" class="nav-item">{{ $t('layout.nav.location') }}</RouterLink>
                <RouterLink to="/data" class="nav-item">{{ $t('layout.nav.data') }}</RouterLink>
                <RouterLink to="/users" class="nav-item">{{ $t('layout.nav.users') }}</RouterLink>
            </nav>

            <div class="user-actions">
                <select v-model="locale" class="lang-select">
                    <option value="zh">繁體中文</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                </select>

                <button class="logout-btn">{{ $t('layout.logout') }}</button>
            </div>
        </header>

        <main class="main-content">
            <slot />
        </main>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// 取得當前語系變數，我們等一下會在 HTML 裡用 v-model 綁定它
const { locale } = useI18n()
</script>

<style scoped>
/* CSS 完全不需要更動，保持原本完美的樣式即可 */
.desktop-layout {
    background-color: #121921;
    min-height: 100vh;
    color: #e0e0e0;
}

.top-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1a222c;
    padding: 0 24px;
    height: 64px;
    border-bottom: 1px solid #2a3543;
}

/* 1. Logo 區塊：保護標題不被擠壓、不換行 */
.logo-area {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    /* 👈 關鍵：禁止被 Flexbox 壓縮 */
}

.logo-area h1 {
    font-size: 15px;
    font-weight: bold;
    margin: 0;
    color: #ffffff;
    white-space: nowrap;
    /* 👈 關鍵：文字絕對不換行 */
}

/* 2. 中間導覽列：稍微縮小按鈕間距，同樣禁止換行 */
.nav-links {
    display: flex;
    height: 100%;
    flex: 1;
    /* 讓導覽列自適應填滿中間剩餘空間 */
    justify-content: center;
    /* 讓選單置中比較好看 */
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 0 8px;
    /* 👈 把原本的 12px 縮小一點點，節省空間 */
    color: #8da2b5;
    text-decoration: none;
    font-size: 14px;
    white-space: nowrap;
    /* 👈 關鍵：文字絕對不換行 */
}

.nav-item:hover {
    color: #ffffff;
}

.nav-item.router-link-exact-active {
    color: #ffffff;
    background-color: #243545;
    border-bottom: 3px solid #4db8ff;
}

.main-content {
    padding: 24px;
    min-height: calc(100vh - 170px);
}

.user-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    /* 👈 關鍵：禁止被壓縮，避免選單跟退出疊在一起 */
}

.logout-btn {
    background: transparent;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 14px;
    border-left: 1px solid #2a3543;
    padding-left: 8px;
    white-space: nowrap;
    /* 👈 關鍵：「退出」兩個字絕對不換行 */
}

.lang-select {
    background-color: #1a222c;
    color: #8da2b5;
    border: 1px solid #2a3543;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    outline: none;
    transition: all 0.2s;
}

.lang-select:hover,
.lang-select:focus {
    color: #ffffff;
    border-color: #4db8ff;
}
</style>