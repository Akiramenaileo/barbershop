import { Request, Response } from 'express'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { Appointment } from '../models/Appointment'
import { Barber, IBarber } from '../models/Barber'
import { Service } from '../models/Service'

const DAY_NAMES: Record<number, keyof IBarber['schedule']> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday'
}

function generateSlots(start: string, end: string, duration: number): string[] {
  const slots: string[] = []
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let current = sh * 60 + sm
  const endMin = eh * 60 + em

  while (current + duration <= endMin) {
    const h = String(Math.floor(current / 60)).padStart(2, '0')
    const m = String(current % 60).padStart(2, '0')
    slots.push(`${h}:${m}`)
    current += duration
  }
  return slots
}

export const getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
  const { barberId, date, serviceId } = req.query as Record<string, string>

  const barber = await Barber.findById(barberId)
  const service = await Service.findById(serviceId)
  if (!barber || !service) { res.status(404).json({ message: 'No encontrado' }); return }

  const dateObj = new Date(date + 'T12:00:00')
  const dayName = DAY_NAMES[dateObj.getDay()]
  const daySchedule = barber.schedule[dayName]

  if (!daySchedule.enabled) {
    res.json({ slots: [] })
    return
  }

  const allSlots = generateSlots(daySchedule.start, daySchedule.end, service.duration)

  const booked = await Appointment.find({
    barber: barberId,
    date,
    status: 'confirmed'
  }).select('timeSlot')

  const bookedSet = new Set(booked.map(a => a.timeSlot))

  const slots = allSlots.map(slot => ({
    time: slot,
    available: !bookedSet.has(slot)
  }))

  res.json({ slots })
}

export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  const { clientName, clientPhone, serviceId, barberId, date, timeSlot } = req.body

  const service = await Service.findById(serviceId)
  const barber = await Barber.findById(barberId)
  if (!service || !barber) { res.status(404).json({ message: 'Servicio o barbero no encontrado' }); return }

  const conflict = await Appointment.findOne({
    barber: barberId,
    date,
    timeSlot,
    status: 'confirmed'
  })
  if (conflict) { res.status(409).json({ message: 'El turno ya está reservado' }); return }

  const appointment = await Appointment.create({
    clientName,
    clientPhone,
    service: serviceId,
    barber: barberId,
    date,
    timeSlot
  })

  let paymentUrl = ''

  if (service.depositAmount > 0 && process.env.MP_ACCESS_TOKEN) {
    try {
      const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
      const preferenceApi = new Preference(client)
      const pref = await preferenceApi.create({
        body: {
          items: [{
            id: appointment.id,
            title: `Seña - ${service.name} con ${barber.name}`,
            quantity: 1,
            unit_price: service.depositAmount,
            currency_id: 'ARS'
          }],
          payer: { phone: { number: clientPhone } },
          back_urls: {
            success: `${process.env.FRONTEND_URL}/reserva-exitosa?id=${appointment.id}`,
            failure: `${process.env.FRONTEND_URL}/reservar?error=pago`,
            pending: `${process.env.FRONTEND_URL}/reserva-exitosa?id=${appointment.id}&pending=1`
          },
          notification_url: `${process.env.BACKEND_URL}/api/webhooks/mp`,
          external_reference: appointment.id
        }
      })
      await Appointment.findByIdAndUpdate(appointment.id, { mpPreferenceId: pref.id })
      paymentUrl = pref.init_point ?? ''
    } catch (err) {
      console.error('MP preference error:', err)
    }
  }

  res.status(201).json({ appointment, paymentUrl })
}

export const getAppointments = async (req: Request, res: Response): Promise<void> => {
  const { date, status, barberId } = req.query as Record<string, string>
  const filter: Record<string, unknown> = {}
  if (date) filter.date = date
  if (status) filter.status = status
  if (barberId) filter.barber = barberId

  const appointments = await Appointment.find(filter)
    .populate('service', 'name price duration')
    .populate('barber', 'name photo')
    .sort({ date: 1, timeSlot: 1 })

  res.json(appointments)
}

export const updateAppointmentStatus = async (req: Request, res: Response): Promise<void> => {
  const { status, depositStatus, notes } = req.body
  const update: Record<string, unknown> = {}
  if (status) update.status = status
  if (depositStatus) update.depositStatus = depositStatus
  if (notes !== undefined) update.notes = notes

  const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true })
    .populate('service', 'name price duration')
    .populate('barber', 'name photo')
  if (!appointment) { res.status(404).json({ message: 'No encontrado' }); return }
  res.json(appointment)
}

export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('service', 'name price duration depositAmount')
    .populate('barber', 'name photo')
  if (!appointment) { res.status(404).json({ message: 'No encontrado' }); return }
  res.json(appointment)
}

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id)
  if (!appointment) { res.status(404).json({ message: 'No encontrado' }); return }
  res.json({ message: 'Turno eliminado' })
}
