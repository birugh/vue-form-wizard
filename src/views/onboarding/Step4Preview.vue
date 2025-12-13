<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { getOnboarding, submitOnboarding } from '@/api/onboarding.api'

const router = useRouter()
const store = useOnboardingStore()

const onboarding = ref(null)
const isLoading = ref(false)
const isSubmitting = ref(false)

if (!store.onboardingId) {
    router.push('/onboarding/step-1')
}

async function fetchOnboarding() {
    try {
        isLoading.value = true
        const result = await getOnboarding(store.onboardingId)
        onboarding.value = result.data.data
        console.log(onboarding.value);

    } catch (err) {
        console.error(err)
    } finally {
        isLoading.value = false
    }
}

async function submitFinal() {
    try {
        isSubmitting.value = true
        await submitOnboarding(store.onboardingId)

        localStorage.removeItem('onboarding_id')
        store.onboardingId = null

        alert('Onboarding submitted successfully')
        router.push('/dashboard')
    } catch (err) {
        console.error(err)
        alert('Submit failed. Please complete all steps.')
    } finally {
        isSubmitting.value = false
    }
}

function goBack() {
    router.push('/onboarding/step-3')
}

onMounted(() => {
    fetchOnboarding()
})


</script>

<template>
    <section>
        <h2>Step 4 - Preview & Confirmation</h2>

        <p>Please review all information before submitting.</p>

        <div v-if="isLoading">
            <p>Loading preview...</p>
        </div>

        <div v-else-if="onboarding">
            <!-- STEP 1 -->
            <section>
                <h3>Personal Information</h3>
                <p>Name: {{ onboarding.personal_information?.name }}</p>
                <p>Email: {{ onboarding.personal_information?.email }}</p>
                <p>Phone: {{ onboarding.personal_information?.phone }}</p>
                <p>Emergency Contact: {{ onboarding.personal_information?.emergency_contact }}</p>
            </section>

            <!-- STEP 2 -->
            <section>
                <h3>Job Details</h3>
                <p>Department: {{ onboarding.job_details?.department }}</p>
                <p>Job Title: {{ onboarding.job_details?.job_title }}</p>
                <p>Join Date: {{ onboarding.job_details?.join_date }}</p>
                <p>Work Arrangement: {{ onboarding.job_details?.work_arrangement }}</p>
                <p>Device Request: {{ onboarding.job_details?.device_request }}</p>
            </section>

            <!-- STEP 3 -->
            <section>
                <h3>Access Rights</h3>

                <p>Communication Tools:</p>
                <ul>
                    <li v-for="(item, index) in onboarding.access_rights?.communication_tools" :key="index">
                        {{ item }}
                    </li>
                </ul>

                <p>Technical Tools:</p>
                <ul>
                    <li v-for="(item, index) in onboarding.access_rights?.technical_tools" :key="index">
                        {{ item }}
                    </li>
                </ul>

                <p>Access Level: {{ onboarding.access_rights?.access_level }}</p>

                <p>Specific Zones:</p>
                <ul>
                    <li v-for="(zone, index) in onboarding.access_rights?.specific_zones" :key="index">
                        {{ zone }}
                    </li>
                </ul>
            </section>

            <!-- EVIDENCE -->
            <section>
                <h3>Evidence Files</h3>
                <ul>
                    <li v-for="(file, index) in onboarding.access_rights.evidences" :key="index">
                        {{ file.original_name }}
                    </li>
                </ul>
            </section>
        </div>

        <!-- ACTIONS -->
        <div>
            <button type="button" @click="goBack">
                Back
            </button>

            <button type="button" @click="submitFinal" :disabled="isSubmitting">
                Submit
            </button>
        </div>
    </section>
</template>
