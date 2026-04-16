import { Router } from 'express'
import { login, getMe, getAdmins, createAdmin, deleteAdmin } from '../controllers/authController'
import { protect } from '../middleware/auth'

const router = Router()

router.post('/login', login)
router.get('/me', protect, getMe)
router.get('/admins', protect, getAdmins)
router.post('/admins', protect, createAdmin)
router.delete('/admins/:id', protect, deleteAdmin)

export default router
