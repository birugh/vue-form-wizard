import { defineStore } from 'pinia'

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    onboardingId: localStorage.getItem('onboarding_id'),
    step1Completed: false,
  }),
  actions: {
    setOnboardingId(id) {
      this.onboardingId = id
      localStorage.setItem('onboarding_id', id)
    },
  },
})
