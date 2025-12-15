import { defineStore } from 'pinia'
import {
  getOnboarding,
  getOnboardingAll,
} from '@/api/onboarding.api'
import { meOnboardingRequest } from '@/services/auth.service'

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    onboarding: null,
    list: [],
    loading: false,

    page: 1,
    perPage: 10,
    total: 0,
  }),

  getters: {
    isSubmitted: (state) => {
      return !!state.onboarding?.submitted_at
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const res = await getOnboardingAll({ page: this.page })
        console.log(res);

        this.list = res.data.data
        this.perPage = res.data.meta.per_page
        this.total = res.data.meta.total
      } finally {
        this.loading = false
      }
    },

    async fetch(id) {
      this.loading = true
      try {
        const res = await getOnboarding(id)
        this.onboarding = res.data.data
      } finally {
        this.loading = false
      }
    },

    async fetchMyOnboarding() {
      try {
        const res = await meOnboardingRequest()
        this.onboarding = res.data.data
      } catch {
        this.onboarding = null
      }
    },

    setActive(onboarding) {
      this.onboarding = onboarding
    },

    refreshOnboarding() {
      this.onboarding = null
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
