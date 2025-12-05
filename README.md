# PharmaTrakc

## An AI-based Application for Personalized Pharmacokinetic Modeling and Adverse Effect Prediction

> [G01 – Assignment Project 2, Hanyang University](doc/G01-Assignment-project-2.pdf)

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

## 2. Core Features

Below is a high-level mapping to the functional requirements (FRs) defined in the project specification. 

### 2.1 User & Medication Management

* **Secure accounts & auth (FR1)**
  Email/password login with support for OAuth (e.g., Google, Apple) and optional multi-factor authentication.
* **Medication management (FR2, FR13)**
  Add/edit/remove medications, doses, schedules, plus access to a searchable medication catalog with PK parameters (Tmax, Cmax, half-life, mechanism of action). Users can also define custom medications.
* **Biometric & health profile (FR14)**
  Store age, sex, height, weight, allergies, conditions, concurrent meds, etc., to contextualize predictions.

### 2.2 Data Collection & Integration

* **Wearable integration (FR3, FR15)**
  Sync data (heart rate, sleep, activity, etc.) from APIs such as Google Health Connect / Apple HealthKit and other connected devices (e.g., BP cuffs, glucometers).
* **Subjective feedback logging (FR4)**
  Simple UI for the user to periodically rate drug effect and side-effects on a scale (e.g., 1–5).
* **Continuous multi-source timeline (FR15, FR17)**
  All user inputs and bio-signals are fused into a unified timeline; the system maintains **baselines** to distinguish drug-related changes from normal variability.

### 2.3 AI-Powered Predictions & Visualization

* **Personalized PK / response model (FR5, FR18)**
  A machine-learning model predicts how drug levels and effects evolve over time for a given user, including side-effect risk.
* **Explainable AI feedback (FR18)**
  Predictions come with short explanations (e.g., “High dizziness risk due to elevated heart rate and rapidly rising drug level”).
* **Interactive time-series graph (FR6)**
  The app renders zoomable charts of:

  * Predicted efficacy curve
  * Side-effect probability/intensity
  * Key events (dose times, expected peak, alerts)

### 2.4 Notifications, Safety & Clinical Orientation

* **Smart notifications (FR7, FR16)**
  Alerts suggest optimal dosing times and warn before predicted high-risk side-effect periods. Alert thresholds are customizable per user or clinician preferences.
* **Safety alerts (FR11)**
  Notifications in case of:

  * Very high predicted toxicity
  * Anomalous vital signs
  * Possible non-adherence that could imply risk
    Optionally notify a trusted contact.
* **Clinical integration & audit trail (FR20)**
  All inputs, outputs, and configuration changes are logged to allow future **clinical validation** and regulatory review, and to support a possible “clinical mode” for healthcare professionals.

### 2.5 Data Handling, Research & Settings

* **History import & backup (FR8)**
  Import past logs (CSV/JSON/API) and back up all data to a secure cloud backend.
* **Anonymized research export (FR9)**
  Export fully de-identified data for research while preserving pharmacological usefulness.
* **Consent dashboard (FR10)**
  Central place to manage what data is used for:

  * Personal predictions
  * Model training
  * External research
* **Multilingual & accessibility support (FR12)**
  UI localized to multiple languages and aligned with WCAG 2.1; includes support for voice-based interactions.

---

## 3. Non-Functional Requirements

Key non-functional constraints that shape the implementation: 

* **Security (NFR1)**

  * Encryption in transit (HTTPS/TLS) and at rest.
  * Hardened auth flows and least-privilege access to health APIs.
* **Privacy (NFR2)**

  * Strict separation between identifiable user data and training/analytics datasets.
  * Explicit consent for every data-use category.
* **Usability (NFR3)**

  * Simple, low-friction daily flows (log dose → give quick feedback → see prediction).
  * Responsive web design and accessibility-first UX.
* **Reliability (NFR4)**

  * High availability for critical features (e.g., alerts).
  * Resilient syncing with wearables and offline-first behavior where relevant.

---

## 4. System Architecture (High-Level) 


![diagram](/doc/diagram/g01.png)


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

## 5. Getting Started

### 5.1 Prerequisites

**Backend (AI_backend):**
* Docker and Docker Compose
* Python 3.11+ (for local development)

**Web App:**
* Node.js v18+
* npm or yarn
* Modern web browser (Chrome, Firefox, Safari, or Edge)

### 5.2 Installation

```bash
# Clone the repository
git clone https://github.com/balqisinsyirah/Software-Engineering-Hanyang.git
cd Software-Engineering-Hanyang

# Install web app dependencies
cd web-app
npm install

# Backend dependencies are handled by Docker
```

### 5.3 Running the Application

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

### 5.4 Testing the Integration

1. Open the web app in your browser (http://localhost:5173)
2. Sign up with an email/password
3. Fill in your profile information
4. Add a medication
5. Navigate to Dashboard
6. Click "Refresh" to fetch predictions from the backend
7. The app will call `POST http://localhost:8000/predict` with mock data

### 5.5 Stopping the Services

```bash
# Stop backend
cd AI_backend
docker-compose down

# Stop web app
# Press Ctrl+C in the Vite terminal
```

---

## 6. Project Structure

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

## 7. Regulatory & Compliance Considerations

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

