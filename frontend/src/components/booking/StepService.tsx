import { useQuery } from '@tanstack/react-query'
import { fetchServices } from '../../api/services'
import { Service } from '../../types'
import Spinner from '../ui/Spinner'

interface Props {
  selected: Service | null
  onSelect: (s: Service) => void
}

export default function StepService({ selected, onSelect }: Props) {
  const { data: services, isLoading } = useQuery({ queryKey: ['services'], queryFn: fetchServices })

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>

  return (
    <div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.4rem' }}>¿Qué servicio querés?</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Seleccioná el servicio para ver barberos y horarios disponibles.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {services?.map(s => {
          const isSelected = selected?._id === s._id
          return (
            <button
              key={s._id}
              onClick={() => onSelect(s)}
              style={{
                background: isSelected ? 'rgba(212,170,80,0.15)' : 'var(--bg-card)',
                border: `1px solid ${isSelected ? '#D4AA50' : 'var(--border)'}`,
                borderRadius: 4,
                padding: '1.5rem',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s', color: 'var(--text)',
                position: 'relative',
                boxShadow: isSelected ? '0 0 0 1px #D4AA50' : 'none'
              }}
              onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(155,122,66,0.07)' } }}
              onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)' } }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  width: 18, height: 18, borderRadius: 2,
                  background: 'var(--gold)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', color: '#0D0907', fontWeight: 700
                }}>✓</div>
              )}
              <div style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {s.duration} min
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.4rem', color: isSelected ? '#D4AA50' : 'var(--text)' }}>{s.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>{s.description}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, color: isSelected ? '#D4AA50' : 'var(--gold)', fontSize: isSelected ? '1.2rem' : '1.1rem' }}>
                  ${s.price.toLocaleString('es-AR')}
                </span>
                {s.depositAmount > 0 && (
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                    seña ${s.depositAmount.toLocaleString('es-AR')}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
