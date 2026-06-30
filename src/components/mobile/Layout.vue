<template>
    <div class="mobile-layout">
        <header class="mobile-header">
            <span class="logo-icon">💠</span>
            <div class="logo-area">
                <h1>{{ $t('layout.title') }}</h1>
                <h1>{{ $t('layout.title2') }}</h1>
            </div>

            <div class="header-right">
                <select v-model="locale" class="lang-select">
                    <option value="zh">繁中</option>
                    <option value="en">EN</option>
                    <option value="ja">JA</option>
                </select>

                <button class="logout-sm">{{ $t('layout.logout') }}</button>

                <button class="hamburger-btn" @click="isNavOpen = !isNavOpen">
                    ☰
                </button>
            </div>
        </header>

        <nav v-if="isNavOpen" class="mobile-nav-menu">
            <RouterLink to="/" class="nav-item" @click="isNavOpen = false">
                📊 {{ $t('layout.nav.dashboard') }}
            </RouterLink>
            <RouterLink to="/analysisList" class="nav-item" @click="isNavOpen = false">
                📋 {{ $t('layout.nav.analysis') }}
            </RouterLink>
            <RouterLink to="/location" class="nav-item" @click="isNavOpen = false">
                📍 {{ $t('layout.nav.location') }}
            </RouterLink>
            <RouterLink to="/data" class="nav-item" @click="isNavOpen = false">
                💾 {{ $t('layout.nav.data') }}
            </RouterLink>
            <RouterLink to="/users" class="nav-item" @click="isNavOpen = false">
                👤 {{ $t('layout.nav.users') }}
            </RouterLink>
        </nav>

        <main class="main-content">
            <slot />
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

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
// 控制漢堡選單開關的狀態
const isNavOpen = ref(false)
</script>

<style scoped>
.mobile-layout {
    background-color: #121921;
    min-height: 100vh;
    color: #e0e0e0;
    position: relative;
}

.mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1a222c;
    padding: 0 12px;
    height: 56px;
    border-bottom: 1px solid #2a3543;
    position: relative;
    z-index: 100;
    /* 確保 Header 在最上層 */
}

/* 左側 Logo 區 */
.logo-area {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}

.logo-area h1 {
    font-size: 15px;
    font-weight: bold;
    margin: 0;
    color: #ffffff;
    white-space: nowrap;
}

/* 右側操作區 (語言 + 退出 + 漢堡) */
.header-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* 微縮版語言選單 */
.lang-select {
    background-color: #1a222c;
    color: #8da2b5;
    border: 1px solid #2a3543;
    padding: 4px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    outline: none;
}

.lang-select:focus {
    border-color: #4db8ff;
    color: #fff;
}

/* 退出按鈕 */
.logout-sm {
    background: transparent;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
    padding-left: 10px;
    border-left: 1px solid #2a3543;
}

/* 漢堡選單按鈕 */
.hamburger-btn {
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 22px;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
}

/* 下拉 Router 導覽列選單 */
.mobile-nav-menu {
    position: absolute;
    top: 56px;
    /* 貼齊 Header 底部 */
    left: 0;
    width: 100%;
    background-color: #1a222c;
    border-bottom: 1px solid #2a3543;
    display: flex;
    flex-direction: column;
    z-index: 99;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.nav-item {
    padding: 16px 24px;
    color: #8da2b5;
    text-decoration: none;
    font-size: 15px;
    border-bottom: 1px solid #243545;
    display: flex;
    align-items: center;
    gap: 12px;
}

.nav-item:last-child {
    border-bottom: none;
}

.nav-item:hover {
    background-color: #243545;
    color: #ffffff;
}

.nav-item.router-link-exact-active {
    color: #ffffff;
    background-color: #243545;
    border-left: 4px solid #4db8ff;
    padding-left: 20px;
    /* 扣掉 border 的寬度保持視覺對齊 */
}

/* 中間內容區 */
.main-content {
    padding: 12px;
    /* 移除了原本給底部導覽列留的空間，現在可以佔滿 */
    height: calc(100vh - 56px);
    overflow: hidden;
}
</style>