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

.logo-area {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-area h1 {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    color: #ffffff;
}

.nav-links {
    display: flex;
    height: 100%;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 0 24px;
    color: #8da2b5;
    text-decoration: none;
    font-size: 15px;
    transition: all 0.2s;
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
    gap: 16px;
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
    font-size: 15px;
    border-left: 1px solid #2a3543;
    padding-left: 16px;
}
</style>