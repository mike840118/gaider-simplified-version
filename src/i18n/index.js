import { createI18n } from 'vue-i18n'

// 直接引入拆分好的 JSON 檔案
import zh from './locales/zh.json'
import en from './locales/en.json'
import ja from './locales/ja.json'

const i18n = createI18n({
  legacy: false,          // 必須為 false 才能支援 Composition API
  globalInjection: true,  // 必須為 true 才能在 template 直接用 $t
  locale: 'zh',           // 預設語系 (繁體中文)
  fallbackLocale: 'en',   // 找不到字眼時的退路
  messages: {
    zh,  // 等同於 zh: zh
    en,  // 等同於 en: en
    ja   // 等同於 ja: ja
  }
})

export default i18n