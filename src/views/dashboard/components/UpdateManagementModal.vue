<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content file-modal">
            <button class="close-btn" @click="closeModal">✕</button>
            <h2 class="modal-title">{{ $t('file_manage.title') }}</h2>

            <div class="user-select-bar">
                <span>{{ $t('file_manage.search_user') }}</span>
                <input type="text" :placeholder="$t('file_manage.search_placeholder')" />
                <button class="btn-select">{{ $t('common.select') }}</button>
            </div>

            <div class="table-container">
                <table class="medical-table">
                    <tbody>
                        <tr>
                            <td class="header-cell">{{ $t('file_manage.table.name') }}</td>
                            <td><input type="text" class="w-full" /></td>
                            <td class="header-cell">{{ $t('file_manage.table.gender') }}</td>
                            <td>
                                <label><input type="radio" name="fgender" /> {{ $t('common.man') }}</label>
                                <label class="ml-2"><input type="radio" name="fgender" /> {{ $t('common.woman')
                                }}</label>
                            </td>
                            <td class="header-cell">{{ $t('file_manage.table.birthday') }}</td>
                            <td colspan="3"><input type="date" class="w-full" /></td>
                        </tr>
                        <tr>
                            <td class="header-cell">{{ $t('file_manage.table.id_card') }}</td>
                            <td><input type="text" class="w-full" /></td>
                            <td class="header-cell">{{ $t('file_manage.table.address') }}</td>
                            <td colspan="5"><input type="text" class="w-full" /></td>
                        </tr>
                        <tr>
                            <td class="header-cell">{{ $t('file_manage.table.home_phone') }}</td>
                            <td><input type="text" class="w-full" /></td>
                            <td class="header-cell">{{ $t('file_manage.table.emergency_contact') }}</td>
                            <td><input type="text" class="w-full" /></td>
                            <td class="header-cell">{{ $t('file_manage.table.emergency_phone') }}</td>
                            <td colspan="3"><input type="text" class="w-full" /></td>
                        </tr>
                        <tr>
                            <td class="header-cell">{{ $t('file_manage.table.drug_allergy') }}</td>
                            <td colspan="7">
                                <label><input type="radio" name="allergy" /> {{ $t('common.none') }}</label>
                                <label class="ml-4"><input type="radio" name="allergy" /> {{ $t('common.yes')
                                }}：</label>
                                <label class="ml-2 text-gray"><input type="checkbox" disabled /> {{
                                    $t('file_manage.options.penicillin') }}</label>
                                <label class="ml-2 text-gray"><input type="checkbox" disabled /> {{
                                    $t('file_manage.options.sulfonamide') }}</label>
                                <label class="ml-2 text-gray"><input type="checkbox" disabled /> {{
                                    $t('file_manage.options.streptomycin') }}</label>
                                <label class="ml-2 text-gray"><input type="checkbox" disabled /> {{
                                    $t('file_manage.options.other') }}</label>
                            </td>
                        </tr>
                        <tr>
                            <td class="header-cell">{{ $t('file_manage.table.exposure') }}</td>
                            <td colspan="7">
                                <label><input type="radio" name="exposure" /> {{ $t('common.none') }}</label>
                                <label class="ml-4"><input type="radio" name="exposure" /> {{ $t('common.yes')
                                }}：</label>
                                <label class="ml-2 text-gray"><input type="checkbox" disabled /> {{
                                    $t('file_manage.options.chemical') }}</label>
                                <label class="ml-2 text-gray"><input type="checkbox" disabled /> {{
                                    $t('file_manage.options.poison') }}</label>
                                <label class="ml-2 text-gray"><input type="checkbox" disabled /> {{
                                    $t('file_manage.options.radiation') }}</label>
                            </td>
                        </tr>

                        <tr>
                            <td class="header-cell" rowspan="3">{{ $t('file_manage.table.general') }}</td>
                            <td class="sub-header">{{ $t('file_manage.table.temp') }}</td>
                            <td>
                                <div class="flex-center"><input type="text" class="w-half" /> °C</div>
                            </td>
                            <td class="sub-header">{{ $t('file_manage.table.pulse') }}</td>
                            <td colspan="4">
                                <div class="flex-end"><input type="text" class="w-half" /> {{
                                    $t('file_manage.table.pulse_unit') }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td class="sub-header">{{ $t('file_manage.table.fbg') }}</td>
                            <td>
                                <div class="flex-center"><input type="text" class="w-half" /> mg/dL</div>
                            </td>
                            <td class="sub-header">{{ $t('file_manage.table.hand_bp') }}</td>
                            <td colspan="4">
                                <label><input type="radio" name="hand" /> {{ $t('file_manage.table.left_hand')
                                }}</label>
                                <label class="ml-2"><input type="radio" name="hand" /> {{
                                    $t('file_manage.table.right_hand') }}</label>
                                <span class="ml-4">{{ $t('file_manage.table.bp_format') }} <input type="text"
                                        class="w-20 ml-2" /> mmHg</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="sub-header">{{ $t('file_manage.table.height') }}</td>
                            <td>
                                <div class="flex-center"><input type="text" class="w-half" /> CM</div>
                            </td>
                            <td class="sub-header">{{ $t('file_manage.table.weight') }}</td>
                            <td colspan="4">
                                <div class="flex-end"><input type="text" class="w-half" /> KG</div>
                            </td>
                        </tr>

                        <tr>
                            <td class="header-cell" rowspan="4">{{ $t('file_manage.table.past_history') }}</td>
                            <td class="sub-header" rowspan="1">{{ $t('file_manage.table.disease') }}</td>
                            <td colspan="6">
                                <div class="checkbox-grid mb-2">
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.hypertension')
                                    }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.diabetes') }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.chd') }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.tumor') }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.stroke') }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.schizophrenia')
                                    }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.hepatitis') }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.cervical_lumbar')
                                    }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.osteoarthritis')
                                    }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.infarction') }}</label>
                                    <label><input type="checkbox" /> {{ $t('common.other') }}</label>
                                </div>
                                <div class="date-grid text-gray">
                                    <span v-for="i in 6" :key="i"><input type="checkbox" disabled /> {{
                                        $t('file_manage.options.diagnose_time', { year: '____', month: '__' }) }}</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="sub-header">{{ $t('file_manage.table.surgery') }}</td>
                            <td colspan="6" class="history-rows">
                                <div class="flex-start"><label><input type="radio" name="surgery" /> {{
                                    $t('common.none') }}</label></div>
                                <div class="flex-start"><label><input type="radio" name="surgery" /> {{ $t('common.yes')
                                }}：</label>
                                    <div class="ml-2 flex-col">
                                        <span v-for="i in 3" :key="i">{{ i }}、{{ $t('file_manage.options.item_name') }}
                                            <input type="text" class="border-b" /> {{ $t('common.time') }} <input
                                                type="text" class="w-10 border-b" /> {{ $t('common.year') }} <input
                                                type="text" class="w-10 border-b" /> {{ $t('common.month') }}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="sub-header">{{ $t('file_manage.table.trauma') }}</td>
                            <td colspan="6" class="history-rows">
                                <div class="flex-start"><label><input type="radio" name="trauma" /> {{ $t('common.none')
                                }}</label></div>
                                <div class="flex-start"><label><input type="radio" name="trauma" /> {{ $t('common.yes')
                                }}：</label>
                                    <div class="ml-2 flex-col">
                                        <span v-for="i in 2" :key="i">{{ i }}、{{ $t('file_manage.options.item_name') }}
                                            <input type="text" class="border-b" /> {{ $t('common.time') }} <input
                                                type="text" class="w-10 border-b" /> {{ $t('common.year') }} <input
                                                type="text" class="w-10 border-b" /> {{ $t('common.month') }}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="sub-header">{{ $t('file_manage.table.blood_transfusion') }}</td>
                            <td colspan="6" class="history-rows">
                                <div class="flex-start"><label><input type="radio" name="blood" /> {{ $t('common.none')
                                }}</label></div>
                                <div class="flex-start"><label><input type="radio" name="blood" /> {{ $t('common.yes')
                                }}：</label>
                                    <div class="ml-2 flex-col">
                                        <span v-for="i in 2" :key="i">{{ i }}、{{ $t('file_manage.options.item_name') }}
                                            <input type="text" class="border-b" /> {{ $t('common.time') }} <input
                                                type="text" class="w-10 border-b" /> {{ $t('common.year') }} <input
                                                type="text" class="w-10 border-b" /> {{ $t('common.month') }}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td class="header-cell" rowspan="3">{{ $t('file_manage.table.family_history') }}</td>
                            <td class="sub-header">{{ $t('file_manage.table.father') }}</td>
                            <td colspan="2"><input type="text" class="w-full" /></td>
                            <td class="sub-header">{{ $t('file_manage.table.mother') }}</td>
                            <td colspan="3"><input type="text" class="w-full" /></td>
                        </tr>
                        <tr>
                            <td class="sub-header">{{ $t('file_manage.table.siblings') }}</td>
                            <td colspan="2"><input type="text" class="w-full" /></td>
                            <td class="sub-header">{{ $t('file_manage.table.children') }}</td>
                            <td colspan="3"><input type="text" class="w-full" /></td>
                        </tr>
                        <tr>
                            <td colspan="7">
                                <div class="checkbox-grid">
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.hypertension')
                                    }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.diabetes') }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.chd') }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.tumor') }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.allergy') }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.schizophrenia')
                                    }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.tuberculosis')
                                    }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.hepatitis') }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.stroke') }}</label>
                                    <label><input type="checkbox" /> {{ $t('file_manage.options.malformation')
                                    }}</label>
                                    <label><input type="checkbox" /> {{ $t('common.other') }}</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="header-cell">{{ $t('file_manage.table.hereditary') }}</td>
                            <td colspan="7">
                                <label><input type="radio" name="hered" /> {{ $t('common.none') }}</label>
                                <label class="ml-4"><input type="radio" name="hered" /> {{ $t('common.yes') }}</label>
                            </td>
                        </tr>
                        <tr>
                            <td class="header-cell">{{ $t('file_manage.table.disability') }}</td>
                            <td colspan="7">
                                <div class="mb-1">
                                    <label><input type="checkbox" /> {{ $t('common.none') }}</label>
                                    <label class="ml-4"><input type="checkbox" /> {{ $t('file_manage.options.hearing')
                                    }}</label>
                                    <label class="ml-4"><input type="checkbox" /> {{ $t('file_manage.options.speech')
                                    }}</label>
                                    <label class="ml-4"><input type="checkbox" /> {{ $t('file_manage.options.physical')
                                    }}</label>
                                    <label class="ml-4"><input type="checkbox" /> {{ $t('file_manage.options.visual')
                                    }}</label>
                                    <label class="ml-4"><input type="checkbox" /> {{ $t('file_manage.options.mental')
                                    }}</label>
                                    <label class="ml-4"><input type="checkbox" /> {{
                                        $t('file_manage.options.intellectual') }}</label>
                                </div>
                                <div>{{ $t('file_manage.table.disability_code') }} <input type="text"
                                        class="border-b" /></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="modal-footer">
                <button class="btn-primary" @click="closeModal">{{ $t('common.save') }}</button>
                <button class="btn-default" @click="closeModal">{{ $t('common.cancel') }}</button>
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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content.file-modal {
    background: white;
    border-radius: 12px;
    padding: 24px 32px;
    position: relative;
    max-width: 1100px;
    width: 95%;
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
    margin-bottom: 20px;
    font-size: 20px;
}

.user-select-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 12px;
}

.user-select-bar input {
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 200px;
}

.btn-select {
    background: #2f5a70;
    color: white;
    border: none;
    padding: 6px 20px;
    border-radius: 16px;
    cursor: pointer;
}

.table-container {
    border: 1px solid #ccc;
    overflow-x: auto;
}

.medical-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.medical-table td {
    border: 1px solid #ddd;
    padding: 10px;
    vertical-align: middle;
}

.header-cell,
.sub-header {
    background-color: #f7f9fa;
    text-align: center;
    font-weight: bold;
    width: 100px;
    color: #333;
}

.sub-header {
    font-weight: normal;
}

.w-full {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
}

.w-half {
    width: 60px;
    border: none;
    border-bottom: 1px solid #ccc;
    text-align: center;
    outline: none;
}

.w-10 {
    width: 40px;
    text-align: center;
}

.w-20 {
    width: 80px;
    text-align: center;
}

.border-b {
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
}

.ml-2 {
    margin-left: 8px;
}

.ml-4 {
    margin-left: 16px;
}

.mb-1 {
    margin-bottom: 4px;
}

.mb-2 {
    margin-bottom: 8px;
}

.text-gray {
    color: #aaa;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.flex-end {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
}

.flex-start {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;
}

.flex-col {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
}

.date-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 8px;
}

.modal-footer {
    margin-top: 24px;
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