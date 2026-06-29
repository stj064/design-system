import { ButtonHTMLAttributes, ReactNode } from 'react'

const CSS = `
.es-btn {
  --_h: var(--control-h-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-inline);
  height: var(--_h);
  padding: 0 var(--space-4);
  font: var(--weight-bold) var(--text-base)/1 var(--font-sans);
  letter-spacing: .01em;
  border: var(--border-w) solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: var(--transition-base);
}
.es-btn:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}
.es-btn[disabled] {
  cursor: not-allowed;
  opacity: .5;
  box-shadow: none;
}
.es-btn--full { width: 100%; }
.es-btn--sm {
  --_h: var(--control-h-sm);
  padding: 0 var(--space-3);
  font-size: var(--text-sm);
}
.es-btn--lg {
  --_h: var(--control-h-lg);
  padding: 0 var(--space-6);
  font-size: var(--text-md);
}
.es-btn__icon { display: inline-flex; width: 1.05em; height: 1.05em; }
.es-btn__icon svg { width: 100%; height: 100%; }

/* primary — かぜ blue */
.es-btn--primary { background: var(--color-primary); color: var(--color-on-primary); }
.es-btn--primary:hover:not([disabled]) { background: var(--color-primary-hover); }
.es-btn--primary:active:not([disabled]) { background: var(--color-primary-active); }

/* secondary — outlined */
.es-btn--secondary {
  background: var(--surface-card);
  color: var(--text-strong);
  border-color: var(--border-strong);
}
.es-btn--secondary:hover:not([disabled]) {
  background: var(--surface-hover);
  border-color: var(--gray-400);
}
.es-btn--secondary:active:not([disabled]) { background: var(--gray-100); }

/* ghost — text only */
.es-btn--ghost { background: transparent; color: var(--color-primary); }
.es-btn--ghost:hover:not([disabled]) { background: var(--color-primary-soft); }
.es-btn--ghost:active:not([disabled]) { background: var(--blue-100); }

/* danger */
.es-btn--danger { background: var(--status-danger); color: #fff; }
.es-btn--danger:hover:not([disabled]) { background: var(--red-600); }
.es-btn--danger:active:not([disabled]) { background: var(--red-700); }

.es-btn__spin {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: es-btn-spin .6s linear infinite;
}
@keyframes es-btn-spin { to { transform: rotate(360deg); } }
`

function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById('es-btn-styles')) return
  const s = document.createElement('style')
  s.id = 'es-btn-styles'
  s.textContent = CSS
  document.head.appendChild(s)
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis. `primary` = かぜ blue fill. @default "primary" */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Control height. @default "md" */
  size?: 'sm' | 'md' | 'lg'
  /** Show a spinner and block interaction. @default false */
  loading?: boolean
  /** Stretch to the container width. @default false */
  fullWidth?: boolean
  /** Icon node rendered before the label. */
  iconLeft?: ReactNode
  /** Icon node rendered after the label. */
  iconRight?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  ensureStyles()

  const cls = [
    'es-btn',
    `es-btn--${variant}`,
    size !== 'md' ? `es-btn--${size}` : '',
    fullWidth ? 'es-btn--full' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button type={type} className={cls} disabled={disabled || loading} {...rest}>
      {loading && <span className="es-btn__spin" aria-hidden="true" />}
      {!loading && iconLeft && <span className="es-btn__icon">{iconLeft}</span>}
      {children != null && <span>{children}</span>}
      {!loading && iconRight && <span className="es-btn__icon">{iconRight}</span>}
    </button>
  )
}
