import api from './axios'

export const loginApi = (payload) =>
    api.post('/login', payload)

export const logoutApi = () =>
    api.post('/logout')
