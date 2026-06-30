<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content add-member-modal">
            <button class="close-btn" @click="closeModal">✕</button>
            <h2 class="modal-title">{{ $t('add_member.title') }}</h2>

            <div class="form-grid">
                <div class="form-section">
                    <h3>{{ $t('add_member.basic_info') }}</h3>
                    <div class="form-group avatar-group">
                        <label>{{ $t('add_member.avatar') }}</label>
                        <div class="avatar-upload">+</div>
                    </div>
                    <div class="form-group">
                        <label>{{ $t('add_member.name') }}</label>
                        <input type="text" :placeholder="$t('add_member.placeholders.name')" />
                    </div>
                    <div class="form-group inline-group">
                        <label><span class="text-red">*</span>{{ $t('add_member.gender') }}</label>
                        <div class="radio-group">
                            <label><input type="radio" name="gender" value="male" checked /> {{ $t('common.man')
                                }}</label>
                            <label><input type="radio" name="gender" value="female" /> {{ $t('common.woman') }}</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>{{ $t('add_member.birthday') }}</label>
                        <input type="date" />
                    </div>
                    <div class="form-group">
                        <label>{{ $t('add_member.contact_person') }}</label>
                        <input type="text" :placeholder="$t('add_member.placeholders.contact')" />
                    </div>
                    <div class="form-group">
                        <label><span class="text-red">*</span>{{ $t('add_member.phone_code') }}</label>
                        <select>
                            <option>{{ $t('add_member.placeholders.phone_code') }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>{{ $t('add_member.phone') }}</label>
                        <input type="text" :placeholder="$t('add_member.placeholders.phone')" />
                    </div>
                    <div class="form-group">
                        <label>{{ $t('add_member.address') }}</label>
                        <input type="text" :placeholder="$t('add_member.placeholders.address')" />
                    </div>
                </div>

                <div class="form-section">
                    <h3>{{ $t('add_member.health_info') }}</h3>
                    <div class="form-group with-unit">
                        <label>{{ $t('add_member.height') }}</label>
                        <div class="input-wrapper">
                            <input type="number" :placeholder="$t('add_member.placeholders.height')" />
                            <span class="unit">cm</span>
                        </div>
                    </div>
                    <div class="form-group with-unit">
                        <label>{{ $t('add_member.weight') }}</label>
                        <div class="input-wrapper">
                            <input type="number" :placeholder="$t('add_member.placeholders.weight')" />
                            <span class="unit">kg</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>{{ $t('add_member.sbp') }}</label>
                        <input type="number" :placeholder="$t('add_member.placeholders.sbp')" />
                    </div>
                    <div class="form-group">
                        <label>{{ $t('add_member.dbp') }}</label>
                        <input type="number" :placeholder="$t('add_member.placeholders.dbp')" />
                    </div>
                    <div class="form-group">
                        <label><span class="text-red">*</span>{{ $t('add_member.health_status') }}</label>
                        <select>
                            <option>{{ $t('add_member.placeholders.health_status') }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>{{ $t('add_member.patient_level') }}</label>
                        <select>
                            <option>{{ $t('add_member.placeholders.patient_level') }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><span class="text-red">*</span>{{ $t('add_member.disability_level') }}</label>
                        <select>
                            <option>{{ $t('add_member.placeholders.disability_level') }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><span class="text-red">*</span>{{ $t('add_member.care_level') }}</label>
                        <select>
                            <option>{{ $t('add_member.placeholders.care_level') }}</option>
                        </select>
                    </div>
                </div>

                <div class="form-section">
                    <h3>{{ $t('add_member.account_info') }}</h3>
                    <div class="form-group">
                        <label><span class="text-red">*</span>{{ $t('add_member.email') }}</label>
                        <input type="email" :placeholder="$t('add_member.placeholders.email')" />
                    </div>
                    <div class="form-group">
                        <label><span class="text-red">*</span>{{ $t('add_member.password') }}</label>
                        <input type="password" :placeholder="$t('add_member.placeholders.password')" />
                    </div>
                    <div class="form-group">
                        <label><span class="text-red">*</span>{{ $t('add_member.organization') }}</label>
                        <select>
                            <option>{{ $t('add_member.placeholders.organization') }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>{{ $t('add_member.source_mac') }}</label>
                        <input type="text" :placeholder="$t('add_member.placeholders.mac')" />
                    </div>
                    <div class="form-group textarea-group">
                        <label>{{ $t('add_member.remark') }}</label>
                        <textarea :placeholder="$t('add_member.placeholders.remark')"></textarea>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-primary" @click="closeModal">{{ $t('common.confirm') }}</button>
                <button class="btn-default" @click="closeModal">{{ $t('common.cancel') }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    isOpen: Boolean
})
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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    background: white;
    border-radius: 12px;
    padding: 24px 32px;
    position: relative;
    max-width: 1000px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    border: none;
    background: transparent;
    font-size: 20px;
    cursor: pointer;
}

.modal-title {
    margin-top: 0;
    margin-bottom: 24px;
    font-size: 20px;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 32px;
}

.form-section h3 {
    font-size: 16px;
    margin-bottom: 16px;
    text-align: center;
}

.form-group {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.form-group label {
    width: 80px;
    text-align: right;
    margin-right: 12px;
    font-size: 14px;
    color: #333;
    flex-shrink: 0;
}

.text-red {
    color: red;
    margin-right: 2px;
}

.form-group input:not([type="radio"]),
.form-group select,
.form-group textarea {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.avatar-group {
    align-items: flex-start;
}

.avatar-upload {
    width: 100px;
    height: 100px;
    border: 1px dashed #ccc;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #999;
    cursor: pointer;
}

.radio-group {
    display: flex;
    gap: 16px;
}

.with-unit .input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex: 1;
}

.with-unit input {
    border: none !important;
    flex: 1;
    outline: none;
}

.with-unit .unit {
    padding: 0 10px;
    background: #f5f5f5;
    border-left: 1px solid #ccc;
    font-size: 14px;
    color: #666;
    height: 100%;
    display: flex;
    align-items: center;
}

.textarea-group {
    align-items: flex-start;
}

.textarea-group textarea {
    height: 100px;
    resize: none;
}

.modal-footer {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    gap: 16px;
}

.btn-primary {
    background: #2f5a70;
    color: white;
    border: none;
    padding: 8px 32px;
    border-radius: 20px;
    cursor: pointer;
}

.btn-default {
    background: white;
    color: #333;
    border: 1px solid #ccc;
    padding: 8px 32px;
    border-radius: 20px;
    cursor: pointer;
}
</style>