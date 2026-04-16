import { Router } from 'express'
import { getServices, getAllServices, createService, updateService, deleteService } from '../controllers/serviceController'
import { protect } from '../middleware/auth'

const router = Router()

router.get('/', getServices)
router.get('/all', protect, getAllServices)
router.post('/', protect, createService)
router.put('/:id', protect, updateService)
router.delete('/:id', protect, deleteService)

export default router
