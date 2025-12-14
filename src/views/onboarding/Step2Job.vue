<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

import { useOnboardingStore } from '@/stores/onboarding.store'
import { updateStep2 } from '@/api/onboarding.api'

const router = useRouter()
const store = useOnboardingStore()

// 1️⃣ Schema
const schema = yup.object({
    department: yup.string().required('Department wajib diisi'),
    job_title: yup.string().required('Job title wajib diisi'),
    join_date: yup.date().required('Join date wajib diisi'),
    work_arrangement: yup
        .string()
        .oneOf(['WFO', 'Remote', 'Hybrid'])
        .required('Work arrangement wajib diisi'),
    device_request: yup
        .string()
        .oneOf(['MacBook', 'Laptop'])
        .required('Device request wajib diisi'),
})

// 2️⃣ Form
const { handleSubmit, setValues, errors } = useForm({
    validationSchema: schema,
    validateOnMount: false,
})

const { value: department } = useField('department')
const { value: job_title } = useField('job_title')
const { value: join_date } = useField('join_date')
const { value: work_arrangement } = useField('work_arrangement')
const { value: device_request } = useField('device_request')

// 3️⃣ Submit
const submit = handleSubmit(async (values) => {
    // 1️⃣ UPDATE backend
    await updateStep2(store.onboarding.id, values)

    // 2️⃣ FETCH ulang ke store
    await store.fetchOnboarding(store.onboarding.id)

    // 3️⃣ NEXT
    router.push('/onboarding/step-3')
})

const goBack = () => {
    router.push('/onboarding/step-1')
}

// 4️⃣ Load existing draft (edit case)
onMounted(() => {
    if (!store.onboarding?.job_details) return

    setValues(store.onboarding.job_details)
})
</script>

<template>
    <section>
        <h2>Step 2 - Job Details</h2>

        <form>
            <div>
                <label>Department</label>
                <select v-model="department">
                    <option value="">Select</option>
                    <option>IT</option>
                    <option>HR</option>
                </select>
                <span class="error-message">{{ errors.department }}</span>
            </div>

            <div>
                <label>Job Title</label>
                <input type="text" v-model="job_title" />
                <span class="error-message">{{ errors.job_title }}</span>
            </div>

            <div>
                <label>Join Date</label>
                <input type="date" v-model="join_date" />
                <span class="error-message">{{ errors.join_date }}</span>
            </div>

            <div>
                <label>Work Arrangement</label>
                <select v-model="work_arrangement">
                    <option value="">Select</option>
                    <option>WFO</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                </select>
                <span class="error-message">{{ errors.work_arrangement }}</span>
            </div>

            <div>
                <label>Device Request</label>
                <select v-model="device_request">
                    <option value="">Select</option>
                    <option>MacBook</option>
                    <option>Laptop</option>
                </select>
                <span class="error-message">{{ errors.device_request }}</span>
            </div>
        </form>

        <div>
            <button type="button" @click="goBack">
                Back
            </button>
            <button type="button" @click="submit">
                Next
            </button>
        </div>
    </section>
</template>
