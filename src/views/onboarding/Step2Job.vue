<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { updateStep2 } from '@/api/onboarding.api'
import { loadOnboardingData } from '@/utils/loadOnboarding'

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const router = useRouter()
const store = useOnboardingStore()

if (!store.onboardingId) {
    router.push('/onboarding/step-1')
}

const step2Schema = yup.object({
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

const {
    handleSubmit,
    setValues,
    values,
    errors,
} = useForm({
    validationSchema: step2Schema,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnInput: false,
})

const { value: department } = useField('department')
const { value: job_title } = useField('job_title')
const { value: join_date } = useField('join_date')
const { value: work_arrangement } = useField('work_arrangement')
const { value: device_request } = useField('device_request')


// === FORM STATE ===
// const form = reactive({
//     department: '',
//     job_title: '',
//     join_date: '',
//     work_arrangement: '',
//     device_request: '',
// })

// watch(form, () =>
//     console.log(form)
// );

async function saveDraft() {
    if (!store.onboardingId) return

    try {
        await updateStep2(store.onboardingId, values)
    } catch (err) {
        if (err.response) {
            console.error('Status:', err.response.status)
            console.error('Validation errors:', err.response.data)
        } else {
            console.error(err)
        }
    }
}

// const autoSave = debounce(() => {
//   saveDraft()
// }, 800)

// watch(form, () => {
//   autoSave()
// })

// onBeforeRouteLeave(() => {
//     saveDraft()
// })

// === NAVIGATION ===
const goNext = handleSubmit(async () => {
    await saveDraft()
    store.maxStepReached = Math.max(store.maxStepReached, 3)
    router.push('/onboarding/step-3')
})

const goBack = async () => {
    await saveDraft()
    router.push('/onboarding/step-1')
}

onMounted(async () => {
    try {
        if (store.onboardingId) return
        const onboarding = await loadOnboardingData(store.onboardingId)

        if (onboarding.job_details) {
            setValues(onboarding.job_details)
        }
    } catch (err) {
        console.log(err)
    }
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
            <button type="button" @click="goBack">Back</button>
            <button type="button" @click="saveDraft">Save Draft</button>
            <button type="button" @click="goNext">Next</button>
        </div>
    </section>
</template>
