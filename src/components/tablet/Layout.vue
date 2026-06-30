<template>
    <div class="desktop-layout">
        <header class="top-navbar">
            <div class="logo-area">
                <span class="logo-icon">💠</span>
                <div class="logo-area">
                    <h1>{{ $t('layout.title') }}</h1>
                    <h1>{{ $t('layout.title2') }}</h1>
                </div>
            </div>

            <nav class="nav-links">
                <RouterLink to="/" class="nav-item">{{ $t('layout.nav.dashboard') }}</RouterLink>
                <RouterLink to="/analysisList" class="nav-item">{{ $t('layout.nav.analysis') }}</RouterLink>
                <RouterLink to="/location" class="nav-item">{{ $t('layout.nav.location') }}</RouterLink>
                <RouterLink to="/data" class="nav-item">{{ $t('layout.nav.data') }}</RouterLink>
                <RouterLink to="/users" class="nav-item">{{ $t('layout.nav.users') }}</RouterLink>
            </nav>

            <div class="user-actions">
                <button @click="toggleFullscreen" class="fs-btn" :title="isFullscreen ? '退出全螢幕' : '全螢幕'">
                    {{ isFullscreen ? '⛒' : '⛶' }}
                </button>

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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isFullscreen = ref(false)

// ⭐ 1. 初始化讀取 LocalStorage
onMounted(() => {
    const savedLocale = localStorage.getItem('app-locale')
    if (savedLocale) {
        locale.value = savedLocale
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
})

// ⭐ 2. 監聽 locale 變化並存入 LocalStorage
watch(locale, (newLocale) => {
    localStorage.setItem('app-locale', newLocale)
})
// 全螢幕切換邏輯
const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`)
        })
    } else {
        document.exitFullscreen()
    }
}

// 監聽 ESC 鍵退出或系統全螢幕狀態變更
const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
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

.logo-area {
    display: flex;
    flex-direction: column;
    /* 讓文字上下排列 */
    align-items: flex-start;
    /* 文字靠左對齊 */
    justify-content: center;
    gap: 2px;
    /* 兩行文字的間距 */
}

.logo-area h1 {
    font-size: 15px;
    /* 稍微調整讓上下兩行比例更好 */
    font-weight: bold;
    margin: 0;
    color: #ffffff;
    line-height: 1.2;
    letter-spacing: 1px;
}

.nav-links {
    display: flex;
    height: 100%;
    flex: 1;
    justify-content: center;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 0 8px;
    color: #8da2b5;
    text-decoration: none;
    font-size: 14px;
    white-space: nowrap;
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
}

/* ⭐ 新增：全螢幕按鈕樣式 */
.fs-btn {
    background: transparent;
    border: 1px solid #2a3543;
    color: #8da2b5;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.fs-btn:hover {
    color: #ffffff;
    border-color: #4db8ff;
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

.logout-btn {
    background: transparent;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 14px;
    border-left: 1px solid #2a3543;
    padding-left: 8px;
    white-space: nowrap;
}
</style>