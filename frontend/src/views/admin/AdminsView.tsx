import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdmins, createAdmin, deleteAdmin } from '../../api/auth'
import { Admin } from '../../types'
import Spinner from '../../components/ui/Spinner'

const token = () => localStorage.getItem('barber_token') ?? ''

export default function AdminsView() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const { data: admins, isLoading } = useQuery({ queryKey: ['admins'], queryFn: () => fetchAdmins(token()) })

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => createAdmin(token(), form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); setShowForm(false); setForm({ name: '', email: '', password: '' }) },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Error al crear admin')
    }
  })

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => deleteAdmin(token(), id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admins'] })
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.5rem' }}>Administradores</h1>
        <button className="btn-primary" onClick={() => { setShowForm(true); setError('') }} style={{ fontSize: '0.875rem' }}>
          + Nuevo admin
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 560 }}>
          {admins?.map((a: Admin) => (
            <div key={a.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: 'rgba(212,160,23,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: 'var(--clr-accent)', fontSize: '0.85rem', flexShrink: 0
              }}>
                {a.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.email}</div>
              </div>
              <button
                onClick={() => confirm('¿Eliminar admin?') && remove(a.id)}
                style={{ padding: '0.35rem 0.75rem', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: 400, padding: '1.75rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>Nuevo administrador</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { key: 'name', label: 'Nombre', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'password', label: 'Contraseña', type: 'password' }
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>{label}</label>
                  <input type={type} value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              {error && <p style={{ fontSize: '0.8rem', color: '#f87171' }}>{error}</p>}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="btn-primary" onClick={() => save()} disabled={!form.name || !form.email || !form.password || isPending}>
                {isPending ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
