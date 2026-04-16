import { Link } from 'react-router-dom'

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const fontSize = size === 'sm' ? '1.1rem' : size === 'lg' ? '1.6rem' : '1.3rem'
  return (
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <span style={{
        fontFamily: 'Fraunces, serif',
        fontWeight: 700,
        fontStyle: 'italic',
        fontSize,
        color: 'var(--text)',
        letterSpacing: '-0.02em',
        lineHeight: 1
      }}>
        Barber<span style={{ color: 'var(--gold)' }}>Shop</span>
      </span>
    </Link>
  )
}
