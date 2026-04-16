import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchAppointmentById } from '../../api/appointments'
import Spinner from '../../components/ui/Spinner'

export default function SuccessView() {
  const [params] = useSearchParams()
  const id = params.get('id') ?? ''
  const isPending = params.get('pending') === '1'

  const { data: appt, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => fetchAppointmentById(id),
    enabled: !!id
  })

  const waNumber = import.meta.env.VITE_WA_NUMBER || ''
  const waText = appt
    ? encodeURIComponent(
        `Hola! Acabo de reservar mi turno:\n📅 ${appt.date} a las ${appt.timeSlot}\n✂️ ${(appt.service as { name: string }).name} con ${(appt.barber as { name: string }).name}\nNombre: ${appt.clientName}`
      )
    : ''
  const waUrl = `https://wa.me/${waNumber}?text=${waText}`

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Spinner size={36} />
    </div>
  )

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: isPending ? 'rgba(251,191,36,0.1)' : 'rgba(34,197,94,0.1)',
        border: `2px solid ${isPending ? '#FBBF24' : '#22c55e'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem', margin: '0 auto 1.5rem'
      }}>
        {isPending ? '⏳' : '✓'}
      </div>

      <h1 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '1.75rem', marginBottom: '0.5rem' }}>
        {isPending ? 'Pago en proceso' : '¡Turno reservado!'}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        {isPending
          ? 'Tu pago está siendo procesado. Te confirmamos el turno en cuanto acreditemos el pago.'
          : 'Tu turno fue confirmado. Te esperamos!'}
      </p>

      {appt && (
        <div className="card" style={{ padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
          {[
            { label: 'Servicio', value: (appt.service as { name: string }).name },
            { label: 'Barbero', value: (appt.barber as { name: string }).name },
            { label: 'Fecha', value: new Date(appt.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }) },
            { label: 'Horario', value: appt.timeSlot }
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{row.label}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {waNumber && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'block', padding: '0.75rem', fontSize: '0.9rem' }}
          >
            💬 Escribirnos por WhatsApp
          </a>
        )}
        <Link to="/" className="btn-ghost" style={{ textDecoration: 'none', display: 'block', padding: '0.75rem', fontSize: '0.9rem', textAlign: 'center' }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
