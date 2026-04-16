import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom'
import Logo from '../components/ui/Logo'

const useAuth = () => {
  const token = localStorage.getItem('barber_token')
  return { token, isAuth: !!token }
}

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '⊟', exact: true },
  { to: '/admin/turnos', label: 'Turnos', icon: '≡' },
  { to: '/admin/barberos', label: 'Barberos', icon: '✂' },
  { to: '/admin/servicios', label: 'Servicios', icon: '◈' },
  { to: '/admin/administradores', label: 'Admins', icon: '◎' }
]

export default function AdminLayout() {
  const { isAuth } = useAuth()
  const navigate = useNavigate()

  if (!isAuth) return <Navigate to="/admin/login" replace />

  const logout = () => {
    localStorage.removeItem('barber_token')
    navigate('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <aside className="admin-sidebar" style={{
        width: 220, background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
        flexDirection: 'column', padding: '1.5rem 1rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <Logo size="sm" />
          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', paddingLeft: '1.85rem' }}>
            Panel de Administración
          </span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              style={({ isActive }) => ({
                padding: '0.6rem 0.875rem',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive ? '#000' : 'var(--text-muted)',
                background: isActive ? 'var(--clr-accent)' : 'transparent',
                transition: 'all 0.15s',
                display: 'block'
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn-ghost" style={{ fontSize: '0.8rem', marginTop: 'auto' }} onClick={logout}>
          Cerrar sesión
        </button>
      </aside>

      {/* Content */}
      <main className="admin-main">
        {/* Mobile top bar */}
        <div className="admin-topbar">
          <Logo size="sm" />
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Salir
          </button>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="admin-bottom-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `admin-bottom-nav-item${isActive ? ' active' : ''}`}
          >
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
