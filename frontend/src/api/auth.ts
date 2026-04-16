import axios from 'axios'
import { Admin } from '../types'

const API = import.meta.env.VITE_API_URL

export const login = async (email: string, password: string): Promise<{ token: string; admin: Admin }> => {
  const { data } = await axios.post(`${API}/auth/login`, { email, password })
  return data
}

export const fetchMe = async (token: string): Promise<Admin> => {
  const { data } = await axios.get(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const fetchAdmins = async (token: string): Promise<Admin[]> => {
  const { data } = await axios.get(`${API}/auth/admins`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const createAdmin = async (
  token: string,
  body: { name: string; email: string; password: string }
): Promise<Admin> => {
  const { data } = await axios.post(`${API}/auth/admins`, body, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const deleteAdmin = async (token: string, id: string): Promise<void> => {
  await axios.delete(`${API}/auth/admins/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}
