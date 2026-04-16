import { Router } from 'express'
import {
  getAvailableSlots,
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getAppointmentById,
  deleteAppointment
} from '../controllers/appointmentController'
import { protect } from '../middleware/auth'

const router = Router()

router.get('/slots', getAvailableSlots)
router.post('/', createAppointment)
router.get('/:id', getAppointmentById)
router.get('/', protect, getAppointments)
router.patch('/:id', protect, updateAppointmentStatus)
router.delete('/:id', protect, deleteAppointment)

export default router
