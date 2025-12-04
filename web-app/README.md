# PharmaTrack Web Application

A modern web application for personalized pharmacokinetic modeling and adverse effect prediction.

## Features

- **User Authentication**: Email/password login and registration
- **Profile Management**: Store and update user biometric data
- **Medication Management**: Add, view, and schedule medications
- **Prediction Dashboard**: Interactive charts showing drug concentration and side effects
- **Real-time Updates**: Connect to AI backend for personalized predictions

## Tech Stack

- **React 18.3** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API calls
- **LocalStorage** for client-side data persistence

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- AI Backend running at `http://localhost:8000` (see `../AI_backend/`)

## Installation

```bash
# Navigate to web-app directory
cd web-app

# Install dependencies
npm install
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Configuration

Edit `src/constants/config.ts` to change the API endpoint:

```typescript
export const Config = {
  API_BASE_URL: 'http://localhost:8000',
};
```

## Project Structure

```
web-app/
├── src/
│   ├── pages/              # All page components
│   │   ├── WelcomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   │   ├── ProfileSetupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ManageMedicationPage.tsx
│   │   └── ProfilePage.tsx
│   ├── services/          # API and storage services
│   │   ├── api.ts
│   │   └── storage.ts
│   ├── constants/         # App constants
│   │   ├── colors.ts
│   │   └── config.ts
│   ├── types/            # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx           # Main app with routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Pages

### 1. Welcome Page
- Landing page with app tagline
- Login and Sign Up buttons

### 2. Authentication Pages
- **Login**: Email/password form
- **Sign Up**: Registration with password confirmation

### 3. Profile Setup
- Collect user biometric data (name, age, height, weight, sex)
- Options to add medication or connect smartwatch

### 4. Dashboard (Main Screen)
- Drug concentration line chart (purple)
- Side effect risk line chart (red)
- Side effects prediction panel
- History list
- Action buttons (Take medicine, Cancel, Refresh)

### 5. Manage Medication
- List of current medications
- Add medication modal with:
  - Medication search
  - Dosage input
  - Schedule configuration

### 6. Profile
- View and edit user profile
- Update biometric data

## API Integration

The web app connects to the backend at the following endpoints:

**Currently Implemented:**
- `POST /predict` - Get effect and side effect predictions

**To Be Implemented:**
- `POST /auth/login` - User authentication
- `POST /auth/signup` - User registration
- `GET /medications` - Get user's medications
- `POST /medications` - Add new medication
- `POST /dose/record` - Record medication dose
- `POST /feedback` - Submit feedback

## Color Scheme

The app uses a soft blue-purple gradient theme:

- Primary: `#5B7FED`
- Background Gradient: `#E8EEFF` → `#D0D8FF`
- Card Background: `#E5E5E5` / `#FFFFFF`
- Concentration Line: `#C77DFF` (purple)
- Side Effect Line: `#FF6B6B` (red)

## Development

### Run with Backend

1. Start the AI backend:
```bash
cd ../AI_backend
docker-compose up -d
```

2. Start the web app:
```bash
cd ../web-app
npm run dev
```

3. Open `http://localhost:3000` in your browser

### Testing the Prediction Feature

1. Sign up and create a profile
2. Add a medication
3. Navigate to Dashboard
4. Click "Refresh" to fetch predictions from the backend
5. The app will call `POST http://localhost:8000/predict`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

### Cannot connect to backend
- Ensure backend is running at `http://localhost:8000`
- Check browser console for CORS errors
- Verify API_BASE_URL in `src/constants/config.ts`

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

- [ ] Real-time notifications using WebSocket
- [ ] Dark mode support
- [ ] Data export functionality
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) features
- [ ] Offline mode with service workers

## License

Part of the Software Engineering project at Hanyang University.
