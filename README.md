# An AI-based Application for Personalized Pharmacokinetic Modeling and Adverse Effect Prediction

> [G01 – Assignment Project 2, Hanyang University](doc/G01-Assignment-project-2.pdf)

---

## 1. Overview

This project is a **mobile-first health application** that provides **personalized predictions of drug efficacy and adverse effects** using AI.

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
  * Mobile-optimized design and accessibility-first UX.
* **Reliability (NFR4)**

  * High availability for critical features (e.g., alerts).
  * Resilient syncing with wearables and offline-first behavior where relevant.

---

## 4. System Architecture (High-Level) 

### temporary diagram
![diagram](/doc/diagram/ai_pk_health_app_architecture.png)


**1. Mobile Client (Android / iOS)**

* User registration, auth, and profile setup
* Medication management
* Logging of doses, symptoms, side effects
* Visualization of predictions & alerts
* Local secure storage for offline use

**2. Backend API & Data Layer**

* REST/GraphQL API for the mobile client
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

* Mobile development environment set up (Android Studio / Xcode or equivalent)
* Backend runtime (e.g., Node.js / Python / etc.)
* Database server (e.g., PostgreSQL / MySQL / MongoDB)
* Access keys for any health data APIs and push notification services you use

### 5.2 Installation (example workflow)

```bash
# Clone the repository
git clone https://github.com/your-org/pharmaco-ai-app.git
cd pharmaco-ai-app

# Install mobile app dependencies
cd mobile
# e.g. for a JS stack:
npm install
# or yarn / pnpm, depending on your setup

# Install backend dependencies
cd ../backend
# e.g. for Node:
npm install
# or for Python:
# pip install -r requirements.txt
```

### 5.3 Configuration

Create and configure environment variable files for each component.

**Backend `.env` (example):**

```bash
# Core
APP_ENV=development
APP_PORT=8080

# Database
DB_URL=postgres://user:password@localhost:5432/pharmaco_ai

# Auth
JWT_SECRET=change_me
OAUTH_GOOGLE_CLIENT_ID=xxxx
OAUTH_GOOGLE_CLIENT_SECRET=xxxx

# Health APIs
HEALTHKIT_API_KEY=...
HEALTH_CONNECT_API_KEY=...

# Storage / Research
CLOUD_STORAGE_BUCKET=...
RESEARCH_EXPORT_ENDPOINT=...
```

**Mobile app config (example):**

* API base URL
* OAuth client IDs
* Feature flags (e.g., enableWearableIntegration, enableResearchExport)

### 5.4 Running Locally

```bash
# Start backend
cd backend
npm run dev
# or equivalent in your stack

# Start mobile app (example React Native)
cd ../mobile
npm run android   # or npm run ios
```

---

## 6. Project Structure (Template)

Adjust to reflect your actual tree:

```text
.
├── backend/                 # API, auth, models, PK data, ML integration
│   ├── src/
│   ├── tests/
│   └── ...
├── mobile/                  # Mobile client app (Android/iOS)
│   ├── src/
│   ├── assets/
│   └── ...
├── docs/                    # Design docs, PK references, regulatory notes
│   └── G01-Assignment-project-2.pdf
├── scripts/                 # Data import/export, anonymization tools
└── README.md                # This file
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

