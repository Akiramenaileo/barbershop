import { useState } from 'react'

interface Props {
  clientName: string
  clientPhone: string
  onChange: (field: 'clientName' | 'clientPhone', value: string) => void
}

export default function StepClientInfo({ clientName, clientPhone, onChange }: Props) {
  const [touched, setTouched] = useState({ name: false, phone: false })

  return (
    <div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.4rem' }}>Tus datos</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Ingresá tu nombre y número para confirmar el turno.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 400 }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            Nombre completo
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={clientName}
            onChange={e => onChange('clientName', e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, name: true }))}
          />
          {touched.name && !clientName.trim() && (
            <span style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.25rem', display: 'block' }}>
              Ingresá tu nombre
            </span>
          )}
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            Teléfono / WhatsApp
          </label>
          <input
            type="tel"
            placeholder="Ej: 3816000000"
            value={clientPhone}
            onChange={e => onChange('clientPhone', e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, phone: true }))}
          />
          {touched.phone && !clientPhone.trim() && (
            <span style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.25rem', display: 'block' }}>
              Ingresá tu teléfono
            </span>
          )}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            Te enviaremos la confirmación por WhatsApp
          </span>
        </div>
      </div>
    </div>
  )
}
