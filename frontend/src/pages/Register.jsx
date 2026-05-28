import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';
import { useToast } from '../components/ToastProvider';
import { register } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register({ name, email, password });
      setSuccess('Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to register. Please try again.';
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
              <h2>Start your safety workflow</h2>
            </div>
          </div>
          <p className="auth-hero-copy">
            Sign up to generate HIRARC safety documentation, preview exports, and work from a polished modern tool built for site safety.
          </p>
        </div>

        <AuthCard
          title="Create your SafeDoc account"
          footer={
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          }
        >
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </label>
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
                placeholder="Create a password"
                required
                minLength={8}
              />
            </label>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
};

export default Register;
