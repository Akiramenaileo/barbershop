import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchBarbers } from '../../api/barbers'
import { fetchServices } from '../../api/services'
import Spinner from '../../components/ui/Spinner'

const IMG = {
  hero:     'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920&q=80',
  interior: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1400&q=80',
  action:   'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80',
  tools:    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1400&q=80',
}

export default function LandingView() {
  const { data: barbers } = useQuery({ queryKey: ['barbers'], queryFn: fetchBarbers })
  const { data: services } = useQuery({ queryKey: ['services'], queryFn: fetchServices })

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 0 5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background photo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          filter: 'brightness(0.45)'
        }} />
        {/* Gradient overlay — darker bottom so text is readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,9,7,0.98) 0%, rgba(13,9,7,0.3) 50%, rgba(13,9,7,0.1) 100%)'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
          {/* Label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <span style={{ width: 32, height: 1, background: 'var(--gold)', display: 'inline-block' }} />
            <span className="section-label">Tucumán · Desde 2025</span>
          </div>

          {/* Main heading */}
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
            fontWeight: 700,
            fontStyle: 'italic',
            lineHeight: 0.92,
            letterSpacing: '-0.03em',
            marginBottom: '2.5rem',
            maxWidth: 800
          }}>
            El arte del<br />
            <span style={{ color: 'var(--gold)' }}>corte perfecto</span>
          </h1>

          {/* Bottom row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(232,217,196,0.7)',
              maxWidth: 420,
              lineHeight: 1.7,
              fontFamily: 'Inter, sans-serif'
            }}>
              Barbería profesional en Tucumán. Reservá tu turno online,
              elegí tu barbero y asegurate el horario con una seña.
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/reservar"
                className="btn-primary"
                style={{ textDecoration: 'none', fontSize: '0.9rem', padding: '0.9rem 2.5rem' }}
              >
                Reservar turno
              </Link>
              <a
                href="#servicios"
                style={{
                  fontSize: '0.75rem', color: 'rgba(232,217,196,0.5)',
                  textDecoration: 'none', letterSpacing: '0.08em',
                  textTransform: 'uppercase', transition: 'color 0.15s',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,217,196,0.5)')}
              >
                Ver servicios ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="landing-stats" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {[
            { n: '+500', label: 'Clientes satisfechos' },
            { n: '3', label: 'Barberos expertos' },
            { n: '5★', label: 'Valoración promedio' }
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: '2rem',
              borderRight: i < 2 ? '1px solid var(--border)' : 'none',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '2.25rem', fontWeight: 700, fontStyle: 'italic',
                color: 'var(--gold)', lineHeight: 1
              }}>{s.n}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── INTERIOR SPLIT ── */}
      <section className="interior-split" style={{ display: 'flex', minHeight: 520 }}>
        {/* Photo side */}
        <div style={{
          flex: '1 1 50%',
          backgroundImage: `url(${IMG.interior})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 400
        }} />
        {/* Text side */}
        <div style={{
          flex: '1 1 50%',
          background: 'var(--bg-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem 3.5rem'
        }}>
          <span className="section-label" style={{ marginBottom: '1.25rem', display: 'block' }}>Nuestro espacio</span>
          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 700, fontStyle: 'italic',
            lineHeight: 1.1, marginBottom: '1.5rem'
          }}>
            Donde la tradición<br />
            <span style={{ color: 'var(--gold)' }}>se encuentra</span><br />
            con el estilo
          </h2>
          <p style={{
            fontSize: '0.9rem', color: 'var(--text-muted)',
            lineHeight: 1.8, maxWidth: 400, fontFamily: 'Inter, sans-serif',
            marginBottom: '2rem'
          }}>
            Un ambiente cuidado al detalle para que te relajes y salgas
            sintiéndote diferente. Sillas clásicas, productos premium y
            barberos con años de experiencia.
          </p>
          <Link
            to="/reservar"
            style={{
              fontSize: '0.75rem', color: 'var(--gold)', textDecoration: 'none',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              transition: 'gap 0.15s'
            }}
            onMouseEnter={e => (e.currentTarget.style.gap = '0.85rem')}
            onMouseLeave={e => (e.currentTarget.style.gap = '0.5rem')}
          >
            Reservar turno →
          </Link>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="servicios" className="landing-section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="landing-section-header">
            <div>
              <span className="section-label">Servicios</span>
              <h2 style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700, fontStyle: 'italic',
                marginTop: '0.5rem', lineHeight: 1.1
              }}>
                ¿Qué vas a hacerte<br />hoy?
              </h2>
            </div>
            <Link
              to="/reservar"
              style={{
                fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'color 0.15s', whiteSpace: 'nowrap',
                alignSelf: 'flex-end', paddingBottom: '0.25rem'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Reservar ahora →
            </Link>
          </div>

          {!Array.isArray(services) ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
          ) : (
            <div>
              {services.map((s, i) => (
                <div key={s._id} className="landing-service-row" style={{ transition: 'all 0.2s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.paddingLeft = '1rem'; e.currentTarget.style.color = 'var(--gold)' }}
                  onMouseLeave={e => { e.currentTarget.style.paddingLeft = '0'; e.currentTarget.style.color = 'var(--text)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
                      color: 'var(--text-muted)', minWidth: 28, opacity: 0.5
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontFamily: 'Fraunces, serif', fontSize: '1.15rem',
                        fontWeight: 500, fontStyle: 'italic',
                        transition: 'color 0.2s', color: 'inherit'
                      }}>{s.name}</h3>
                      <p style={{
                        fontSize: '0.8rem', color: 'var(--text-muted)',
                        marginTop: '0.25rem', lineHeight: 1.5, fontFamily: 'Inter, sans-serif'
                      }}>{s.description}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexShrink: 0 }}>
                    <span style={{
                      fontSize: '0.65rem', color: 'var(--text-muted)',
                      fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em'
                    }}>
                      {s.duration} min
                    </span>
                    <span style={{
                      fontFamily: 'Fraunces, serif', fontStyle: 'italic',
                      fontWeight: 600, fontSize: '1.2rem',
                      color: 'var(--gold)', minWidth: 80, textAlign: 'right'
                    }}>
                      ${s.price.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="equipo" className="landing-section" style={{ background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '3.5rem' }}>
            <span className="section-label">El equipo</span>
            <h2 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700, fontStyle: 'italic',
              marginTop: '0.5rem', lineHeight: 1.1
            }}>
              Nuestros barberos
            </h2>
          </div>

          {!Array.isArray(barbers) ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '2px'
            }}>
              {barbers.map(b => (
                <div key={b._id} style={{
                  background: 'var(--bg)', padding: '2rem', transition: 'background 0.2s'
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
                >
                  <div style={{
                    width: '100%', aspectRatio: '1 / 1',
                    background: 'var(--bg-hover)', marginBottom: '1.25rem',
                    overflow: 'hidden', maxHeight: 260
                  }}>
                    {b.photo ? (
                      <img src={b.photo} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        backgroundImage: `url(${IMG.action})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        position: 'relative'
                      }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,9,7,0.5)' }} />
                        <span style={{
                          fontFamily: 'Fraunces, serif', fontStyle: 'italic',
                          fontSize: '3rem', fontWeight: 700, color: 'var(--gold)',
                          position: 'relative', zIndex: 1, opacity: 0.9
                        }}>
                          {b.initials || b.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 style={{
                    fontFamily: 'Fraunces, serif', fontStyle: 'italic',
                    fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.4rem'
                  }}>{b.name}</h3>
                  <p style={{
                    fontSize: '0.8rem', color: 'var(--text-muted)',
                    lineHeight: 1.6, fontFamily: 'Inter, sans-serif'
                  }}>{b.bio}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-section" style={{ position: 'relative', overflow: 'hidden', minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        {/* Background photo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG.tools})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.25) saturate(0.6)'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,9,7,0.6), rgba(13,9,7,0.85))'
        }} />
        <div style={{ maxWidth: 680, position: 'relative', zIndex: 1 }}>
          <span className="section-label" style={{ display: 'block', marginBottom: '1.5rem' }}>
            Reserva online
          </span>
          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 700, fontStyle: 'italic',
            lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '1.75rem'
          }}>
            ¿Listo para el<br />
            <span style={{ color: 'var(--gold)' }}>cambio?</span>
          </h2>
          <p style={{
            color: 'rgba(232,217,196,0.65)',
            fontSize: '1rem', lineHeight: 1.7,
            marginBottom: '2.5rem', fontFamily: 'Inter, sans-serif'
          }}>
            Elegí el horario que más te convenga y reservá tu lugar
            con una pequeña seña a través de MercadoPago.
          </p>
          <Link
            to="/reservar"
            className="btn-primary"
            style={{
              textDecoration: 'none', fontSize: '1rem',
              padding: '1.1rem 3rem', display: 'inline-block'
            }}
          >
            Reservar mi turno →
          </Link>
        </div>
      </section>
    </div>
  )
}
