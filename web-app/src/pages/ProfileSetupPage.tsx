import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import StorageService from '../services/storage';
import './ProfileSetupPage.css';

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | 'prefer-not-to-say' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async (action: 'medication' | 'smartwatch') => {
    if (!name || !age || !height || !weight || !sex) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        id: Date.now().toString(),
        email: '',
        name,
        age: parseInt(age),
        height: parseFloat(height),
        weight: parseFloat(weight),
        sex,
      };

      StorageService.setUserData(userData);
      await ApiService.updateProfile(userData.id, userData);

      if (action === 'medication') {
        navigate('/manage-medication');
      } else {
        alert('Smartwatch connection coming soon!');
        navigate('/dashboard');
      }
    } catch (error) {
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg profile-setup-page">
      <h1 className="title">Fill in your information</h1>

      <div className="profile-card">
        <div className="form-group">
          <label>What should we call you?</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <div className="button-group">
          <button
            className="action-btn"
            onClick={() => handleContinue('medication')}
            disabled={loading}
          >
            Add a medication
          </button>
          <button
            className="action-btn"
            onClick={() => handleContinue('smartwatch')}
            disabled={loading}
          >
            Connect with your smart watch
          </button>
        </div>
      </div>
    </div>
  );
}
