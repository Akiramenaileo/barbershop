import { Router } from 'express'
import { mpWebhook } from '../controllers/webhookController'

const router = Router()

router.post('/mp', mpWebhook)

export default router
