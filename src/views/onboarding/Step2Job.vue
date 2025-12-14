<script setup>
import { onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useOnboardingStore } from '@/stores/onboarding.store'

// PrimeVue v4
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'

// =======================
// 1️⃣ Schema
// =======================
const schema = yup.object({
    department: yup.string().required('Department wajib diisi'),
    job_title: yup.string().required('Job title wajib diisi'),
    join_date: yup.date().required('Join date wajib diisi'),
    work_arrangement: yup.string().required(),
    device_request: yup.string().required(),
})

// =======================
// 2️⃣ Form
// =======================
const { validate, setValues, values, errors } = useForm({
    validationSchema: schema,
    validateOnMount: false,
})

const { value: department } = useField('department')
const { value: job_title } = useField('job_title')
const { value: join_date } = useField('join_date')
const { value: work_arrangement } = useField('work_arrangement')
const { value: device_request } = useField('device_request')

const store = useOnboardingStore()

// =======================
// 3️⃣ Options
// =======================
const departmentOptions = [
    { label: 'IT', value: 'IT' },
    { label: 'HR', value: 'HR' },
]

const workArrangementOptions = [
    { label: 'WFO', value: 'WFO' },
    { label: 'Remote', value: 'Remote' },
    { label: 'Hybrid', value: 'Hybrid' },
]

const deviceOptions = [
    { label: 'MacBook', value: 'MacBook' },
    { label: 'Laptop', value: 'Laptop' },
]

// =======================
// 4️⃣ Load draft (FIX DATE)
// =======================
onMounted(() => {
    if (!store.onboarding?.job_details) return

    const draft = { ...store.onboarding.job_details }

    // 🔥 FIX UTAMA
    if (draft.join_date) {
        draft.join_date = new Date(draft.join_date)
    }

    setValues(draft)
})

// =======================
// 5️⃣ Contract ke Wizard
// =======================
defineExpose({
    async validateStep() {
        const result = await validate()
        return result.valid
    },
    getValues() {
        return values
    },
    hasValue() {
        return Object.values(values).some(
            (v) => v !== null && v !== '' && v !== undefined
        )
    },
})
</script>


<template>
    <section>
        <h2>Step 2 - Job Details</h2>

        <form class="p-fluid">
            <div>
                <label>Department</label>
                <Select v-model="department" :options="departmentOptions" optionLabel="label" optionValue="value"
                    placeholder="Select department" />
                <small class="p-error">{{ errors.department }}</small>
            </div>

            <div>
                <label>Job Title</label>
                <InputText v-model="job_title" />
                <small class="p-error">{{ errors.job_title }}</small>
            </div>

            <div>
                <label>Join Date</label>
                <DatePicker v-model="join_date" dateFormat="yy-mm-dd" showIcon />
                <small class="p-error">{{ errors.join_date }}</small>
            </div>

            <div>
                <label>Work Arrangement</label>
                <Select v-model="work_arrangement" :options="workArrangementOptions" optionLabel="label"
                    optionValue="value" placeholder="Select arrangement" />
                <small class="p-error">{{ errors.work_arrangement }}</small>
            </div>

            <div>
                <label>Device Request</label>
                <Select v-model="device_request" :options="deviceOptions" optionLabel="label" optionValue="value"
                    placeholder="Select device" />
                <small class="p-error">{{ errors.device_request }}</small>
            </div>
        </form>
    </section>
</template>
