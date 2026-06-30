<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content bind-modal">
            <div class="modal-header">
                <h2 class="modal-title">{{ $t('bind_device.title', '設備綁定') }}</h2>
                <button class="close-btn" @click="closeModal">✕</button>
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label>{{ $t('bind_device.select_user', '選擇用戶') }}</label>
                    <div class="input-with-btn">
                        <input type="text" :placeholder="$t('bind_device.placeholder_user', '請選擇用戶')" />
                        <button class="btn-select">{{ $t('bind_device.btn_select', '選擇') }}</button>
                    </div>
                </div>

                <div class="form-group mt-4">
                    <label>{{ $t('bind_device.select_device', '選擇設備') }}</label>
                    <div class="input-with-btn">
                        <div class="input-icon-wrapper">
                            <input type="text" :placeholder="$t('bind_device.placeholder_device', '輸入/掃描/選擇設備碼')" />
                            <span class="camera-icon">📷</span>
                        </div>
                        <button class="btn-select">{{ $t('bind_device.btn_select', '選擇') }}</button>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-confirm" @click="closeModal">{{ $t('bind_device.btn_confirm', '確認綁定') }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close'])
const closeModal = () => emit('close')
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

.modal-content.bind-modal {
    background: white;
    border-radius: 8px;
    padding: 24px 32px;
    width: 450px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.modal-title {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

.close-btn {
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
}

.form-group label {
    display: block;
    font-size: 14px;
    margin-bottom: 8px;
    color: #333;
}

.input-with-btn {
    display: flex;
    gap: 12px;
    align-items: center;
}

.input-with-btn input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
}

.input-icon-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
}

.input-icon-wrapper input {
    width: 100%;
    padding-right: 36px;
}

.camera-icon {
    position: absolute;
    right: 10px;
    font-size: 18px;
    color: #999;
    cursor: pointer;
}

.btn-select {
    background: white;
    color: #2f5a70;
    border: 1px solid #2f5a70;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.mt-4 {
    margin-top: 20px;
}

.modal-footer {
    margin-top: 32px;
    display: flex;
    justify-content: center;
}

.btn-confirm {
    background: #2f5a70;
    color: white;
    border: none;
    padding: 10px 40px;
    border-radius: 20px;
    font-size: 15px;
    cursor: pointer;
    font-weight: bold;
}
</style>