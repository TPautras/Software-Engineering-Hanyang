import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import StorageService from '../services/storage';
import './AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.login(email, password);
      StorageService.setAuthToken(response.token);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg auth-page">
      <div className="auth-content">
        <div className="logo">logo here!</div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="Enter your e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter you password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <div className="auth-footer">
            <p>Do not have an account yet?</p>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="link-button"
            >
              Sign up here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
