import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  adminId?: string
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Sin autorización' })
    return
  }
  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    req.adminId = decoded.id
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido' })
  }
}
