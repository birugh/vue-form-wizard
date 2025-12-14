import { defineStore } from 'pinia'
import {
  getOnboarding,
  getOnboardingAll,
} from '@/api/onboarding.api'

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    onboarding: null,      // active wizard
    list: [],              // draft list
    loading: false,

    page: 1,
    perPage: 10,
    total: 0,
  }),

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

    setActive(onboarding) {
      this.onboarding = onboarding
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
