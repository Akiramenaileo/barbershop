import { Request, Response } from 'express'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { Appointment } from '../models/Appointment'

export const mpWebhook = async (req: Request, res: Response): Promise<void> => {
  res.sendStatus(200)

  const { type, data } = req.body
  if (type !== 'payment' || !data?.id) return

  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const paymentApi = new Payment(client)
    const payment = await paymentApi.get({ id: data.id })

    if (payment.status !== 'approved') return

    const appointmentId = payment.external_reference
    await Appointment.findByIdAndUpdate(appointmentId, {
      depositStatus: 'paid',
      status: 'confirmed',
      mpPaymentId: String(data.id)
    })
  } catch (err) {
    console.error('Webhook MP error:', err)
  }
}
