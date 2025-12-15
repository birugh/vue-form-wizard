import { defineStore } from 'pinia'
import { loginApi } from '@/api/auth.api'
import { meRequest } from '@/services/auth.service'
import { useOnboardingStore } from '@/stores/onboarding.store'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token'),
        loading: false,
        booted: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        role: (state) => state.user?.role,
        isAdmin: (state) => state.user?.role === 'admin',
        isUser: (state) => state.user?.role === 'user',
    },

    actions: {
        async login(email, password) {
            this.loading = true
            try {
                const res = await loginApi({ email, password })

                this.token = res.data.token
                localStorage.setItem('token', this.token)

                await this.fetchMe()

                return { ok: true }
            } catch (err) {
                return {
                    ok: false,
                    message: err.response?.data?.message || 'Login failed',
                }
            } finally {
                this.loading = false
            }
        },

        async fetchMe() {
            // ✅ 1. Ambil data user
            const res = await meRequest()
            this.user = res.data.data
            this.booted = true

            // ✅ 2. Kalau user, ambil onboarding-nya
            if (this.user.role === 'user') {
                const onboardingStore = useOnboardingStore()
                await onboardingStore.fetchMyOnboarding()
            }
        },

        logout() {
            this.$reset()
            localStorage.removeItem('token')

            // optional tapi bagus
            const onboardingStore = useOnboardingStore()
            onboardingStore.clear()
        },
    },

    persist: {
        key: 'auth',
        storage: localStorage,
        paths: ['token', 'user'],
    },
})
