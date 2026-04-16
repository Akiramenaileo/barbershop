import { Request, Response } from 'express'
import { Service } from '../models/Service'

export const getServices = async (_req: Request, res: Response): Promise<void> => {
  const services = await Service.find({ active: true }).sort({ createdAt: 1 })
  res.json(services)
}

export const getAllServices = async (_req: Request, res: Response): Promise<void> => {
  const services = await Service.find().sort({ createdAt: 1 })
  res.json(services)
}

export const createService = async (req: Request, res: Response): Promise<void> => {
  const service = await Service.create(req.body)
  res.status(201).json(service)
}

export const updateService = async (req: Request, res: Response): Promise<void> => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!service) { res.status(404).json({ message: 'No encontrado' }); return }
  res.json(service)
}

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  await Service.findByIdAndDelete(req.params.id)
  res.json({ message: 'Servicio eliminado' })
}
