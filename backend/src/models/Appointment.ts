import { Schema, model, Document, Types } from 'mongoose'

export type AppointmentStatus = 'pending_payment' | 'confirmed' | 'cancelled' | 'completed'
export type DepositStatus = 'pending' | 'paid' | 'waived'

export interface IAppointment extends Document {
  clientName: string
  clientPhone: string
  service: Types.ObjectId
  barber: Types.ObjectId
  date: string
  timeSlot: string
  status: AppointmentStatus
  depositStatus: DepositStatus
  mpPreferenceId: string
  mpPaymentId: string
  notes: string
}

const appointmentSchema = new Schema<IAppointment>(
  {
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    barber: { type: Schema.Types.ObjectId, ref: 'Barber', required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending_payment', 'confirmed', 'cancelled', 'completed'],
      default: 'pending_payment'
    },
    depositStatus: {
      type: String,
      enum: ['pending', 'paid', 'waived'],
      default: 'pending'
    },
    mpPreferenceId: { type: String, default: '' },
    mpPaymentId: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
)

export const Appointment = model<IAppointment>('Appointment', appointmentSchema)
