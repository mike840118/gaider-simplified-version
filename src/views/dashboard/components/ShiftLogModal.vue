<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content shift-modal">
      <div class="modal-header">
        <h2 class="modal-title">{{ $t('shift_log.title') }}</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <div class="sub-header">
        <div class="info-item">
          <span class="icon">📅</span> 2026/06/29
        </div>
        <div class="info-item">
          <span class="icon text-yellow">☀️</span> {{ $t('shift_log.shift_day') }}
        </div>
        <div class="divider-vertical"></div>
        <div class="info-item">
          <span class="icon">👤</span> {{ $t('shift_log.recorder') }}：{{ $t('shift_log.mock.recorder_name_1') }}
        </div>
      </div>

      <div class="section-title">{{ $t('shift_log.resident_event_record') }}</div>
      <div class="table-wrapper">
        <table class="shift-table">
          <thead>
            <tr>
              <th width="12%">{{ $t('shift_log.table.time') }}</th>
              <th width="8%">{{ $t('shift_log.table.severity') }}</th>
              <th width="8%">{{ $t('shift_log.table.category') }}</th>
              <th width="12%">{{ $t('shift_log.table.bed_name') }}</th>
              <th width="10%">{{ $t('shift_log.table.recorder') }}</th>
              <th width="35%">{{ $t('shift_log.table.content') }}</th>
              <th width="15%">{{ $t('shift_log.table.status_tracking') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">2026/06/29<br>10：00</td>
              <td class="text-center"><span class="tag tag-high">{{ $t('shift_log.severity_levels.high') }}</span></td>
              <td class="text-center">{{ $t('shift_log.categories.physiological') }}</td>
              <td class="text-center" v-html="$t('shift_log.mock.patient_1')"></td>
              <td class="text-center">{{ $t('shift_log.mock.recorder_name_2') }}</td>
              <td v-html="$t('shift_log.mock.content_1')"></td>
              <td>
                <select class="status-select outline-none">
                  <option selected>{{ $t('shift_log.status_options.tracking') }}</option>
                  <option>{{ $t('shift_log.status_options.processed') }}</option>
                </select>
              </td>
            </tr>
            <tr>
              <td class="text-center">2026/06/29<br>13：00</td>
              <td class="text-center"><span class="tag tag-med">{{ $t('shift_log.severity_levels.medium') }}</span></td>
              <td class="text-center">{{ $t('shift_log.categories.event') }}</td>
              <td class="text-center" v-html="$t('shift_log.mock.patient_2')"></td>
              <td class="text-center">{{ $t('shift_log.mock.recorder_name_2') }}</td>
              <td v-html="$t('shift_log.mock.content_2')"></td>
              <td>
                <select class="status-select outline-none">
                  <option selected>{{ $t('shift_log.status_options.processed') }}</option>
                  <option>{{ $t('shift_log.status_options.tracking') }}</option>
                </select>
              </td>
            </tr>
            <tr>
              <td class="text-center">2026/06/28<br>08：01</td>
              <td class="text-center"><span class="tag tag-low">{{ $t('shift_log.severity_levels.low') }}</span></td>
              <td class="text-center">{{ $t('shift_log.categories.affair') }}</td>
              <td class="text-center" v-html="$t('shift_log.mock.patient_3')"></td>
              <td class="text-center">{{ $t('shift_log.mock.recorder_name_3') }}</td>
              <td v-html="$t('shift_log.mock.content_3')"></td>
              <td>
                <select class="status-select outline-none">
                  <option selected>{{ $t('shift_log.status_options.processed') }}</option>
                  <option>{{ $t('shift_log.status_options.tracking') }}</option>
                </select>
              </td>
            </tr>
            <tr>
              <td class="text-center">2026/06/26<br>23：16</td>
              <td class="text-center"><span class="tag tag-med">{{ $t('shift_log.severity_levels.medium') }}</span></td>
              <td class="text-center">{{ $t('shift_log.categories.event') }}</td>
              <td class="text-center" v-html="$t('shift_log.mock.patient_4')"></td>
              <td class="text-center">{{ $t('shift_log.mock.recorder_name_4') }}</td>
              <td v-html="$t('shift_log.mock.content_4')"></td>
              <td>
                <select class="status-select outline-none">
                  <option selected>{{ $t('shift_log.status_options.processed') }}</option>
                  <option>{{ $t('shift_log.status_options.tracking') }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bottom-grid">

        <div class="summary-section">
          <div class="section-title mt-0">{{ $t('shift_log.summary.title') }}</div>
          <div class="summary-list">
            <div class="summary-card border-red">
              <div class="card-title text-red">{{ $t('shift_log.summary.sos_alert') }}</div>
              <div class="card-desc">
                {{ $t('shift_log.mock.summary_desc_1') }}<br>
                <span class="remark">{{ $t('shift_log.summary.remark') }}：{{ $t('shift_log.mock.summary_remark_1')
                }}</span>
              </div>
            </div>

            <div class="summary-card border-blue">
              <div class="card-title text-blue">{{ $t('shift_log.summary.low_battery_alert') }}</div>
              <div class="card-desc">{{ $t('shift_log.mock.summary_desc_2') }}</div>
            </div>

            <div class="summary-card border-purple">
              <div class="card-title text-purple">{{ $t('shift_log.summary.night_movement_alert') }}</div>
              <div class="card-desc">
                {{ $t('shift_log.mock.summary_desc_3') }}<br>
                <span class="remark">{{ $t('shift_log.summary.remark') }}：{{ $t('shift_log.mock.summary_remark_3')
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-box">
          <div class="section-title mt-0">{{ $t('shift_log.form.title') }}</div>

          <div class="form-row-grid">
            <div class="input-group">
              <label>{{ $t('shift_log.form.time') }}</label>
              <input type="text" value="2026/06/29" class="form-input" />
            </div>
            <div class="input-group">
              <label>{{ $t('shift_log.form.severity') }}</label>
              <select class="form-input">
                <option>{{ $t('shift_log.severity_levels.high_icon') }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>{{ $t('shift_log.form.category') }}</label>
              <select class="form-input">
                <option>{{ $t('shift_log.categories.placeholder') }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>{{ $t('shift_log.form.bed_name') }}</label>
              <div class="search-input-wrapper">
                <input type="text" :placeholder="$t('shift_log.form.search_placeholder')" class="form-input" />
                <span class="search-icon">🔍</span>
              </div>
            </div>
            <div class="input-group">
              <label>{{ $t('shift_log.form.recorder') }}</label>
              <input type="text" :value="$t('shift_log.mock.recorder_name_2')" class="form-input input-readonly"
                readonly />
            </div>
          </div>

          <div class="input-group mt-12">
            <label>{{ $t('shift_log.form.content') }}</label>
            <textarea class="content-textarea"></textarea>
          </div>
          <div class="submit-row">
            <button class="btn-submit">{{ $t('shift_log.form.add_btn') }}</button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n' // 👈 引入 i18n

defineProps({ isOpen: Boolean })
const emit = defineEmits(['close'])
const closeModal = () => emit('close')

const { t } = useI18n() // 👈 初始化
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content.shift-modal {
  background: white;
  border-radius: 8px;
  padding: 24px 32px;
  width: 1200px;
  max-width: 95%;
  height: 90vh;
  /* 固定高度，讓內部區塊可以用 flex 分配比例 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

/* ================= 標題與次標題 ================= */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.sub-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eaeaea;
  font-size: 15px;
  color: #333;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-yellow {
  color: #fadb14;
}

.divider-vertical {
  width: 1px;
  height: 16px;
  background-color: #ccc;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 20px 0 12px 0;
}

.mt-0 {
  margin-top: 0;
}

/* ================= 上方：住民事件記錄表格 (自動延伸佔8成) ================= */
.table-wrapper {
  flex: 1;
  /* 自動佔用剩餘最大空間 */
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 24px;
  /* 與下方區塊保持距離 */
}

.shift-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.shift-table th {
  background-color: #f9fafb;
  color: #4b5563;
  font-weight: normal;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 1;
}

.shift-table th.text-center,
.shift-table td.text-center {
  text-align: center;
}

.shift-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
  vertical-align: top;
  line-height: 1.5;
}

.status-select {
  border: none;
  background: transparent;
  color: #333;
  cursor: pointer;
  font-size: 14px;
}

.outline-none:focus {
  outline: none;
}

/* 標籤 */
.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
}

.tag-high {
  background-color: #fee2e2;
  color: #ef4444;
}

.tag-med {
  background-color: #fef3c7;
  color: #f59e0b;
}

.tag-low {
  background-color: #e0f2fe;
  color: #3b82f6;
}

/* ================= 下方：底部雙欄佈局 (固定不壓縮佔2成) ================= */
.bottom-grid {
  flex-shrink: 0;
  /* 避免被上方表格擠壓 */
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  /* 右側表單略寬以容納整行輸入 */
  gap: 24px;
}

/* 左側：摘要區塊 */
.summary-section {
  display: flex;
  flex-direction: column;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 240px;
  /* 限制高度出現捲軸 */
  overflow-y: auto;
  padding-right: 8px;
}

.summary-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px 16px;
  background-color: white;
}

.summary-card.border-red {
  border-left: 4px solid #ef4444;
}

.summary-card.border-blue {
  border-left: 4px solid #3b82f6;
}

.summary-card.border-purple {
  border-left: 4px solid #8b5cf6;
}

.card-title {
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 4px;
}

.text-red {
  color: #ef4444;
}

.text-blue {
  color: #3b82f6;
}

.text-purple {
  color: #8b5cf6;
}

.card-desc {
  font-size: 13px;
  color: #333;
  line-height: 1.5;
}

.remark {
  color: #6b7280;
  font-size: 12px;
}

/* 右側：新增表單區塊 */
.form-box {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

/* Grid 鎖定一列：確保輸入框不換行且比例完美 */
.form-row-grid {
  display: grid;
  grid-template-columns: 110px 80px 80px 1fr 80px;
  gap: 12px;
  align-items: flex-end;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-size: 13px;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.input-readonly {
  background-color: #f3f4f6;
  color: #6b7280;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input-wrapper input {
  padding-right: 28px;
}

.search-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 13px;
}

.mt-12 {
  margin-top: 12px;
}

.content-textarea {
  width: 100%;
  height: 60px;
  /* 壓低高度確保底部俐落 */
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  resize: none;
  outline: none;
  box-sizing: border-box;
}

.submit-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.btn-submit {
  background-color: #2f5a70;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.btn-submit:hover {
  background-color: #1e3a48;
}
</style>
