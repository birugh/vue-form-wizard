<script setup>
import { onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { updateStep2 } from '@/api/onboarding.api'
// import { debounce } from '@/utils/debounce'
import { loadOnboardingData } from '@/utils/loadOnboarding'

const router = useRouter()
const store = useOnboardingStore()

if (!store.onboardingId) {
    router.push('/onboarding/step-1')
}

// === FORM STATE ===
const form = reactive({
    department: '',
    job_title: '',
    join_date: '',
    work_arrangement: '',
    device_request: '',
})

// watch(form, () =>
//     console.log(form)
// );

async function saveDraft() {
    if (!store.onboardingId) return
    try {
        await updateStep2(store.onboardingId, form || {})
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
async function goNext() {
    await saveDraft()
    router.push('/onboarding/step-3')
}

async function goBack() {
    await saveDraft()
    router.push('/onboarding/step-1')
}

onMounted(async () => {
    try {
        const onboarding = await loadOnboardingData(store.onboardingId)

        if (onboarding.job_details) {
            Object.assign(form, onboarding.job_details)
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
                <select v-model="form.department">
                    <option value="">Select</option>
                    <option>IT</option>
                    <option>HR</option>
                </select>
            </div>

            <div>
                <label>Job Title</label>
                <input type="text" v-model="form.job_title" />
            </div>

            <div>
                <label>Join Date</label>
                <input type="date" v-model="form.join_date" />
            </div>

            <div>
                <label>Work Arrangement</label>
                <select v-model="form.work_arrangement">
                    <option value="">Select</option>
                    <option>WFO</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                </select>
            </div>

            <div>
                <label>Device Request</label>
                <select v-model="form.device_request">
                    <option value="">Select</option>
                    <option>MacBook</option>
                    <option>Laptop</option>
                </select>
            </div>
        </form>

        <div>
            <button type="button" @click="goBack">Back</button>
            <button type="button" @click="saveDraft">Save Draft</button>
            <button type="button" @click="goNext">Next</button>
        </div>
    </section>
</template>
