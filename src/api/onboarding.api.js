import api from './axios'

export const createDraft = (payload) =>
  api.post('/onboardings', payload)

export const updateStep1 = (id, payload) =>
  api.put(`/onboardings/${id}/step-1`, payload)

export const updateStep2 = (id, payload) =>
  api.put(`/onboardings/${id}/step-2`, payload)

export const updateStep3 = (id, payload) => {
  payload.append('_method', 'PUT')
  return api.post(`/onboardings/${id}/step-3`, payload)
}

export const submitOnboarding = (id) =>
  api.post(`/onboardings/${id}/submit`)

export const getOnboarding = (id) =>
  api.get(`/onboardings/${id}`)

export const getOnboardingAll = ({ page }) =>
  api.get(`/onboardings?page=${page}`)


