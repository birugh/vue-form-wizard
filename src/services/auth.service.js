import api from '@/api/axios.js'

export async function loginRequest(email, password) {
    return api.post('/login', { email, password })
}

export async function meRequest() {
    return api.get('/me/user')
}

export async function meOnboardingRequest() {
    return api.get('/me/onboarding')
}
