import { Router } from 'express'
import { getBarbers, getAllBarbers, createBarber, updateBarber, deleteBarber, toggleBlockedSlot, toggleBlockedDay, toggleRecurringSlot } from '../controllers/barberController'
import { protect } from '../middleware/auth'

const router = Router()

router.get('/', getBarbers)
router.get('/all', protect, getAllBarbers)
router.post('/', protect, createBarber)
router.put('/:id', protect, updateBarber)
router.delete('/:id', protect, deleteBarber)
router.patch('/:id/blocked-slots', protect, toggleBlockedSlot)
router.patch('/:id/blocked-days', protect, toggleBlockedDay)
router.patch('/:id/recurring-slots', protect, toggleRecurringSlot)

export default router
