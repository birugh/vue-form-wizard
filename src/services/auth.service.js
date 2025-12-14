import api from './axios'

export async function loginRequest(email, password) {
    return api.post('/login', { email, password })
}

export async function meRequest() {
    return api.get('/me')
}
