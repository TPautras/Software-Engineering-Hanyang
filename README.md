# PharmaTrack

## An AI-based Application for Personalized Pharmacokinetic Modeling and Adverse Effect Prediction

> [G01 – Assignment Project 2, Hanyang University](doc/G01-Assignment-project-2.pdf)

> [Demo video](https://youtu.be/b3dNrxpm3H8)

> [Presentation Slides](doc/presentation.pdf)

---

## 1. Overview

This project is a **web-based health application** that provides **personalized predictions of drug efficacy and adverse effects** using AI.

Standard pharmacokinetic (PK) models and dosage guidelines are designed for “average” patients and often fail to capture inter-individual variability in drug response. Our goal is to help real people taking common medications (painkillers, antidepressants, anti-allergy drugs, etc.) to:

* Better **anticipate when a drug will start working**, when its effect peaks, and when it wears off.
* **Plan their day** (meetings, exams, sports, sleep) around **therapeutic windows** and expected side effects.
* **Visualize and understand** how their own body responds over time, instead of relying only on generic leaflets. 

The app integrates four kinds of data:

1. Traditional pharmacokinetic data (Tmax, Cmax, half-life, etc.).
2. User biometric/health profile.
3. Subjective feedback on drug efficacy and side effects.
4. Bio-signals from wearable devices.

These inputs feed a machine-learning model that outputs **time-series predictions** of both efficacy and side-effect risk, displayed to the user as an interactive graph. 

---

## 2. System Architecture (High-Level) 


![diagram](/doc/diagram/diagram.jpeg)


**1. Web Application (React + TypeScript)**

* User registration, auth, and profile setup
* Medication management
* Logging of doses, symptoms, side effects
* Visualization of predictions & alerts
* Local browser storage for session management

**2. Backend API & Data Layer**

* REST/GraphQL API for the web client
* User & medication database
* Wearable/webhook integration handlers
* Audit log & consent management
* Anonymization pipelines for research exports

**3. AI/ML Service**

* Feature engineering from:

  * PK parameters
  * Biometrics
  * Subjective feedback
  * Wearable streams
* Training & inference for personalized time-series models
* Explainability layer (feature importance / simple rules / example-based explanations)

**4. External Integrations**

* Health data platforms (HealthKit, Health Connect, etc.)
* Cloud storage for encrypted backups
* Optional research servers (for anonymized data)

---

## 3. Getting Started

### 3.1 Prerequisites

**Backend (AI_backend):**
* Docker and Docker Compose
* Python 3.11+ (for local development)

**Web App:**
* Node.js v18+
* npm or yarn
* Modern web browser (Chrome, Firefox, Safari, or Edge)

### 3.2 Installation

```bash
# Clone the repository
git clone https://github.com/balqisinsyirah/Software-Engineering-Hanyang.git
cd Software-Engineering-Hanyang

# Install web app dependencies
cd web-app
npm install

# Backend dependencies are handled by Docker
```

### 3.3 Running the Application

**Step 1: Start the AI Backend**

```bash
cd AI_backend
docker-compose up -d

# View logs
docker-compose logs -f drug-api

# The API will be available at http://localhost:8000
```

**Step 2: Configure Web App API Endpoint**

Edit `web-app/src/constants/config.ts`:

```typescript
export const Config = {
  API_BASE_URL: 'http://localhost:8000',  // Local development
  // API_BASE_URL: 'https://your-api-domain.com',  // Production
};
```

**Step 3: Start the Web App**

```bash
cd web-app
npm run dev

# The web app will be available at http://localhost:5173
# Open your browser and navigate to the URL shown in the terminal
```

### 3.4 Testing the Integration

1. Open the web app in your browser (http://localhost:5173)
2. Sign up with an email/password
3. Fill in your profile information
4. Add a medication
5. Navigate to Dashboard
6. Click "Refresh" to fetch predictions from the backend
7. The app will call `POST http://localhost:8000/predict` with mock data

### 3.5 Stopping the Services

```bash
# Stop backend
cd AI_backend
docker-compose down

# Stop web app
# Press Ctrl+C in the Vite terminal
```

---

## 4. Project Structure

```text
.
├── AI_backend/              # AI/ML Backend Service
│   ├── api/                # FastAPI inference endpoints
│   │   ├── inference_main.py    # Main API server
│   │   ├── postgres_logger.py   # Prediction logging
│   │   ├── prometheus_metrics.py # Metrics collection
│   │   └── requirements.txt
│   ├── data_loader/        # Firestore data extraction
│   │   ├── firestore_loader.py
│   │   └── discover_firestore.py
│   ├── training/           # Model training scripts
│   │   ├── train_lstm.py
│   │   ├── train_mlp.py
│   │   └── preprocess.py
│   ├── models/             # Trained model artifacts
│   │   └── model_lstm.h5
│   ├── docker/             # Docker configurations
│   │   ├── Dockerfile.api
│   │   └── Dockerfile.prometheus
│   └── docker-compose.yml  # Services orchestration
├── web-app/                # React + TypeScript Web Application
│   ├── src/
│   │   ├── pages/         # All UI pages
│   │   ├── services/      # API and storage services
│   │   ├── constants/     # Colors, config
│   │   └── types/         # TypeScript definitions
│   ├── App.tsx            # Main app entry point
│   ├── index.html         # HTML entry point
│   ├── package.json       # Dependencies
│   ├── vite.config.ts     # Vite configuration
│   └── README.md          # Web app documentation
├── doc/                    # Project documentation
│   ├── G01-Assignment-project-2.pdf
│   └── diagram/           # Architecture diagrams
├── CLAUDE.md              # Claude Code guidance
└── README.md              # This file
```

---

## 5. Regulatory & Compliance Considerations

The app sits at the boundary between **wellness** and **medical device**:

* In **South Korea (MFDS)** and the **United States (FDA)**, an AI-driven app that influences treatment decisions is likely classified as **Software as a Medical Device (SaMD)**.
* Simple reminder/symptom-tracking versions may not require full certification, but any module that:

  * optimizes doses,
  * gives predictive alerts with clinical implications, or
  * serves as decision support
    will eventually need **formal approval, clinical validation, and adherence to AI/ML guidance (e.g., GMLP)**. 

For this project:

* We architect the system **modularly**, separating:

  * Wellness-oriented features (tracking, visualization, basic predictions)
  * Clinically influential features (dose optimization, high-risk alerts)
* We design with an eye toward:

  * Data protection & audit trails
  * Explainability
  * Clear consent and opt-in paths

This should make future evolution toward a certified medical-grade tool feasible, while allowing a safe student/research prototype today.

