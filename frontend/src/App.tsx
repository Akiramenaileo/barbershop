import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import LandingView from './views/public/LandingView'
import BookingView from './views/public/BookingView'
import SuccessView from './views/public/SuccessView'
import LoginView from './views/admin/LoginView'
import DashboardView from './views/admin/DashboardView'
import AppointmentsView from './views/admin/AppointmentsView'
import BarbersView from './views/admin/BarbersView'
import ServicesView from './views/admin/ServicesView'
import AdminsView from './views/admin/AdminsView'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingView />} />
          <Route path="/reservar" element={<BookingView />} />
          <Route path="/reserva-exitosa" element={<SuccessView />} />
        </Route>
        <Route path="/admin/login" element={<LoginView />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardView />} />
          <Route path="turnos" element={<AppointmentsView />} />
          <Route path="barberos" element={<BarbersView />} />
          <Route path="servicios" element={<ServicesView />} />
          <Route path="administradores" element={<AdminsView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
