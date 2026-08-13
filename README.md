# Typeform Builder - SDE Fullstack Project Foundation

This repository contains the production-quality foundation for a Typeform-inspired full-stack form builder. The project is split into a Next.js frontend and a Python FastAPI backend.

## Tech Stack

*   **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, Framer Motion, dnd-kit, Axios, Lucide React
*   **Backend**: Python FastAPI, SQLAlchemy (ORM), SQLite (Database), Pydantic
*   **Database**: SQLite (`backend/typeform.db`)

---

## Directory Structure

```text
project-root/
├── frontend/                     # Next.js Application
│   ├── app/                      # App router page routes & layouts
│   ├── components/               # Reusable UI component architecture
│   │   └── ui/                   # Reusable atomic UI elements (Button, Card, Badge)
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Axios API clients & configurations
│   ├── types/                    # TypeScript interfaces & declarations
│   └── public/                   # Static media and assets
└── backend/                      # Python FastAPI Application
    ├── app/
    │   ├── main.py               # Application entry, CORS, router inclusions
    │   ├── database.py           # SQLAlchemy connection & session configuration
    │   ├── models/               # Database ORM models
    │   ├── schemas/              # Pydantic schemas (request/response validation)
    │   ├── routers/              # Endpoint route handlers (health checks, etc.)
    │   ├── services/             # Business logic layer
    │   └── seed.py               # Database seed scripts
    ├── requirements.txt          # Python dependencies
    ├── .env.example              # Env variables template
    └── .env                      # Local environment configurations
```

---

## Setup & Running Instructions

### 1. Backend Setup (FastAPI)

Navigate to the `backend/` directory, set up your Python virtual environment, install requirements, and run uvicorn:

```bash
# Move to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows Powershell:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the development server
python -m uvicorn app.main:app --reload --port 8000
```
*   **API URL**: `http://127.0.0.1:8000`
*   **Interactive Docs (Swagger UI)**: `http://127.0.0.1:8000/docs`
*   **Health Check**: `http://127.0.0.1:8000/api/health`

### 1.1 Database Seeding

To populate the database with polished, high-fidelity sample forms and mock responses (including Customer Feedback, Job Application, and Event Registration surveys), run the following command from the `backend/` directory:

```bash
# Make sure your virtual environment is active
python -m app.seed
```

This seed script is fully idempotent and safe to execute repeatedly. Running it will refresh the seed forms without duplicating records.

### 2. Frontend Setup (Next.js)

Navigate to the `frontend/` directory, install dependencies, and run the development script:

```bash
# Move to frontend folder
cd frontend

# Install package dependencies
npm install

# Run the local server
npm run dev
```
*   **Development App URL**: `http://localhost:3000`

---

## Frontend-Backend Communication

*   **API Client**: Configured in `frontend/lib/api.ts` utilizing Axios. It queries the backend endpoint `/api/health` to confirm server status.
*   **CORS**: Configured in `backend/app/main.py` using FastAPI's `CORSMiddleware`, allowing origins `http://localhost:3000` and `http://127.0.0.1:3000` to prevent cross-origin blocks during local development.

---

## Database Configuration (SQLite & SQLAlchemy)

*   **File Location**: `backend/typeform.db`
*   **ORM Connection**: Set up in `backend/app/database.py`. It uses a dynamic base path resolver so the database file is always kept inside the backend root folder regardless of the terminal's execution directory.
*   **SQLite specifics**: Enabled `connect_args={"check_same_thread": False}` to handle multi-threaded queries.
