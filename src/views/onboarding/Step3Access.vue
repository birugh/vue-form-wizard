<script setup>
import { onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

import { useOnboardingStore } from '@/stores/onboarding.store'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'
import FileUpload from 'primevue/fileupload'

// =======================
// 1️⃣ Schema
// =======================
const schema = yup.object({
    communication_tools: yup
        .array()
        .of(yup.string())
        .min(1, 'Pilih minimal 1 communication tool'),

    technical_tools: yup
        .array()
        .of(yup.string())
        .min(1, 'Pilih minimal 1 technical tool'),

    access_level: yup
        .string()
        .required('Access level wajib dipilih'),

    specific_zones: yup
        .array()
        .of(yup.string())
        .min(1, 'Pilih minimal 1 zone'),

    evidences: yup
        .array()
        .min(1, 'Minimal upload 1 file'),
})

// =======================
// 2️⃣ Form
// =======================
const {
    validate,
    setValues,
    values,
    errors,
} = useForm({
    validationSchema: schema,
    validateOnMount: false,
})

const { value: communication_tools } = useField('communication_tools', undefined, {
    initialValue: [],
})

const { value: technical_tools } = useField('technical_tools', undefined, {
    initialValue: [],
})

const { value: access_level } = useField('access_level')

const { value: specific_zones } = useField('specific_zones', undefined, {
    initialValue: [],
})

const { value: evidences } = useField('evidences', undefined, {
    initialValue: [],
})

const store = useOnboardingStore()

// =======================
// 3️⃣ File Upload handlers
// =======================
const onFileSelect = (event) => {
    evidences.value = event.files
}

const onFileRemove = () => {
    evidences.value = evidences.value.filter(file => file.size > 0)
}

// =======================
// 4️⃣ Load existing draft
// =======================
onMounted(() => {
    if (!store.onboarding?.access_rights) return
    setValues(store.onboarding.access_rights)
})

// =======================
// 5️⃣ BUILD PAYLOAD (FormData)
// =======================
const buildPayload = () => {
    const formData = new FormData()

    values.communication_tools.forEach(item =>
        formData.append('communication_tools[]', item)
    )

    values.technical_tools.forEach(item =>
        formData.append('technical_tools[]', item)
    )

    formData.append('access_level', values.access_level)

    values.specific_zones.forEach(item =>
        formData.append('specific_zones[]', item)
    )

    evidences.value.forEach(file => {
        formData.append('evidences[]', file)
    })

    return formData
}

// =======================
// 6️⃣ EXPOSE CONTRACT KE WIZARD
// =======================
defineExpose({
    async validateStep() {
        const result = await validate()
        return result.valid
    },
    getPayload() {
        return buildPayload()
    },
})
</script>

<template>
    <section>
        <h2>Step 3 - Access Rights & Evidence</h2>

        <form>
            <fieldset>
                <legend>System Access</legend>

                <label>Communication Tools</label>
                <Multiselect v-model="communication_tools" mode="tags" :options="['Slack', 'Email']" />
                <span>{{ errors.communication_tools }}</span>

                <label>Technical Tools</label>
                <Multiselect v-model="technical_tools" mode="tags" :options="['GitHub', 'Postman']" />
                <span>{{ errors.technical_tools }}</span>
            </fieldset>

            <fieldset>
                <legend>Facility Access</legend>

                <label>Access Level</label>
                <select v-model="access_level">
                    <option value="">Select</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
                <span>{{ errors.access_level }}</span>

                <label>Specific Zones</label>
                <Multiselect v-model="specific_zones" mode="tags" :options="['Office', 'Server Room', 'Warehouse']" />
                <span>{{ errors.specific_zones }}</span>
            </fieldset>

            <div>
                <label>Upload Evidence</label>
                <FileUpload mode="advanced" customUpload multiple accept="image/*,application/pdf"
                    :maxFileSize="5000000" @select="onFileSelect" @remove="onFileRemove" />
                <span>{{ errors.evidences }}</span>
            </div>
        </form>
    </section>
</template>
