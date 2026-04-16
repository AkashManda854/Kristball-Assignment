import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@mil.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await auth.login(email, password);
      navigate('/');
    } catch (loginError) {
      setError(loginError?.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur md:grid md:grid-cols-2">
        <div className="p-8 md:p-12 bg-grid-fade">
          <div className="text-xs uppercase tracking-[0.45em] text-brass/90">Secure Entry</div>
          <h1 className="mt-4 text-4xl font-semibold text-white">Military Asset Management System</h1>
          <p className="mt-4 max-w-md text-sand/75">
            Track purchases, transfers, assignments, and expenditure across bases with role-aware controls and audit logging.
          </p>
          <div className="mt-10 grid gap-3 text-sm text-sand/70">
            <div>Admin: admin@mil.com / password123</div>
            <div>Commander: commander@mil.com / password123</div>
            <div>Logistics: logistics@mil.com / password123</div>
          </div>
        </div>
        <div className="p-8 md:p-12 bg-slate-950/70">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold text-white">Login</h2>
              <p className="mt-2 text-sm text-sand/65">Use JWT-backed authentication to access the control room.</p>
            </div>
            <div>
              <label className="block text-sm text-sand/75 mb-2">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brass" />
            </div>
            <div>
              <label className="block text-sm text-sand/75 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brass" />
            </div>
            {error ? <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
            <button disabled={submitting} className="w-full rounded-2xl bg-brass px-4 py-3 font-semibold text-ink transition hover:brightness-110 disabled:opacity-70">
              {submitting ? 'Signing in...' : 'Enter System'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
