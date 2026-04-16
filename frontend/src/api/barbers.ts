import axios from 'axios'
import { Barber } from '../types'

const API = import.meta.env.VITE_API_URL

export const fetchBarbers = async (): Promise<Barber[]> => {
  const { data } = await axios.get(`${API}/barbers`)
  return data
}

export const fetchAllBarbers = async (token: string): Promise<Barber[]> => {
  const { data } = await axios.get(`${API}/barbers/all`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const createBarber = async (token: string, body: Partial<Barber>): Promise<Barber> => {
  const { data } = await axios.post(`${API}/barbers`, body, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const updateBarber = async (token: string, id: string, body: Partial<Barber>): Promise<Barber> => {
  const { data } = await axios.put(`${API}/barbers/${id}`, body, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const deleteBarber = async (token: string, id: string): Promise<void> => {
  await axios.delete(`${API}/barbers/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}
