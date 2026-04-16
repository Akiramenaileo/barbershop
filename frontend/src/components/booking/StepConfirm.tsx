import { BookingState } from '../../types'

interface Props {
  booking: BookingState
  isLoading: boolean
  error: string
  onConfirm: () => void
}

export default function StepConfirm({ booking, isLoading, error, onConfirm }: Props) {
  const date = booking.date
    ? new Date(booking.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.4rem' }}>Confirmá tu turno</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Revisá los datos antes de confirmar. Al hacerlo, recibirás el link de pago de la seña.
      </p>

      <div className="card" style={{ padding: '1.5rem', maxWidth: 480, marginBottom: '1.5rem' }}>
        {[
          { label: 'Servicio', value: booking.service?.name },
          { label: 'Barbero', value: booking.barber?.name },
          { label: 'Fecha', value: date },
          { label: 'Horario', value: booking.timeSlot },
          { label: 'Nombre', value: booking.clientName },
          { label: 'Teléfono', value: booking.clientPhone },
          { label: 'Precio', value: booking.service ? `$${booking.service.price.toLocaleString('es-AR')}` : '' },
          { label: 'Seña', value: booking.service?.depositAmount ? `$${booking.service.depositAmount.toLocaleString('es-AR')} (MercadoPago)` : 'Sin seña' }
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.6rem 0',
            borderBottom: '1px solid var(--border)'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{row.label}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{row.value}</span>
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
          borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem',
          fontSize: '0.875rem', color: '#f87171'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 320 }}>
        <button
          className="btn-primary"
          onClick={onConfirm}
          disabled={isLoading}
          style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
        >
          {isLoading ? 'Procesando...' : '💳 Pagar seña y confirmar →'}
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          El turno se confirma una vez acreditada la seña por MercadoPago
        </span>
      </div>
    </div>
  )
}
