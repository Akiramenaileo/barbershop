import { useQuery } from '@tanstack/react-query'
import { fetchBarbers } from '../../api/barbers'
import { Barber } from '../../types'
import Spinner from '../ui/Spinner'

interface Props {
  selected: Barber | null
  onSelect: (b: Barber) => void
}

// SVG barber chair illustration
function ChairSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Seat */}
      <rect x="15" y="52" width="50" height="10" rx="4" fill={color} opacity="0.7" />
      {/* Backrest */}
      <rect x="18" y="20" width="44" height="34" rx="6" fill={color} opacity="0.5" />
      {/* Headrest */}
      <rect x="24" y="10" width="32" height="14" rx="6" fill={color} opacity="0.6" />
      {/* Armrests */}
      <rect x="8" y="40" width="10" height="18" rx="4" fill={color} opacity="0.5" />
      <rect x="62" y="40" width="10" height="18" rx="4" fill={color} opacity="0.5" />
      {/* Pole */}
      <rect x="37" y="62" width="6" height="16" rx="2" fill={color} opacity="0.4" />
      {/* Base */}
      <rect x="20" y="78" width="40" height="6" rx="3" fill={color} opacity="0.5" />
      {/* Footrest */}
      <rect x="12" y="68" width="56" height="7" rx="3" fill={color} opacity="0.35" />
    </svg>
  )
}

export default function StepBarber({ selected, onSelect }: Props) {
  const { data: barbers, isLoading } = useQuery({ queryKey: ['barbers'], queryFn: fetchBarbers })

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>

  return (
    <div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.4rem' }}>Elegí tu barbero</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Cada silla, un profesional. Seleccioná al barbero que querés.
      </p>
      <div className="barber-cards">
        {barbers?.map((b, i) => {
          const isSelected = selected?._id === b._id
          const chairColors = ['#785D32', '#4A2C0A', '#9B7A42']
          const chairColor = chairColors[i % chairColors.length]
          return (
            <button
              key={b._id}
              onClick={() => onSelect(b)}
              className="barber-card"
              style={{
                background: isSelected ? 'rgba(212,160,23,0.1)' : 'var(--bg-card)',
                border: `2px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}`,
                borderRadius: 4, padding: '1.25rem 1rem',
                cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.2s', color: 'var(--text)',
                position: 'relative'
              }}
            >
              {/* Chair illustration */}
              <div style={{ width: 80, height: 90, margin: '0 auto', position: 'relative' }}>
                <ChairSVG color={chairColor} />
                {/* Barber photo on headrest */}
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  width: 52, height: 52, borderRadius: '50%',
                  border: `2px solid ${isSelected ? 'var(--clr-accent)' : 'var(--border)'}`,
                  background: 'var(--bg-hover)', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'border-color 0.2s'
                }}>
                  {b.photo ? (
                    <img src={b.photo} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '1.5rem' }}>✂️</span>
                  )}
                </div>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{b.name}</div>
                <div style={{
                  fontSize: '0.75rem', color: 'var(--text-muted)',
                  marginTop: '0.3rem', lineHeight: 1.4,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {b.bio}
                </div>
              </div>
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--clr-accent)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', color: '#000', fontWeight: 700
                }}>
                  ✓
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
