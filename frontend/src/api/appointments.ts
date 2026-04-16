import axios from 'axios'
import { Appointment, TimeSlot } from '../types'

const API = import.meta.env.VITE_API_URL

export const fetchSlots = async (barberId: string, date: string, serviceId: string): Promise<TimeSlot[]> => {
  const { data } = await axios.get(`${API}/appointments/slots`, {
    params: { barberId, date, serviceId }
  })
  return data.slots
}

export const createAppointment = async (body: {
  clientName: string
  clientPhone: string
  serviceId: string
  barberId: string
  date: string
  timeSlot: string
}): Promise<{ appointment: Appointment; paymentUrl: string }> => {
  const { data } = await axios.post(`${API}/appointments`, body)
  return data
}

export const fetchAppointmentById = async (id: string): Promise<Appointment> => {
  const { data } = await axios.get(`${API}/appointments/${id}`)
  return data
}

export const fetchAppointments = async (
  token: string,
  filters?: { date?: string; status?: string; barberId?: string }
): Promise<Appointment[]> => {
  const { data } = await axios.get(`${API}/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
    params: filters
  })
  return data
}

export const updateAppointment = async (
  token: string,
  id: string,
  body: { status?: string; depositStatus?: string; notes?: string }
): Promise<Appointment> => {
  const { data } = await axios.patch(`${API}/appointments/${id}`, body, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

export const deleteAppointment = async (token: string, id: string): Promise<void> => {
  await axios.delete(`${API}/appointments/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}
