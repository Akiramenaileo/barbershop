import { Schema, model, Document } from 'mongoose'

type DaySchedule = {
  enabled: boolean
  start: string
  end: string
  breakStart?: string
  breakEnd?: string
}

export interface IBarber extends Document {
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
}

const daySchema = {
  enabled: { type: Boolean, default: false },
  start: { type: String, default: '09:00' },
  end: { type: String, default: '19:00' },
  breakStart: { type: String, default: '' },
  breakEnd: { type: String, default: '' }
}

const barberSchema = new Schema<IBarber>(
  {
    name: { type: String, required: true },
    photo: { type: String, default: '' },
    bio: { type: String, default: '' },
    active: { type: Boolean, default: true },
    blockedSlots: [{
      date: { type: String, required: true },
      time: { type: String, required: true }
    }],
    schedule: {
      monday: { type: daySchema, default: () => ({ enabled: true, start: '09:00', end: '19:00' }) },
      tuesday: { type: daySchema, default: () => ({ enabled: true, start: '09:00', end: '19:00' }) },
      wednesday: { type: daySchema, default: () => ({ enabled: true, start: '09:00', end: '19:00' }) },
      thursday: { type: daySchema, default: () => ({ enabled: true, start: '09:00', end: '19:00' }) },
      friday: { type: daySchema, default: () => ({ enabled: true, start: '09:00', end: '19:00' }) },
      saturday: { type: daySchema, default: () => ({ enabled: true, start: '09:00', end: '14:00' }) },
      sunday: { type: daySchema, default: () => ({ enabled: false, start: '09:00', end: '14:00' }) }
    }
  },
  { timestamps: true }
)

export const Barber = model<IBarber>('Barber', barberSchema)
