<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.store'
import WizardSteps from './WizardSteps.vue'
import { useToast } from 'primevue/usetoast'
import { onBeforeRouteLeave } from 'vue-router'

import {
  createDraft,
  submitOnboarding,
  updateStep1,
  updateStep2,
  updateStep3,
} from '@/api/onboarding.api'

const toast = useToast()
const showError = (err) => {
  const message =
    err?.response?.data?.message ||
    'Something went wrong. Please try again.'

  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: message,
    life: 4000,
  })
}
// =======================
// SETUP DASAR
// =======================
const route = useRoute()
const router = useRouter()
const store = useOnboardingStore()
const isProcessing = ref(false)

const stepRef = ref(null)

// =======================
// STEP CONFIG (SOURCE OF TRUTH)
// =======================
const steps = [
  {
    step: 1,
    label: 'Personal Information',
    path: '/onboarding/step-1',
    key: null,
    submit: async (values) => {
      let onboardingId = store.onboarding?.id

      if (!onboardingId) {
        const res = await createDraft(values)
        onboardingId = res.data.data.id
      } else {
        await updateStep1(onboardingId, values)
      }

      await store.fetchOnboarding(onboardingId)
    },
  },
  {
    step: 2,
    label: 'Job Details',
    path: '/onboarding/step-2',
    key: 'personal_information',
    submit: async (values) => {
      await updateStep2(store.onboarding.id, values)
      await store.fetchOnboarding(store.onboarding.id)
    },
  },
  {
    step: 3,
    label: 'Access Rights & Evidence',
    path: '/onboarding/step-3',
    key: 'job_details',
    submit: async (payload) => {
      await updateStep3(store.onboarding.id, payload)
      await store.fetchOnboarding(store.onboarding.id)
    },
  },
  {
    step: 4,
    label: 'Preview & Confirmation',
    path: '/onboarding/preview',
    key: 'access_rights',
    submit: async () => {
      await submitOnboarding(store.onboarding.id)

      // reset store setelah submit final
      store.clear()
    },
  },
]

const getStepPayload = () => {
  if (!stepRef.value) return null

  if (stepRef.value.getPayload) {
    return stepRef.value.getPayload()
  }

  if (stepRef.value.getValues) {
    return stepRef.value.getValues()
  }

  return null
}

// =======================
// CURRENT STEP
// =======================
const currentStep = computed(() =>
  steps.find(s => s.path === route.path)
)

const currentIndex = computed(() =>
  steps.findIndex(s => s.path === route.path)
)

// =======================
// ACTIONS
// =======================
const goNext = async () => {
  if (isProcessing.value) return
  isProcessing.value = true

  try {
    if (stepRef.value?.validateStep) {
      const valid = await stepRef.value.validateStep()
      if (!valid) return
    }

    if (currentStep.value.submit) {
      const payload = stepRef.value.getPayload
        ? stepRef.value.getPayload()
        : stepRef.value.getValues?.()

      await currentStep.value.submit(payload)
    }

    const nextStep = steps[currentIndex.value + 1]
    if (!nextStep) {
      router.push('/dashboard')
    } else {
      router.push(nextStep.path)
    }
  } catch (err) {
    showError(err)
  } finally {
    isProcessing.value = false
  }
}



const goBack = () => {
  const prevStep = steps[currentIndex.value - 1]
  if (prevStep) {
    router.push(prevStep.path)
  }
}

const saveDraft = async () => {
  if (isProcessing.value) return
  isProcessing.value = true

  try {
    if (!store.onboarding?.id && currentIndex.value !== 0) {
      toast.add({
        severity: 'warn',
        summary: 'Draft not allowed',
        detail: 'Please complete Step 1 first',
        life: 3000,
      })
      return
    }

    if (currentIndex.value === 0) {
      const valid = await stepRef.value.validateStep()
      if (!valid) return
    }

    const payload = getStepPayload()
    if (currentStep.value.submit && payload) {
      await currentStep.value.submit(payload)
    }

    toast.add({
      severity: 'success',
      summary: 'Draft saved',
      detail: 'Your progress has been saved',
      life: 2500,
    })
  } catch (err) {
    showError(err)
  } finally {
    isProcessing.value = false
  }
}


// =======================
// INIT LOAD (EDIT CASE)
// =======================
onMounted(async () => {
  if (store.onboarding?.id) return
  if (!route.query.onboarding_id) return

  await store.fetchOnboarding(route.query.onboarding_id)
})

// =======================
// STEP ENABLE STATUS
// =======================
const resolvedSteps = computed(() => {
  if (!store.onboarding) return []

  return steps.map(step => ({
    ...step,
    enabled: step.key === null
      ? true
      : store.onboarding[step.key] !== null,
  }))
})

onBeforeRouteLeave(() => {
  if (isProcessing.value) return false
})
</script>

<template>
  <div>
    <header>
      <h1>Employee Onboarding Wizard</h1>
    </header>

    <WizardSteps :steps="resolvedSteps" />

    <main>
      <router-view v-slot="{ Component }">
        <component :is="Component" ref="stepRef" />
      </router-view>
    </main>

    <!-- 🔥 BUTTON DI PARENT -->
    <footer>
      <button type="button" @click="goBack" :disabled="isProcessing || currentIndex === 0">
        Back
      </button>

      <button type="button" @click="saveDraft" :disabled="isProcessing">
        Save as Draft
      </button>

      <button v-if="currentIndex < steps.length - 1" type="button" @click="goNext" :disabled="isProcessing">
        Next
      </button>

      <button v-else type="button" @click="goNext" :disabled="isProcessing">
        Submit
      </button>
    </footer>

  </div>
</template>
