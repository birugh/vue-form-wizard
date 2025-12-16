import { defineStore } from 'pinia'
import {
  getDepartments,
  getSpecificZones,
} from '@/api/master.api'

export const useMasterStore = defineStore('master', {
  state: () => ({
    departments: [],
    specificZones: [],
    loading: false,
  }),

  actions: {
    async fetchDepartments() {
      console.log('tes');

      if (this.departments.length) return

      this.loading = true
      try {
        const res = await getDepartments()
        this.departments = res.data.data
      } finally {
        this.loading = false
      }
    },

    async fetchSpecificZones() {
      if (this.specificZones.length) return

      this.loading = true
      try {
        const res = await getSpecificZones()
        this.specificZones = res.data.data
      } finally {
        this.loading = false
      }
    },

    async fetchAll() {
      await Promise.all([
        this.fetchDepartments(),
        this.fetchSpecificZones(),
      ])
    },

    clear() {
      this.$reset()
    },
  },
})
