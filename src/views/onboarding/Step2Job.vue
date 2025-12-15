<script setup>
import { onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useOnboardingStore } from '@/stores/onboarding.store'

// PrimeVue v4
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import { Message } from 'primevue'


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
        <h2 class="text-2xl font-medium mb-4">Job Details</h2>
        <div class="h-separator"></div>

        <form class="flex justify-center flex-col gap-4">
            <div class="field-row">

                <div class="flex flex-col gap-1">
                    <label class="label-field req">Department</label>
                    <Select v-model="department" :options="departmentOptions" optionLabel="label" optionValue="value"
                        placeholder="Select department" />
                    <Message v-if="errors.department" class="error-messsage" severity="error" size="small"
                        variant="simple">
                        {{ errors.department }}
                    </Message>
                </div>

                <div class="flex flex-col gap-1 w-100">
                    <label class="label-field req">Job Title</label>
                    <InputText v-model="job_title" />
                    <Message v-if="errors.job_title" class="error-messsage" severity="error" size="small"
                        variant="simple">
                        {{ errors.job_title }}
                    </Message>
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <label class="label-field req">Join Date</label>
                <DatePicker v-model="join_date" dateFormat="yy-mm-dd" showIcon />
                <Message v-if="errors.join_date" class="error-messsage" severity="error" size="small" variant="simple">
                    {{ errors.join_date }}
                </Message>
            </div>
            <div class="field-row">
                <div class="flex flex-col gap-1 w-fit">
                    <label class="label-field req">Work Arrangement</label>
                    <Select v-model="work_arrangement" :options="workArrangementOptions" optionLabel="label"
                        optionValue="value" placeholder="Select arrangement" />
                    <Message v-if="errors.work_arrangement" class="error-messsage" severity="error" size="small"
                        variant="simple">{{
                            errors.work_arrangement }}</Message>
                </div>

                <div class="flex flex-col gap-1 w-fit">
                    <label class="label-field req">Device Request</label>
                    <Select v-model="device_request" :options="deviceOptions" optionLabel="label" optionValue="value"
                        placeholder="Select device" />
                    <Message v-if="errors.device_request" class="error-messsage" severity="error" size="small"
                        variant="simple">{{ errors.device_request
                        }}</Message>
                </div>
            </div>

        </form>
    </section>
</template>
