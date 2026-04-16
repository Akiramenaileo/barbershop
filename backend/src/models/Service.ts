import { Schema, model, Document } from 'mongoose'

export interface IService extends Document {
  name: string
  description: string
  price: number
  duration: number
  depositAmount: number
  active: boolean
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    duration: { type: Number, required: true, default: 30 },
    depositAmount: { type: Number, required: true, default: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export const Service = model<IService>('Service', serviceSchema)
