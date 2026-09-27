import { X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState, type FormEvent, type ReactNode } from 'react';

export function Modal({ open, title, children, onClose, wide = false, fullScreen = false, eyebrow = 'Marques Works' }: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
  fullScreen?: boolean;
  eyebrow?: string;
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal-card ${wide ? 'modal-wide' : ''} ${fullScreen ? 'modal-fullscreen' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-header">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        </header>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', destructive = false, onConfirm, onClose }: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="muted">{message}</p>
      <div className="form-actions">
        <button className="button ghost" type="button" onClick={onClose}>Volver</button>
        <button className={`button ${destructive ? 'danger' : 'primary'}`} type="button" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}

type ToastKind = 'success' | 'error' | 'info';
interface ToastItem { id: number; text: string; kind: ToastKind }
const ToastContext = createContext<(text: string, kind?: ToastKind) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const show = useCallback((text: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random();
    setItems((current) => [...current, { id, text, kind }]);
    window.setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 3200);
  }, []);
  const value = useMemo(() => show, [show]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {items.map((item) => <div className={`toast ${item.kind}`} key={item.id}>{item.text}</div>)}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

export function EmptyState({ icon, title, text, action }: { icon?: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-icon">{icon}</div>}
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label className="toggle-row">
      <button className={`toggle ${checked ? 'on' : ''}`} type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}>
        <span />
      </button>
      <span>{label}</span>
    </label>
  );
}

export function Form({ children, onSubmit, className = '' }: { children: ReactNode; onSubmit: () => void; className?: string }) {
  const submit = (event: FormEvent) => { event.preventDefault(); onSubmit(); };
  return <form className={className} onSubmit={submit}>{children}</form>;
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().replaceAll(' ', '-').replaceAll('_', '-');
  const labels: Record<string, string> = {
    pending: 'Pendiente', confirmed: 'Confirmada', completed: 'Completada', cancelled: 'Cancelada', no_show: 'No-show',
  };
  return <span className={`status status-${normalized}`}>{labels[status] ?? status}</span>;
}
