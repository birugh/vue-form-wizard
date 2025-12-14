import { defineStore } from 'pinia'
import { getOnboarding } from '@/api/onboarding.api'

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    onboarding: null,
    loading: false,
  }),

  actions: {
    async fetchOnboarding(id) {
      // if (!id || !this.onboarding) return
      if (!id) return

      this.loading = true
      try {
        const res = await getOnboarding(id)
        this.onboarding = res.data.data
      } catch (error) {
        console.error('Failed to fetch onboarding', error)
        this.onboarding = null
      } finally {
        this.loading = false
      }
    },

    clear() {
      this.$reset()
    },
  },

  persist: {
    key: 'onboarding',
    storage: localStorage,
  },
})
