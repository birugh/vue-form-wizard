// src/composables/useOnboardingWizard.js
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useToast } from 'primevue/usetoast'
import { confirmUnsavedChanges } from '@/utils/confirmUnsaved'
import { confirmFinalSubmit } from '@/utils/confirmSubmit'


import {
  createDraft,
  submitOnboarding,
  updateStep1,
  updateStep2,
  updateStep3,
} from '@/api/onboarding.api'

const isProcessing = ref({
  next: false,
  draft: false,
});

export function useOnboardingWizard() {

  const route = useRoute()
  const router = useRouter()
  const store = useOnboardingStore()
  const toast = useToast()

  // const isProcessing = ref(false)
  const stepRef = ref(null)


  const showError = (err) => {
    console.log(err);

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

        await store.fetch(onboardingId)
      },
    },
    {
      step: 2,
      label: 'Job Details',
      path: '/onboarding/step-2',
      key: 'personal_information',
      submit: async (values) => {
        await updateStep2(store.onboarding.id, values)
        await store.fetch(store.onboarding.id)
      },
    },
    {
      step: 3,
      label: 'Access Rights & Evidence',
      path: '/onboarding/step-3',
      key: 'job_details',
      submit: async (payload) => {
        await updateStep3(store.onboarding.id, payload)
        await store.fetch(store.onboarding.id)
      },
    },
    {
      step: 4,
      label: 'Preview & Confirmation',
      path: '/onboarding/preview',
      key: 'access_rights',
      submit: async () => {
        await submitOnboarding(store.onboarding.id)
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

  const currentStep = computed(() =>
    steps.find(s => s.path === route.path)
  )

  const currentIndex = computed(() =>
    steps.findIndex(s => s.path === route.path)
  )

  // const goNext = async () => {
  //     if (isProcessing.value) return
  //     isProcessing.value = true

  //     try {
  //         if (stepRef.value?.validateStep) {
  //             const valid = await stepRef.value.validateStep()
  //             if (!valid) return
  //         }

  //         if (currentStep.value?.submit) {
  // const confirmed = await confirmFinalSubmit()
  // if (!confirmed) return
  //             const payload = getStepPayload()
  //             await currentStep.value.submit(payload)
  //         }

  //         const nextStep = steps[currentIndex.value + 1]
  //         router.push(nextStep ? nextStep.path : '/onboardings')
  //     } catch (err) {
  //         showError(err)
  //     } finally {
  //         isProcessing.value = false
  //     }
  // }

  const goNext = async () => {
    if (isProcessing.value.next) return

    try {
      if (stepRef.value?.validateStep) {
        const valid = await stepRef.value.validateStep()
        if (!valid) return
      }
      isProcessing.value.next = true

      const index = currentIndex.value
      const nextStep = steps[index + 1]
      const isLastStep = index === steps.length - 1

      if (isLastStep && currentStep.value?.submit) {
        const confirmed = await confirmFinalSubmit()
        if (!confirmed) return
      }

      if (currentStep.value?.submit) {
        const payload = getStepPayload()
        await currentStep.value.submit(payload)
      }

      // const nextStep = steps[currentIndex.value + 1]
      router.push(nextStep ? nextStep.path : '/onboardings')
    } catch (err) {
      showError(err)
    } finally {
      isProcessing.value.next = false
    }
  }


  async function goBack() {
    const step = stepRef.value

    if (step?.hasValue?.()) {
      const confirmed = await confirmUnsavedChanges()
      if (!confirmed) return
    }

    const prevStep = steps[currentIndex.value - 1]

    if (!prevStep) {
      router.push('/onboardings')
      return
    }

    router.push(prevStep.path)
  }


  const saveDraft = async () => {
    if (isProcessing.value.draft) return
    isProcessing.value.draft = true

    try {
      if (!store.onboarding?.id) {
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
      if (currentStep.value?.submit && payload) {
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
      isProcessing.value.draft = false
    }
  }

  onMounted(async () => {
    if (store.onboarding?.id) return
    if (!route.query.onboarding_id) return
    await store.fetch(route.query.onboarding_id)
  })


  const resolvedSteps = computed(() => {
    return steps.map(step => {

      if (step.key === null) {
        return { ...step, enabled: true }
      }

      if (!store.onboarding) {
        return { ...step, enabled: false }
      }

      return {
        ...step,
        enabled: store.onboarding[step.key] !== null,
      }
    })
  })


  onBeforeRouteLeave(() => {
    if (isProcessing.value.draft || isProcessing.value.next) return false
  })

  return {
    stepRef,
    isProcessing,

    steps,
    resolvedSteps,
    currentIndex,

    goNext,
    goBack,
    saveDraft,
  }
}
