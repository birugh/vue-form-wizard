import { defineStore } from 'pinia'

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    onboardingId: null,
    step1Completed: false,
  }),
})
