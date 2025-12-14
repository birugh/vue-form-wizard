<script setup>
import { onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useOnboardingStore } from '@/stores/onboarding.store'

// =======================
// 1️⃣ Schema (khusus step 2)
// =======================
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

const { value: department } = useField('department')
const { value: job_title } = useField('job_title')
const { value: join_date } = useField('join_date')
const { value: work_arrangement } = useField('work_arrangement')
const { value: device_request } = useField('device_request')

const store = useOnboardingStore()

// =======================
// 3️⃣ Load existing draft
// =======================
onMounted(() => {
    if (!store.onboarding?.job_details) return
    setValues(store.onboarding.job_details)
})

// =======================
// 4️⃣ Expose contract ke Wizard
// =======================
defineExpose({
    async validateStep() {
        const result = await validate()
        return result.valid
    },
    getValues() {
        return values
    },
})
</script>

<template>
    <section>
        <h2>Step 2 - Job Details</h2>

        <form>
            <div>
                <label>Department</label>
                <label>Department</label>
                <select v-model="department">
                    <option value="">Select</option>
                    <option>IT</option>
                    <option>HR</option>
                </select>
                <span>{{ errors.department }}</span>
            </div>

            <div>
                <label>Job Title</label>
                <input type="text" v-model="job_title" />
                <span>{{ errors.job_title }}</span>
            </div>

            <div>
                <label>Join Date</label>
                <input type="date" v-model="join_date" />
                <span>{{ errors.join_date }}</span>
            </div>

            <div>
                <label>Work Arrangement</label>
                <select v-model="work_arrangement">
                    <option value="">-- pilih --</option>
                    <option value="WFO">WFO</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                </select>
                <span>{{ errors.work_arrangement }}</span>
            </div>

            <div>
                <label>Device Request</label>
                <select v-model="device_request">
                    <option value="">-- pilih --</option>
                    <option value="MacBook">MacBook</option>
                    <option value="Laptop">Laptop</option>
                </select>
                <span>{{ errors.device_request }}</span>
            </div>
        </form>
    </section>
</template>
