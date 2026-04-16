export interface Barber {
  _id: string
  name: string
  photo: string
  bio: string
  active: boolean
  schedule: {
    monday: DaySchedule
    tuesday: DaySchedule
    wednesday: DaySchedule
    thursday: DaySchedule
    friday: DaySchedule
    saturday: DaySchedule
    sunday: DaySchedule
  }
  blockedSlots: Array<{ date: string; time: string }>
  blockedDays: string[]
}

export interface DaySchedule {
  enabled: boolean
  start: string
  end: string
  breakStart?: string
  breakEnd?: string
}

export interface Service {
  _id: string
  name: string
  description: string
  price: number
  duration: number
  depositAmount: number
  active: boolean
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface Appointment {
  _id: string
  clientName: string
  clientPhone: string
  service: Service
  barber: Barber
  date: string
  timeSlot: string
  status: 'pending_payment' | 'confirmed' | 'cancelled' | 'completed'
  depositStatus: 'pending' | 'paid' | 'waived'
  mpPreferenceId: string
  mpPaymentId: string
  notes: string
  createdAt: string
}

export interface Admin {
  id: string
  name: string
  email: string
}

export type BookingStep = 'service' | 'barber' | 'calendar' | 'info' | 'confirm'

export interface BookingState {
  service: Service | null
  barber: Barber | null
  date: string
  timeSlot: string
  clientName: string
  clientPhone: string
}
