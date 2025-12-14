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

export function useOnboardingWizard() {
    // =======================
    // CORE DEPENDENCIES
    // =======================
    const route = useRoute()
    const router = useRouter()
    const store = useOnboardingStore()
    const toast = useToast()

    const isProcessing = ref(false)
    const stepRef = ref(null)

    // =======================
    // ERROR    R
    // =======================
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
                store.clear()
            },
        },
    ]

    // =======================
    // HELPERS
    // =======================
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

            if (currentStep.value?.submit) {
                // const confirmed = await confirmFinalSubmit()
                // if (!confirmed) return
                const payload = getStepPayload()
                await currentStep.value.submit(payload)
            }

            const nextStep = steps[currentIndex.value + 1]
            router.push(nextStep ? nextStep.path : '/dashboard')
        } catch (err) {
            showError(err)
        } finally {
            isProcessing.value = false
        }
    }

    async function goBack() {
        const step = stepRef.value

        if (step?.hasValue?.()) {
            const confirmed = await confirmUnsavedChanges()
            if (!confirmed) return
        }

        router.back()
    }

    const saveDraft = async () => {
        if (isProcessing.value) return
        isProcessing.value = true

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
        return steps.map(step => {
            // STEP 1 selalu enabled
            if (step.key === null) {
                return { ...step, enabled: true }
            }

            // step lain disabled kalau onboarding belum ada
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
        if (isProcessing.value) return false
    })

    // =======================
    // PUBLIC API (IMPORTANT)
    // =======================
    return {
        // refs
        stepRef,
        isProcessing,

        // step meta
        steps,
        resolvedSteps,
        currentIndex,

        // actions
        goNext,
        goBack,
        saveDraft,
    }
}
