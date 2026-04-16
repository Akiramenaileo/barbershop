import 'dotenv/config'
import { connectDB } from './config/db'
import { Barber } from './models/Barber'

const PHOTOS: Record<string, string> = {
  'Lucas Rodríguez': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'Matías García':   'https://images.pexels.com/photos/18483778/pexels-photo-18483778.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Tomás Soria':     'https://images.pexels.com/photos/7697224/pexels-photo-7697224.jpeg?auto=compress&cs=tinysrgb&w=400',
}

async function run() {
  await connectDB()
  for (const [name, photo] of Object.entries(PHOTOS)) {
    const result = await Barber.updateOne({ name }, { $set: { photo } })
    console.log(`${name}: ${result.modifiedCount ? 'actualizado' : 'sin cambios (¿existe el barbero?)'}`)
  }
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })
