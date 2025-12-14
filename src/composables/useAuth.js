import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
  const store = useAuthStore()

  return {
    login: store.login,
    logout: store.logout,
    isAuthenticated: store.isAuthenticated,
    user: store.user,
    loading: store.loading,
  }
}
