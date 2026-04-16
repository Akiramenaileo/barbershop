import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAppointments, updateAppointment } from '../../api/appointments'
import { Appointment } from '../../types'
import Spinner from '../../components/ui/Spinner'

const token = () => localStorage.getItem('barber_token') ?? ''

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: 'Pago pendiente', color: '#FBBF24' },
  confirmed: { label: 'Confirmado', color: '#22c55e' },
  cancelled: { label: 'Cancelado', color: '#f87171' },
  completed: { label: 'Completado', color: '#60a5fa' }
}

const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || ''

function buildWaLink(appt: Appointment) {
  const text = encodeURIComponent(
    `Hola ${appt.clientName}! Tu turno está confirmado:\n📅 ${appt.date} a las ${appt.timeSlot}\n✂️ ${(appt.service as { name: string } | null)?.name ?? '—'} con ${(appt.barber as { name: string } | null)?.name ?? '—'}\nTe esperamos!`
  )
  return `https://wa.me/${appt.clientPhone.replace(/\D/g, '')}?text=${text}`
}

export default function AppointmentsView() {
  const qc = useQueryClient()
  const [filterDate, setFilterDate] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['admin-appointments', filterDate, filterStatus],
    queryFn: () => fetchAppointments(token(), {
      ...(filterDate && { date: filterDate }),
      ...(filterStatus && { status: filterStatus })
    })
  })

  const { mutate: patchAppt } = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { status?: string; depositStatus?: string; notes?: string } }) =>
      updateAppointment(token(), id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-appointments'] })
  })

  return (
    <div>
      <h1 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Turnos</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          style={{ width: 160 }}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 180 }}>
          <option value="">Todos los estados</option>
          <option value="pending_payment">Pago pendiente</option>
          <option value="confirmed">Confirmados</option>
          <option value="completed">Completados</option>
          <option value="cancelled">Cancelados</option>
        </select>
        {(filterDate || filterStatus) && (
          <button className="btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => { setFilterDate(''); setFilterStatus('') }}>
            Limpiar filtros
          </button>
        )}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
      ) : !appointments?.length ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No hay turnos con esos filtros
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {appointments.map((appt: Appointment) => {
            const statusInfo = STATUS_LABELS[appt.status]
            const isOpen = expanded === appt._id
            return (
              <div key={appt._id} className="card" style={{ overflow: 'hidden' }}>
                {/* Row */}
                <div
                  style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', cursor: 'pointer' }}
                  onClick={() => setExpanded(isOpen ? null : appt._id)}
                >
                  <div style={{ minWidth: 80 }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{appt.date}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--clr-accent)' }}>{appt.timeSlot}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{appt.clientName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {appt.clientPhone} · {(appt.service as { name: string } | null)?.name ?? '—'} · {(appt.barber as { name: string } | null)?.name ?? '—'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 600, color: statusInfo.color,
                      background: `${statusInfo.color}18`, padding: '0.25rem 0.625rem', borderRadius: 999
                    }}>
                      {statusInfo.label}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded panel */}
                {isOpen && (
                  <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {/* Status change */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Cambiar estado</span>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {(['confirmed', 'completed', 'cancelled'] as const).map(s => (
                          <button
                            key={s}
                            onClick={() => patchAppt({ id: appt._id, body: { status: s } })}
                            disabled={appt.status === s}
                            style={{
                              padding: '0.3rem 0.75rem', borderRadius: 6, border: `1px solid ${STATUS_LABELS[s].color}`,
                              background: appt.status === s ? `${STATUS_LABELS[s].color}20` : 'transparent',
                              color: STATUS_LABELS[s].color, cursor: appt.status === s ? 'default' : 'pointer',
                              fontSize: '0.75rem', fontWeight: 600, opacity: appt.status === s ? 0.7 : 1
                            }}
                          >
                            {STATUS_LABELS[s].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Deposit */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Seña</span>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {(['paid', 'waived'] as const).map(ds => (
                          <button
                            key={ds}
                            onClick={() => patchAppt({ id: appt._id, body: { depositStatus: ds } })}
                            disabled={appt.depositStatus === ds}
                            style={{
                              padding: '0.3rem 0.75rem', borderRadius: 6, border: '1px solid var(--border)',
                              background: appt.depositStatus === ds ? 'rgba(212,160,23,0.15)' : 'transparent',
                              color: appt.depositStatus === ds ? 'var(--clr-accent)' : 'var(--text-muted)',
                              cursor: appt.depositStatus === ds ? 'default' : 'pointer', fontSize: '0.75rem'
                            }}
                          >
                            {ds === 'paid' ? 'Pagada' : 'Eximida'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div style={{ marginLeft: 'auto' }}>
                      <a
                        href={buildWaLink(appt)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                          padding: '0.4rem 0.875rem', borderRadius: 6,
                          background: '#22c55e18', border: '1px solid #22c55e44',
                          color: '#22c55e', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600
                        }}
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
