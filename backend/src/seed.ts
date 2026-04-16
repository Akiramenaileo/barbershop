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
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      active: true
    },
    {
      name: 'Matías García',
      bio: 'Cortes clásicos y barba a tijera.',
      photo: 'https://images.pexels.com/photos/18483778/pexels-photo-18483778.jpeg?auto=compress&cs=tinysrgb&w=400',
      active: true
    },
    {
      name: 'Tomás Soria',
      bio: 'Diseños personalizados y colorimetría.',
      photo: 'https://images.pexels.com/photos/7697224/pexels-photo-7697224.jpeg?auto=compress&cs=tinysrgb&w=400',
      active: true
    }
  ])

  await Service.create([
    { name: 'Corte de cabello', description: 'Corte clásico o moderno', price: 10000, duration: 30, depositAmount: 2000, active: true },
    { name: 'Corte + Barba', description: 'Corte completo más arreglo de barba', price: 13000, duration: 60, depositAmount: 2500, active: true },
    { name: 'Barba', description: 'Arreglo y perfilado de barba', price: 3000, duration: 30, depositAmount: 500, active: true },
    { name: 'Fade', description: 'Degradado bajo, medio o alto', price: 12000, duration: 45, depositAmount: 2000, active: true },
    { name: 'Afeitado clásico', description: 'Afeitado con navaja recta, toalla caliente y productos premium', price: 8000, duration: 30, depositAmount: 1500, active: true },
    { name: 'Corte de niño', description: 'Corte para menores de 12 años, relajado y sin apuros', price: 7000, duration: 25, depositAmount: 1000, active: true }
  ])

  console.log('Seed completado')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
