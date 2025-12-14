<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { submitOnboarding } from '@/api/onboarding.api'

const router = useRouter()
const store = useOnboardingStore()

const isSubmitting = ref(false)

// 1️⃣ Read-only onboarding data
const onboarding = computed(() => store.onboarding)

// 2️⃣ Submit final
const submitFinal = async () => {
    if (!onboarding.value?.id) return

    try {
        isSubmitting.value = true
        await submitOnboarding(onboarding.value.id)

        // reset feature store
        store.clear()

        router.push('/dashboard')
    } catch (err) {
        console.error(err)
        alert('Submit failed. Please complete all steps.')
    } finally {
        isSubmitting.value = false
    }
}

// 3️⃣ Navigation
const goBack = () => {
    router.push('/onboarding/step-3')
}
</script>

<template>
    <section>
        <h2>Step 4 - Preview & Confirmation</h2>
        <p>Please review all information before submitting.</p>

            <div v-if="!onboarding">
      <p>Loading preview...</p>
    </div>

    <div v-else>
      <PreviewPersonal :data="onboarding.personal_information" />
      <PreviewJob :data="onboarding.job_details" />
      <PreviewAccess :data="onboarding.access_rights" />
      <PreviewEvidence :files="onboarding.access_rights?.evidences || []" />
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
