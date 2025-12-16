import api from './axios'

export const getDepartments = () =>
  api.get('/departments')

export const getSpecificZones = () =>
  api.get('/specific-zones')
