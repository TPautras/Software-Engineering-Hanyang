import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import StorageService from '../services/storage';
import './AuthPages.css';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.signup(email, password);
      StorageService.setAuthToken(response.token);
      navigate('/profile-setup');
    } catch (error) {
      alert('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg-center auth-page">
      <div className="auth-content">
        <div className="logo">PharmaTrack</div>

        <form className="auth-form" onSubmit={handleSignUp}>
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

          <div className="form-group">
            <label>Confirm your password</label>
            <input
              type="password"
              placeholder="Enter you password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>

          <div className="auth-footer">
            <p>Already have an account?</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="link-button"
            >
              Log in here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
