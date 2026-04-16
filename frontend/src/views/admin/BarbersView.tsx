import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllBarbers, createBarber, updateBarber, deleteBarber } from '../../api/barbers'
import { Barber } from '../../types'
import Spinner from '../../components/ui/Spinner'

const token = () => localStorage.getItem('barber_token') ?? ''

const DAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
] as const

type DayKey = typeof DAYS[number]['key']

type BarberForm = {
  name: string
  bio: string
  photo: string
  active: boolean
  schedule: Record<DayKey, { enabled: boolean; start: string; end: string }>
}

const emptyForm = (): BarberForm => ({
  name: '', bio: '', photo: '', active: true,
  schedule: Object.fromEntries(DAYS.map(d => [d.key, {
    enabled: d.key !== 'sunday',
    start: '09:00',
    end: d.key === 'saturday' ? '14:00' : '19:00'
  }])) as BarberForm['schedule']
})

export default function BarbersView() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Barber | null>(null)
  const [form, setForm] = useState<BarberForm>(emptyForm())

  const { data: barbers, isLoading } = useQuery({ queryKey: ['admin-barbers'], queryFn: () => fetchAllBarbers(token()) })

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => editing
      ? updateBarber(token(), editing._id, form)
      : createBarber(token(), form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-barbers'] }); qc.invalidateQueries({ queryKey: ['barbers'] }); reset() }
  })

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => deleteBarber(token(), id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-barbers'] }); qc.invalidateQueries({ queryKey: ['barbers'] }) }
  })

  const reset = () => { setShowForm(false); setEditing(null); setForm(emptyForm()) }

  const startEdit = (b: Barber) => {
    setEditing(b)
    setForm({ name: b.name, bio: b.bio, photo: b.photo, active: b.active, schedule: b.schedule as BarberForm['schedule'] })
    setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.5rem' }}>Barberos</h1>
        <button className="btn-primary" onClick={() => { reset(); setShowForm(true) }} style={{ fontSize: '0.875rem' }}>
          + Nuevo barbero
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {barbers?.map(b => (
            <div key={b._id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'var(--bg-hover)', border: '1px solid var(--border)',
                  overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {b.photo ? <img src={b.photo} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>✂️</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{b.name}</div>
                  <div style={{ fontSize: '0.75rem', color: b.active ? '#22c55e' : 'var(--text-muted)' }}>
                    {b.active ? 'Activo' : 'Inactivo'}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>{b.bio || '—'}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-ghost" style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }} onClick={() => startEdit(b)}>Editar</button>
                <button
                  onClick={() => confirm('¿Eliminar barbero?') && remove(b._id)}
                  style={{
                    padding: '0.4rem 0.75rem', borderRadius: 8, border: '1px solid var(--border)',
                    background: 'transparent', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', padding: '1.75rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
              {editing ? 'Editar barbero' : 'Nuevo barbero'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {(['name', 'bio', 'photo'] as const).map(f => (
                <div key={f}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', textTransform: 'capitalize' }}>
                    {f === 'photo' ? 'URL de foto' : f === 'bio' ? 'Descripción' : 'Nombre'}
                  </label>
                  {f === 'bio' ? (
                    <textarea rows={2} value={form[f]} onChange={e => setForm(fm => ({ ...fm, [f]: e.target.value }))} />
                  ) : (
                    <input type="text" value={form[f]} onChange={e => setForm(fm => ({ ...fm, [f]: e.target.value }))} />
                  )}
                </div>
              ))}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm(fm => ({ ...fm, active: e.target.checked }))} style={{ width: 'auto' }} />
                Activo
              </label>
              {/* Schedule */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Horarios</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {DAYS.map(({ key, label }) => {
                    const day = form.schedule[key]
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', width: 90, cursor: 'pointer' }}>
                          <input type="checkbox" checked={day.enabled} style={{ width: 'auto' }}
                            onChange={e => setForm(fm => ({ ...fm, schedule: { ...fm.schedule, [key]: { ...day, enabled: e.target.checked } } }))} />
                          {label}
                        </label>
                        {day.enabled && (
                          <>
                            <input type="time" value={day.start} style={{ width: 100, padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                              onChange={e => setForm(fm => ({ ...fm, schedule: { ...fm.schedule, [key]: { ...day, start: e.target.value } } }))} />
                            <span style={{ color: 'var(--text-muted)' }}>a</span>
                            <input type="time" value={day.end} style={{ width: 100, padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                              onChange={e => setForm(fm => ({ ...fm, schedule: { ...fm.schedule, [key]: { ...day, end: e.target.value } } }))} />
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={reset}>Cancelar</button>
              <button className="btn-primary" onClick={() => save()} disabled={!form.name.trim() || isPending}>
                {isPending ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
