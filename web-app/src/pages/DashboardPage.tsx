import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ApiService from '../services/api';
import StorageService from '../services/storage';
import { Colors } from '../constants/colors';
import './DashboardPage.css';

const chartData = [
  { time: '21:00', concentration: 0.5, sideEffect: 0.3 },
  { time: '21:40', concentration: 1.2, sideEffect: 0.8 },
  { time: '22:11', concentration: 2.0, sideEffect: 1.2 },
  { time: '23:10', concentration: 1.5, sideEffect: 1.0 },
  { time: '9:00', concentration: 0.8, sideEffect: 0.5 },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const handleLogout = () => {
    StorageService.clearAll();
    navigate('/');
  };

  const handleTakeMedicine = () => {
    if (confirm('Record that you took your medication?')) {
      alert('Medication recorded!');
    }
  };

  const handleCancelAdministration = () => {
    if (confirm('Cancel the scheduled medication?')) {
      alert('Medication cancelled');
    }
  };

  const handleRefresh = async () => {
    try {
      const sequence = Array(10).fill([0.8]);
      const prediction = await ApiService.getPrediction(sequence);
      alert(`Updated!\nEffect: ${prediction.effect.toFixed(2)}\nSide Effect: ${prediction.sideEffect.toFixed(2)}`);
    } catch (error) {
      alert('Failed to fetch predictions');
    }
  };

  return (
    <div className="gradient-bg dashboard-page">
      <header className="dashboard-header">
        <div className="logo">logo here!</div>
        <nav className="nav-menu">
          <button className="nav-link active">Dashboard</button>
          <button className="nav-link" onClick={() => navigate('/manage-medication')}>
            Manage medication
          </button>
        </nav>
        <div className="header-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
          <div className="notification-wrapper">
            <button
              className="nav-link"
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            >
              Notification
            </button>
            {showNotificationDropdown && (
              <div className="dropdown">
                <button className="dropdown-item on">Turn on</button>
                <button className="dropdown-item off">Turn off</button>
              </div>
            )}
          </div>
          <button className="nav-link" onClick={() => navigate('/profile')}>
            My profile
          </button>
          <div className="avatar">👤</div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="left-panel">
          <div className="card">
            <h2 className="medicine-name">MEDICINE NAME HERE</h2>
            <p className="concentration">
              Current concentration: <strong>0.01 ng/ml</strong>
            </p>
            <p className="update-time">update: just now</p>

            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: Colors.concentrationLine }} />
                <span>concentration</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: Colors.sideEffectLine }} />
                <span>side effect</span>
              </div>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="concentration"
                    stroke={Colors.concentrationLine}
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="sideEffect"
                    stroke={Colors.sideEffectLine}
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="history-section">
              <h3>history</h3>
              <div className="history-list">
                <p>Date, day, time (just now)</p>
                <p>Date, day, time (a day ago)</p>
                <p>Date, day, time (2 days ago)</p>
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-button" onClick={handleTakeMedicine}>
                Take a medicine
              </button>
              <button className="action-button" onClick={handleCancelAdministration}>
                Cancel administration
              </button>
              <button className="action-button" onClick={handleRefresh}>
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="card">
            <h3 className="side-effects-title">Side effects predictions</h3>
            <div className="peak-window">
              <p>Peak window: 21:40 - 23:10</p>
            </div>
            <h4>Expect:</h4>
            <ul className="effects-list">
              <li>drowsiness</li>
              <li>dry mouth</li>
              <li>cognitive slowdown</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
