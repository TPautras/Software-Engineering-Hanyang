import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StorageService from '../services/storage';
import { User } from '../types';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | 'prefer-not-to-say'>('male');

  useEffect(() => {
    const userData = StorageService.getUserData();
    if (userData) {
      setUser(userData);
      setName(userData.name);
      setAge(userData.age.toString());
      setHeight(userData.height.toString());
      setWeight(userData.weight.toString());
      setSex(userData.sex);
    }
  }, []);

  const handleSave = () => {
    if (!name || !age || !height || !weight) {
      alert('Please fill in all fields');
      return;
    }

    const updatedUser: User = {
      id: user?.id || Date.now().toString(),
      email: user?.email || '',
      name,
      age: parseInt(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
      sex,
    };

    StorageService.setUserData(updatedUser);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    StorageService.clearAll();
    navigate('/');
  };

  return (
    <div className="gradient-bg profile-page">
      <header className="dashboard-header">
        <div className="logo">logo here!</div>
        <nav className="nav-menu">
          <button className="nav-link" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button className="nav-link" onClick={() => navigate('/manage-medication')}>
            Manage medication
          </button>
        </nav>
        <div className="header-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
          <button className="nav-link active">My profile</button>
          <div className="avatar">👤</div>
        </div>
      </header>

      <main className="profile-content">
        <h1 className="title">My Profile</h1>

        <div className="profile-card">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={user?.email || ''}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Height (cm)</label>
            <input
              type="number"
              placeholder="Enter your height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              placeholder="Enter your weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Sex</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="sex"
                  checked={sex === 'male'}
                  onChange={() => setSex('male')}
                />
                <span>Male</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="sex"
                  checked={sex === 'female'}
                  onChange={() => setSex('female')}
                />
                <span>Female</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="sex"
                  checked={sex === 'prefer-not-to-say'}
                  onChange={() => setSex('prefer-not-to-say')}
                />
                <span>Prefer not to say</span>
              </label>
            </div>
          </div>

          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}
