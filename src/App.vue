<script setup>
import { RouterView } from 'vue-router' // 保留 Router 視圖，這樣才能切換頁面
import { useBreakpoints } from '@vueuse/core'
import DesktopLayout from './components/desktop/Layout.vue'
import TabletLayout from './components/tablet/Layout.vue'
import MobileLayout from './components/mobile/Layout.vue'

// 設定與 CSS 一致的斷點
const breakpoints = useBreakpoints({
  tablet: 768,
  desktop: 1024,
})

const isMobile = breakpoints.smaller('tablet')
const isTablet = breakpoints.between('tablet', 'desktop')
const isDesktop = breakpoints.greaterOrEqual('desktop')
</script>

<template>
  <div class="app-wrapper">
    <DesktopLayout v-if="isDesktop">
      <RouterView />
    </DesktopLayout>

    <TabletLayout v-else-if="isTablet">
      <RouterView />
    </TabletLayout>

    <MobileLayout v-if="isMobile">
      <RouterView />
    </MobileLayout>
  </div>
</template>

<style>
/* 基礎樣式重置，把預設的那些樣式都清掉 */
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-wrapper {
  width: 100%;
  min-height: 100vh;
}
</style>