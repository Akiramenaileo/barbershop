import 'dotenv/config'
import express from 'express'
import { connectDB } from './config/db'
import { corsOptions } from './config/cors'
import authRoutes from './routes/authRoutes'
import barberRoutes from './routes/barberRoutes'
import serviceRoutes from './routes/serviceRoutes'
import appointmentRoutes from './routes/appointmentRoutes'
import webhookRoutes from './routes/webhookRoutes'

const app = express()

app.use(corsOptions)
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/barbers', barberRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/webhooks', webhookRoutes)

const PORT = process.env.PORT || 4000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
