import 'dotenv/config'
import { connectDB } from './config/db'
import { Admin } from './models/Admin'
import { Barber } from './models/Barber'
import { Service } from './models/Service'

async function seed() {
  await connectDB()

  await Admin.deleteMany()
  await Barber.deleteMany()
  await Service.deleteMany()

  await Admin.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@barberdemo.com',
    password: process.env.ADMIN_PASSWORD || (() => { throw new Error('ADMIN_PASSWORD env var is required') })()
  })

  await Barber.create([
    {
      name: 'Lucas Rodríguez',
      bio: 'Especialista en fade y degradados.',
      photo: '',
      active: true
    },
    {
      name: 'Matías García',
      bio: 'Cortes clásicos y barba a tijera.',
      photo: '',
      active: true
    },
    {
      name: 'Tomás Soria',
      bio: 'Diseños personalizados y colorimetría.',
      photo: '',
      active: true
    }
  ])

  await Service.create([
    { name: 'Corte de cabello', description: 'Corte clásico o moderno', price: 3500, duration: 30, depositAmount: 500, active: true },
    { name: 'Corte + Barba', description: 'Corte completo más arreglo de barba', price: 5000, duration: 60, depositAmount: 800, active: true },
    { name: 'Barba', description: 'Arreglo y perfilado de barba', price: 2000, duration: 30, depositAmount: 300, active: true },
    { name: 'Fade', description: 'Degradado bajo, medio o alto', price: 4000, duration: 45, depositAmount: 600, active: true }
  ])

  console.log('Seed completado')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
