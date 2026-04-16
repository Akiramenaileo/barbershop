import { Outlet, Link, useLocation } from 'react-router-dom'
import Logo from '../components/ui/Logo'

export default function PublicLayout() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: isLanding ? 'transparent' : 'rgba(13,9,7,0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: isLanding ? 'none' : '1px solid var(--border)',
        transition: 'background 0.3s, border-color 0.3s'
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 2rem',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <Logo />
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {isLanding && (
              <>
                <a href="#servicios" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  Servicios
                </a>
                <a href="#equipo" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  Equipo
                </a>
              </>
            )}
            <Link to="/reservar" style={{
              fontSize: '0.8rem', color: 'var(--text)', textDecoration: 'none',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              border: '1px solid var(--border-strong)',
              padding: '0.45rem 1.25rem', borderRadius: 4,
              transition: 'all 0.15s'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--clr-accent)'; e.currentTarget.style.borderColor = 'var(--clr-accent)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}>
              Reservar
            </Link>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, paddingTop: isLanding ? 0 : 64 }}>
        <Outlet />
      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Barber<span style={{ color: 'var(--gold)' }}>Shop</span>
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          © 2026 · Todos los derechos reservados
        </span>
      </footer>
    </div>
  )
}
