import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllServices, createService, updateService, deleteService } from '../../api/services'
import { Service } from '../../types'
import Spinner from '../../components/ui/Spinner'

const token = () => localStorage.getItem('barber_token') ?? ''

type ServiceForm = { name: string; description: string; price: string; duration: string; depositAmount: string; active: boolean }

const emptyForm = (): ServiceForm => ({ name: '', description: '', price: '', duration: '30', depositAmount: '0', active: true })

export default function ServicesView() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<ServiceForm>(emptyForm())

  const { data: services, isLoading } = useQuery({ queryKey: ['admin-services'], queryFn: () => fetchAllServices(token()) })

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => {
      const body = { name: form.name, description: form.description, price: Number(form.price), duration: Number(form.duration), depositAmount: Number(form.depositAmount), active: form.active }
      return editing ? updateService(token(), editing._id, body) : createService(token(), body)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); qc.invalidateQueries({ queryKey: ['services'] }); reset() }
  })

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => deleteService(token(), id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); qc.invalidateQueries({ queryKey: ['services'] }) }
  })

  const reset = () => { setShowForm(false); setEditing(null); setForm(emptyForm()) }

  const startEdit = (s: Service) => {
    setEditing(s)
    setForm({ name: s.name, description: s.description, price: String(s.price), duration: String(s.duration), depositAmount: String(s.depositAmount), active: s.active })
    setShowForm(true)
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ fontWeight: 700, fontSize: '1.5rem' }}>Servicios</h1>
        <button className="btn-primary" onClick={() => { reset(); setShowForm(true) }} style={{ fontSize: '0.875rem' }}>
          + Nuevo servicio
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {services?.map(s => (
            <div key={s._id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                  {!s.active && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '0.15rem 0.4rem', borderRadius: 999 }}>Inactivo</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {s.description}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.85rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--clr-accent)' }}>${s.price.toLocaleString('es-AR')}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.duration} min</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Seña</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: 'var(--text-muted)' }}>${s.depositAmount.toLocaleString('es-AR')}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }} onClick={() => startEdit(s)}>Editar</button>
                <button
                  onClick={() => confirm('¿Eliminar servicio?') && remove(s._id)}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: '1.75rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
              {editing ? 'Editar servicio' : 'Nuevo servicio'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Nombre</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Descripción</label>
                <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                {[
                  { key: 'price', label: 'Precio ($)' },
                  { key: 'duration', label: 'Duración (min)' },
                  { key: 'depositAmount', label: 'Seña ($)' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>{label}</label>
                    <input type="number" min="0" value={form[key as keyof ServiceForm] as string}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} style={{ width: 'auto' }} />
                Activo
              </label>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={reset}>Cancelar</button>
              <button className="btn-primary" onClick={() => save()} disabled={!form.name.trim() || !form.price || isPending}>
                {isPending ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
