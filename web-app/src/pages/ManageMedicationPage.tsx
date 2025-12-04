import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import StorageService from '../services/storage';
import { Medication } from '../types';
import './ManageMedicationPage.css';

export default function ManageMedicationPage() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [dailyTime, setDailyTime] = useState('09:00');
  const [timesPerDay, setTimesPerDay] = useState('1');
  const [interval, setInterval] = useState('24');

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = () => {
    const saved = StorageService.getMedications();
    setMedications(saved);
  };

  const handleAddMedication = async () => {
    if (!searchQuery || !dosage) {
      alert('Please fill in medication name and dosage');
      return;
    }

    const newMedication: Medication = {
      id: Date.now().toString(),
      name: searchQuery,
      dosage: parseFloat(dosage),
      schedule: {
        frequency,
        timesPerDay: parseInt(timesPerDay),
        interval: parseFloat(interval),
        times: [],
      },
    };

    const updated = [...medications, newMedication];
    StorageService.setMedications(updated);
    await ApiService.addMedication('user-id', newMedication);

    setMedications(updated);
    setShowModal(false);
    resetForm();
    alert('Medication added successfully!');
  };

  const resetForm = () => {
    setSearchQuery('');
    setDosage('');
    setFrequency('daily');
    setDailyTime('09:00');
    setTimesPerDay('1');
    setInterval('24');
  };

  const handleLogout = () => {
    StorageService.clearAll();
    navigate('/');
  };

  return (
    <div className="gradient-bg manage-med-page">
      <header className="dashboard-header">
        <div className="logo">PharmaTrack</div>
        <nav className="nav-menu">
          <button className="nav-link" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button className="nav-link active">Manage medication</button>
        </nav>
        <div className="header-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
          <button className="nav-link">Notification</button>
          <button className="nav-link" onClick={() => navigate('/profile')}>
            My profile
          </button>
          <div className="avatar">👤</div>
        </div>
      </header>

      <main className="manage-content">
        <div className="medication-list-container">
          <div className="medication-list">
            {medications.map((med) => (
              <div key={med.id} className="medication-item">
                {med.name}
              </div>
            ))}
            <button className="add-medication-btn" onClick={() => setShowModal(true)}>
              Add a medication!
            </button>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add a medication</h2>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search for your medication"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="form-group">
              <input
                type="number"
                placeholder="Enter dosage (mg)"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Make schedule</label>
              <p className="sublabel">I take this medicine</p>

              <div className="schedule-row">
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="frequency"
                    checked={frequency === 'daily'}
                    onChange={() => setFrequency('daily')}
                  />
                  <span>daily, at</span>
                </label>
                <input
                  type="time"
                  className="time-input"
                  value={dailyTime}
                  onChange={(e) => setDailyTime(e.target.value)}
                />
              </div>

              <div className="schedule-row">
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="frequency"
                    checked={frequency === 'weekly'}
                    onChange={() => setFrequency('weekly')}
                  />
                </label>
                <input
                  type="number"
                  className="small-input"
                  value={timesPerDay}
                  onChange={(e) => setTimesPerDay(e.target.value)}
                />
                <span>times a day, every</span>
                <input
                  type="number"
                  className="small-input"
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                />
                <span className="hours-indent">hours</span>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="modal-btn" onClick={handleAddMedication}>
                Add!
              </button>
              <button
                className="modal-btn cancel"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
