import { defineStore } from 'pinia'
import { loginApi } from '@/api/auth.api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token'),
        loading: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async login(email, password) {
            this.loading = true
            try {
                const res = await loginApi({ email, password })

                this.token = res.data.token
                this.user = res.data.data ?? null

                localStorage.setItem('token', this.token)

                return { ok: true }
            } catch (err) {
                return {
                    ok: false,
                    message:
                        err.response?.data?.message ||
                        'Login failed',
                }
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.$reset()
            localStorage.removeItem('token')
        },
    },

    persist: {
        key: 'auth',
        storage: localStorage,
        paths: ['token', 'user'],
    },
})
