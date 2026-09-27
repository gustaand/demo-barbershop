import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import type { DemoId, Plan } from '../../../types';
import { useDemo } from '../../../store/DemoContext';

export function LoginPage({ demoId, plan, onLogin }: { demoId: DemoId; plan: Plan; onLogin: () => void }) {
  const { config, appearance } = useDemo();
  const [email, setEmail] = useState('marquesworks.mw@gmail.com');
  const [password, setPassword] = useState('mw2026');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const imagePack = config.imagePacks.find((item) => item.id === appearance.imagePackId) ?? config.imagePacks[0];

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email.trim().toLowerCase() === 'marquesworks.mw@gmail.com' && password === 'mw2026') { setError(''); onLogin(); }
    else setError('Las credenciales no coinciden con las de la demo.');
  };

  return (
    <main className={`login-page ${demoId === 'belleza' ? 'login-minimal-beauty' : ''}`} data-panel-variant={demoId === 'belleza' ? 'minimalBeauty' : 'classic'}>
      <section className="login-card">
        <div className="login-brand"><span><img src="/images/marques-works-logo-gold.png" alt="" /></span><div><strong>Marques Works</strong><small>Panel de reservas</small></div></div>
        <div className="login-heading"><span className={`plan-pill ${plan}`}>Plan {plan === 'managed' ? 'Managed' : 'Essential'}</span><h1>Bienvenido de nuevo</h1><p>Accede al panel de demostración de {appearance.businessName}.</p></div>
        <form onSubmit={submit}>
          <label className="field"><span className="field-label">Email</span><span className="input-with-icon"><Mail size={18} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></span></label>
          <label className="field"><span className="field-label">Contraseña</span><span className="input-with-icon"><LockKeyhole size={18} /><input type={visible ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /><button type="button" onClick={() => setVisible(!visible)} aria-label="Mostrar contraseña">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
          {error && <p className="inline-error">{error}</p>}
          <button className="button primary full" type="submit">Entrar al panel</button>
        </form>
        <div className="demo-credentials"><strong>Credenciales de demostración</strong><p>marquesworks.mw@gmail.com</p><p>mw2026</p></div>
        <p className="login-security"><ShieldCheck size={16} /> Acceso ficticio para esta demo local. No es autenticación de producción.</p>
        <a className="text-link" href={`/demo/${demoId}`}>← Volver a la web pública</a>
      </section>
      <aside className={`login-visual login-visual-${demoId}`} style={{ backgroundImage: `${demoId === 'belleza' ? 'linear-gradient(180deg, rgba(49,52,47,.03), rgba(45,49,43,.62))' : 'linear-gradient(180deg, rgba(15,10,7,.15), rgba(11,8,6,.84))'}, url(${imagePack.hero})` }}><span>Tu negocio,<br /><em>bajo control.</em></span><p>Reservas claras. Gestión sencilla. Más tiempo para tus clientes.</p></aside>
    </main>
  );
}
