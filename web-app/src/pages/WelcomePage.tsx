import { useNavigate } from 'react-router-dom';
import { Colors } from '../constants/colors';
import './WelcomePage.css';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="gradient-bg welcome-page">
      <header className="welcome-header">
        <div className="logo">PharmaTrack</div>
        <div className="header-buttons">
          <button className="header-btn" onClick={() => navigate('/login')}>
            Log in
          </button>
          <button className="header-btn" onClick={() => navigate('/signup')}>
            Sign up
          </button>
        </div>
      </header>

      <main className="welcome-content">
        <h1 className="tagline">
          TRACK HOW YOUR BODY<br />RESPONDS TO MEDICATION!
        </h1>
      </main>
    </div>
  );
}
