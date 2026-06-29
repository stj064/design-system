import { InputHTMLAttributes, ReactNode, useMemo, useState } from 'react'

const CSS = `
.es-field { display: flex; flex-direction: column; gap: var(--space-1_5); }
.es-field__label {
  font: var(--font-label);
  color: var(--text-strong);
  display: flex;
  align-items: center;
  gap: var(--space-1_5);
}
.es-field__req { color: var(--status-danger); font-size: var(--text-sm); }
.es-field__opt { color: var(--text-muted); font-weight: var(--weight-regular); font-size: var(--text-xs); }

.es-input {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: var(--control-h-md);
  padding: 0 var(--space-3);
  background: var(--surface-card);
  border: var(--border-w) solid var(--border-strong);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}
.es-input:hover:not(.is-disabled) { border-color: var(--gray-400); }
.es-input.is-focus { border-color: var(--border-focus); box-shadow: var(--ring); }
.es-input.is-error { border-color: var(--status-danger); }
.es-input.is-error.is-focus { box-shadow: 0 0 0 3px rgba(225, 75, 63, .25); }
.es-input.is-disabled { background: var(--gray-50); border-color: var(--border-default); cursor: not-allowed; }
.es-input--sm { height: var(--control-h-sm); font-size: var(--text-sm); }
.es-input--lg { height: var(--control-h-lg); }

.es-input__el {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  font: var(--font-body);
  color: var(--text-body);
  padding: 0;
}
.es-input__el::placeholder { color: var(--text-muted); }
.es-input__el:disabled { cursor: not-allowed; color: var(--text-disabled); }

.es-input__affix {
  color: var(--text-muted);
  font-size: var(--text-sm);
  display: inline-flex;
  align-items: center;
}
.es-input__affix svg { width: 16px; height: 16px; }

.es-field__hint { font: var(--font-caption); color: var(--text-secondary); }
.es-field__hint.is-error { color: var(--status-danger); }

.es-textarea { min-height: 88px; padding: var(--space-2) var(--space-3); align-items: stretch; }
.es-textarea .es-input__el {
  resize: vertical;
  line-height: var(--leading-normal);
  padding: var(--space-1) 0;
}
`

function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById('es-input-styles')) return
  const s = document.createElement('style')
  s.id = 'es-input-styles'
  s.textContent = CSS
  document.head.appendChild(s)
}

let _uid = 0

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Label rendered above the control. */
  label?: string
  /** Helper text below the control. */
  hint?: string
  /** Error message — overrides hint and paints the control red. */
  error?: string
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg'
  /** Node shown inside, before the text (icon or unit). */
  prefix?: ReactNode
  /** Node shown inside, after the text (icon or unit, e.g. 円). */
  suffix?: ReactNode
  /** Mark label with ＊. @default false */
  required?: boolean
  /** Mark label with a 任意 chip. @default false */
  optional?: boolean
  /** Render a textarea instead of an input. @default false */
  multiline?: boolean
  /** Textarea rows when multiline. @default 3 */
  rows?: number
}

export function Input({
  label,
  hint,
  error,
  size = 'md',
  prefix = null,
  suffix = null,
  required = false,
  optional = false,
  multiline = false,
  rows = 3,
  id,
  className = '',
  ...rest
}: InputProps) {
  ensureStyles()
  const [focus, setFocus] = useState(false)
  const fieldId = useMemo(() => id || `es-input-${++_uid}`, [id])
  const disabled = rest.disabled

  const boxCls = [
    'es-input',
    size !== 'md' ? `es-input--${size}` : '',
    multiline ? 'es-textarea' : '',
    focus ? 'is-focus' : '',
    error ? 'is-error' : '',
    disabled ? 'is-disabled' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={['es-field', className].filter(Boolean).join(' ')}>
      {label && (
        <label className="es-field__label" htmlFor={fieldId}>
          {label}
          {required && <span className="es-field__req" aria-hidden="true">＊</span>}
          {optional && !required && <span className="es-field__opt">任意</span>}
        </label>
      )}
      <div className={boxCls}>
        {prefix && <span className="es-input__affix">{prefix}</span>}
        {multiline ? (
          <textarea
            id={fieldId}
            className="es-input__el"
            aria-invalid={!!error}
            rows={rows}
            onFocus={(e) => { setFocus(true); rest.onFocus?.(e as unknown as React.FocusEvent<HTMLInputElement>) }}
            onBlur={(e) => { setFocus(false); rest.onBlur?.(e as unknown as React.FocusEvent<HTMLInputElement>) }}
            disabled={disabled}
          />
        ) : (
          <input
            id={fieldId}
            className="es-input__el"
            aria-invalid={!!error}
            onFocus={(e) => { setFocus(true); rest.onFocus?.(e) }}
            onBlur={(e) => { setFocus(false); rest.onBlur?.(e) }}
            {...rest}
          />
        )}
        {suffix && <span className="es-input__affix">{suffix}</span>}
      </div>
      {(hint || error) && (
        <span className={['es-field__hint', error ? 'is-error' : ''].filter(Boolean).join(' ')}>
          {error || hint}
        </span>
      )}
    </div>
  )
}
