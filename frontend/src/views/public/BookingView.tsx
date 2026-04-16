import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createAppointment } from '../../api/appointments'
import { BookingState, BookingStep, Barber, Service } from '../../types'
import StepService from '../../components/booking/StepService'
import StepBarber from '../../components/booking/StepBarber'
import StepCalendar from '../../components/booking/StepCalendar'
import StepClientInfo from '../../components/booking/StepClientInfo'
import StepConfirm from '../../components/booking/StepConfirm'

const STEPS: { key: BookingStep; label: string }[] = [
  { key: 'service', label: 'Servicio' },
  { key: 'barber', label: 'Barbero' },
  { key: 'calendar', label: 'Fecha' },
  { key: 'info', label: 'Datos' },
  { key: 'confirm', label: 'Confirmar' }
]

const STEP_ORDER: BookingStep[] = ['service', 'barber', 'calendar', 'info', 'confirm']

export default function BookingView() {
  const navigate = useNavigate()
  const [step, setStep] = useState<BookingStep>('service')
  const [booking, setBooking] = useState<BookingState>({
    service: null, barber: null, date: '', timeSlot: '', clientName: '', clientPhone: ''
  })
  const [error, setError] = useState('')

  const currentIndex = STEP_ORDER.indexOf(step)

  const { mutate, isPending } = useMutation({
    mutationFn: () => createAppointment({
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      serviceId: booking.service!._id,
      barberId: booking.barber!._id,
      date: booking.date,
      timeSlot: booking.timeSlot
    }),
    onSuccess: ({ appointment, paymentUrl }) => {
      if (paymentUrl) {
        window.location.href = paymentUrl
      } else {
        setError('No se pudo generar el link de pago. Intentá de nuevo.')
      }
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Error al confirmar el turno')
    }
  })

  const canNext = (): boolean => {
    if (step === 'service') return !!booking.service
    if (step === 'barber') return !!booking.barber
    if (step === 'calendar') return !!booking.date && !!booking.timeSlot
    if (step === 'info') return !!booking.clientName.trim() && !!booking.clientPhone.trim()
    return false
  }

  const next = () => {
    if (currentIndex < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[currentIndex + 1])
    }
  }
  const back = () => {
    if (currentIndex > 0) setStep(STEP_ORDER[currentIndex - 1])
  }

  return (
    <div className="booking-container">
      {/* Progress */}
      <div className="booking-steps">
        <div style={{ display: 'flex', gap: '0', alignItems: 'stretch', width: '100%', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
          {STEPS.map((s, i) => (
            <div key={s.key} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', paddingBottom: '0.75rem',
              position: 'relative'
            }}>
              {/* Active indicator bar */}
              <div style={{
                position: 'absolute', bottom: -1, left: 0, right: 0,
                height: 2,
                background: i === currentIndex ? 'var(--gold)' : i < currentIndex ? 'rgba(155,122,66,0.4)' : 'transparent',
                transition: 'background 0.2s'
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.65rem',
                  color: i < currentIndex ? 'var(--gold)' : i === currentIndex ? 'var(--gold)' : 'var(--text-muted)',
                  transition: 'color 0.2s'
                }}>
                  {i < currentIndex ? '✓' : String(i + 1).padStart(2, '0')}
                </span>
                <span className="step-label" style={{
                  color: i === currentIndex ? 'var(--text)' : i < currentIndex ? 'var(--text-muted)' : 'var(--text-muted)',
                  opacity: i === currentIndex ? 1 : 0.6
                }}>
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div style={{ marginBottom: '2rem' }}>
        {step === 'service' && (
          <StepService
            selected={booking.service}
            onSelect={(s: Service) => setBooking(b => ({ ...b, service: s, barber: null, date: '', timeSlot: '' }))}
          />
        )}
        {step === 'barber' && (
          <StepBarber
            selected={booking.barber}
            onSelect={(b: Barber) => setBooking(bk => ({ ...bk, barber: b, date: '', timeSlot: '' }))}
          />
        )}
        {step === 'calendar' && booking.barber && booking.service && (
          <StepCalendar
            barber={booking.barber}
            service={booking.service}
            selectedDate={booking.date}
            selectedSlot={booking.timeSlot}
            onSelect={(date, slot) => setBooking(b => ({ ...b, date, timeSlot: slot }))}
          />
        )}
        {step === 'info' && (
          <StepClientInfo
            clientName={booking.clientName}
            clientPhone={booking.clientPhone}
            onChange={(field, value) => setBooking(b => ({ ...b, [field]: value }))}
          />
        )}
        {step === 'confirm' && (
          <StepConfirm
            booking={booking}
            isLoading={isPending}
            error={error}
            onConfirm={() => { setError(''); mutate() }}
          />
        )}
      </div>

      {/* Navigation */}
      {step !== 'confirm' && (
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <button className="btn-ghost" onClick={back} disabled={currentIndex === 0} style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}>
            ← Anterior
          </button>
          <button className="btn-primary" onClick={next} disabled={!canNext()}>
            {currentIndex === STEP_ORDER.length - 2 ? 'Revisar reserva →' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  )
}
