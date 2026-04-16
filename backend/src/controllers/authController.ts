import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Admin } from '../models/Admin'
import { AuthRequest } from '../middleware/auth'

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '30d' })

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body
  const admin = await Admin.findOne({ email })
  if (!admin || !(await admin.comparePassword(password))) {
    res.status(401).json({ message: 'Credenciales inválidas' })
    return
  }
  res.json({ token: signToken(admin.id), admin: { id: admin.id, name: admin.name, email: admin.email } })
}

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const admin = await Admin.findById(req.adminId).select('-password')
  if (!admin) { res.status(404).json({ message: 'No encontrado' }); return }
  res.json(admin)
}

export const getAdmins = async (_req: Request, res: Response): Promise<void> => {
  const admins = await Admin.find().select('-password').sort({ createdAt: -1 })
  res.json(admins)
}

export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body
  const exists = await Admin.findOne({ email })
  if (exists) { res.status(400).json({ message: 'Email ya registrado' }); return }
  const admin = await Admin.create({ name, email, password })
  res.status(201).json({ id: admin.id, name: admin.name, email: admin.email })
}

export const deleteAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.params.id === req.adminId) {
    res.status(400).json({ message: 'No podés eliminarte a vos mismo' })
    return
  }
  await Admin.findByIdAndDelete(req.params.id)
  res.json({ message: 'Admin eliminado' })
}
