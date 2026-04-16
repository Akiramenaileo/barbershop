import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchSlots } from '../../api/appointments'
import { Barber, Service } from '../../types'
import Spinner from '../ui/Spinner'

interface Props {
  barber: Barber
  service: Service
  selectedDate: string
  selectedSlot: string
  onSelect: (date: string, slot: string) => void
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function getCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const days: (Date | null)[] = Array(first.getDay()).fill(null)
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d))
  return days
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function StepCalendar({ barber, service, selectedDate, selectedSlot, onSelect }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const days = getCalendarDays(viewYear, viewMonth)
  const todayStr = toDateStr(today)

  const { data: slots, isLoading } = useQuery({
    queryKey: ['slots', barber._id, selectedDate, service._id],
    queryFn: () => fetchSlots(barber._id, selectedDate, service._id),
    enabled: !!selectedDate
  })

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const isPast = (d: Date) => toDateStr(d) < todayStr

  return (
    <div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.4rem' }}>
        Elegí día y horario
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        {barber.name} — {service.name} ({service.duration} min)
      </p>

      <div className="calendar-layout">
        {/* Calendar */}
        <div className="card" style={{ padding: '1.25rem', minWidth: 0, flex: '1 1 280px' }}>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem 0.5rem', borderRadius: 6 }}>←</button>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem 0.5rem', borderRadius: 6 }}>→</button>
          </div>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', padding: '0.25rem 0' }}>
                {d}
              </div>
            ))}
          </div>
          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
            {days.map((d, i) => {
              if (!d) return <div key={`empty-${i}`} />
              const str = toDateStr(d)
              const past = isPast(d)
              const isSelected = str === selectedDate
              return (
                <button
                  key={str}
                  disabled={past}
                  onClick={() => !past && onSelect(str, '')}
                  style={{
                    width: '100%',
                    height: 36,
                    borderRadius: 8,
                    border: isSelected ? '2px solid var(--clr-accent)' : '1px solid transparent',
                    background: isSelected ? 'rgba(212,160,23,0.15)' : 'transparent',
                    color: past ? 'var(--border)' : isSelected ? 'var(--clr-accent)' : 'var(--text)',
                    cursor: past ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : 400,
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time slots */}
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
          {!selectedDate ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Seleccioná un día para ver los horarios
            </div>
          ) : isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spinner /></div>
          ) : !slots?.length ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No hay turnos disponibles este día
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {slots.map(slot => {
                  const isSelected = slot.time === selectedSlot
                  return (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => slot.available && onSelect(selectedDate, slot.time)}
                      style={{
                        padding: '0.5rem 0.875rem',
                        borderRadius: 8,
                        border: `1.5px solid ${isSelected ? 'var(--clr-accent)' : slot.available ? '#22c55e55' : '#f8717155'}`,
                        background: isSelected
                          ? 'var(--clr-accent)'
                          : slot.available
                            ? '#22c55e18'
                            : '#f8717118',
                        color: isSelected ? '#000' : slot.available ? '#22c55e' : '#f87171',
                        cursor: slot.available ? 'pointer' : 'not-allowed',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 700 : 400,
                        transition: 'all 0.15s',
                        textDecoration: !slot.available ? 'line-through' : 'none'
                      }}
                    >
                      {slot.time}
                    </button>
                  )
                })}
              </div>
              {/* Legend */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#22c55e' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: '#22c55e18', border: '1px solid #22c55e55', display: 'inline-block' }} />
                  Disponible
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f87171' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: '#f8717118', border: '1px solid #f8717155', display: 'inline-block' }} />
                  Ocupado
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
