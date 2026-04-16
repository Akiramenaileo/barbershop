import { Request, Response } from 'express'
import { Barber } from '../models/Barber'

export const getBarbers = async (_req: Request, res: Response): Promise<void> => {
  const barbers = await Barber.find({ active: true }).sort({ createdAt: 1 })
  res.json(barbers)
}

export const getAllBarbers = async (_req: Request, res: Response): Promise<void> => {
  const barbers = await Barber.find().sort({ createdAt: 1 })
  res.json(barbers)
}

export const createBarber = async (req: Request, res: Response): Promise<void> => {
  const barber = await Barber.create(req.body)
  res.status(201).json(barber)
}

export const updateBarber = async (req: Request, res: Response): Promise<void> => {
  const barber = await Barber.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!barber) { res.status(404).json({ message: 'No encontrado' }); return }
  res.json(barber)
}

export const deleteBarber = async (req: Request, res: Response): Promise<void> => {
  await Barber.findByIdAndDelete(req.params.id)
  res.json({ message: 'Barbero eliminado' })
}
