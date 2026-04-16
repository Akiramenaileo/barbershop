import { Router } from 'express'
import { getBarbers, getAllBarbers, createBarber, updateBarber, deleteBarber } from '../controllers/barberController'
import { protect } from '../middleware/auth'

const router = Router()

router.get('/', getBarbers)
router.get('/all', protect, getAllBarbers)
router.post('/', protect, createBarber)
router.put('/:id', protect, updateBarber)
router.delete('/:id', protect, deleteBarber)

export default router
