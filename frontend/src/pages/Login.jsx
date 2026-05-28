import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';
import { useToast } from '../components/ToastProvider';
import { login, isLoggedIn } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to login. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="auth-logo">
            <div className="brand-mark">SD</div>
            <div>
              <p className="eyebrow">SafeDoc Generator</p>
              <h2>Sign in to manage your safety documents</h2>
            </div>
          </div>
          <p className="auth-hero-copy">
            Create HIRARC reports, export PDF safety records, and keep every project workflow secure from one modern dashboard.
          </p>
        </div>

        <AuthCard
          title="Login to SafeDoc Generator"
          footer={
            <p>
              New here? <Link to="/register">Create an account</Link>
            </p>
          }
        >
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>
            {error && <div className="alert alert-error">{error}</div>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
};

export default Login;
