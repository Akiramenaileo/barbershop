import { useQuery } from '@tanstack/react-query'
import { fetchAppointments } from '../../api/appointments'
import Spinner from '../../components/ui/Spinner'
import { Appointment } from '../../types'

const token = () => localStorage.getItem('barber_token') ?? ''

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: 'Pago pendiente', color: '#FBBF24' },
  confirmed: { label: 'Confirmado', color: '#22c55e' },
  cancelled: { label: 'Cancelado', color: '#f87171' },
  completed: { label: 'Completado', color: '#60a5fa' }
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function DashboardView() {
  const { data: allAppts, isLoading } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: () => fetchAppointments(token())
  })

  const today = todayStr()
  const todayAppts = allAppts?.filter(a => a.date === today) ?? []
  const pendingCount = allAppts?.filter(a => a.status === 'pending_payment').length ?? 0
  const confirmedCount = allAppts?.filter(a => a.status === 'confirmed').length ?? 0
  const completedCount = allAppts?.filter(a => a.status === 'completed').length ?? 0

  return (
    <div>
      <h1 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Turnos hoy', value: todayAppts.length, color: 'var(--accent)' },
          { label: 'Pago pendiente', value: pendingCount, color: '#FBBF24' },
          { label: 'Confirmados', value: confirmedCount, color: '#22c55e' },
          { label: 'Completados', value: completedCount, color: '#60a5fa' }
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Today's appointments */}
      <div>
        <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>Turnos de hoy</h2>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spinner /></div>
        ) : !todayAppts.length ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No hay turnos para hoy
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {todayAppts.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot)).map((appt: Appointment) => {
              const statusInfo = STATUS_LABELS[appt.status]
              return (
                <div key={appt._id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--accent)', minWidth: 44 }}>{appt.timeSlot}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{appt.clientName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {(appt.service as { name: string }).name} · {(appt.barber as { name: string }).name}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600,
                    color: statusInfo.color, background: `${statusInfo.color}18`,
                    padding: '0.25rem 0.625rem', borderRadius: 999
                  }}>
                    {statusInfo.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
