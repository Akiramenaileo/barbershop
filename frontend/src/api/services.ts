import axios from 'axios'
import { Service } from '../types'

const API = import.meta.env.VITE_API_URL

export const fetchServices = async (): Promise<Service[]> => {
  const { data } = await axios.get(`${API}/services`)
  return data
}

export const fetchAllServices = async (token: string): Promise<Service[]> => {
  const { data } = await axios.get(`${API}/services/all`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const createService = async (token: string, body: Partial<Service>): Promise<Service> => {
  const { data } = await axios.post(`${API}/services`, body, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const updateService = async (token: string, id: string, body: Partial<Service>): Promise<Service> => {
  const { data } = await axios.put(`${API}/services/${id}`, body, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const deleteService = async (token: string, id: string): Promise<void> => {
  await axios.delete(`${API}/services/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}
