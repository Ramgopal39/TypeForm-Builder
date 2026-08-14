# Typeform Builder

A professional, full-stack Typeform-inspired conversational form builder. This application features a Next.js frontend and a FastAPI backend with SQLite, allowing creators to design forms, preview them instantly, collect responses, and analyze detailed submissions and aggregated analytics.

---

## Overview

Typeform Builder is a modern, single-page-app conversational form creator and respondent platform. It replicates the classic Typeform user experience by showing exactly one question at a time to respondents, using keyboard shortcuts, custom rating inputs, and smooth animated transitions. 

For form creators, it provides a unified dashboard to manage forms, an inline builder with drag-and-drop question reordering, a live preview drawer, and a responses workspace featuring export capabilities and statistics.

---

## Features

### Creator Features
*   **Workspace Dashboard**: Create, rename, duplicate, delete, and publish/unpublish forms. Renders form status badges and live response counts.
*   **Visual Form Builder**: Inline question title and help text editing, toggle required states, configure rating levels, and manage multiple-choice/dropdown lists (add, edit, delete, reorder options).
*   **Drag & Drop Reordering**: Uses `@dnd-kit` to allow seamless question position updates, saved automatically to the database.
*   **Autosave Debouncing**: Instantly saves changes made to questions with inline debounce feedback in the top bar.
*   **Live Preview**: Opens a zero-redirect interactive preview modal directly within the builder, utilizing the exact respondent flow engine.
*   **Detailed Analytics**: Submissions table, click-row drawer to view exact respondent answers, and automated statistical cards (aggregates for Yes/No, Rating distributions, Number stats, Choice frequencies).
*   **Backend-Driven CSV Export**: Export submissions into Excel-compatible CSV formats generated server-side.

### Respondent Features
*   **Conversational Flow**: Displays exactly one question at a time in full-screen focus.
*   **Smooth Transitions**: Employs Framer Motion slide-in animations.
*   **Interactive Input Controls**: Custom styled Multiple Choice cards, Dropdowns, Yes/No cards, Rating stars, and standard text/numeric fields.
*   **Keyboard Navigation**: Select choices using alphabetical keys (`A`, `B`, `C`), Yes/No using (`Y`/`N`), and rating scores using numbers (`1` to `N`). Use `Enter` to advance and Arrow keys to go back and forth.
*   **Input Validation**: Validates required fields, email formatting, and numeric scales before advancing.
*   **Progress Tracking**: A progress bar tracks completion percentage in real time.

---

## Tech Stack

### Frontend
*   **Next.js 15+ (App Router)**: Single page routing, components, and server optimization.
*   **TypeScript**: Code predictability and type safety.
*   **Tailwind CSS**: Modern light-mode styling utilizing a slate/neutral aesthetic.
*   **Framer Motion**: Smooth slider animations and question card transitions.
*   **dnd-kit**: Drag-and-drop sorting lists.
*   **Axios**: Configured client fetching backend REST endpoints.
*   **Lucide React**: Clean typography icons.

### Backend
*   **FastAPI (Python)**: Async routing, validation schemas, and lightweight architecture.
*   **SQLAlchemy**: Object-Relational Mapper for SQLite transactions.
*   **Pydantic**: JSON request/response schema parsing.

### Database
*   **SQLite**: Lightweight SQL database file (`backend/typeform.db`).

---

## Architecture

```text
+-------------------------------------------------------------+
|                        Browser                              |
+-------------------------------------------------------------+
                            |
                            | (HTTP Requests / JSON API)
                            v
+-------------------------------------------------------------+
|                 Next.js Frontend Client                     |
|  - Pages (/forms/[id]/builder, /f/[id], /forms/[id]/res)    |
|  - Axios Client (api.ts)                                    |
+-------------------------------------------------------------+
                            |
                            | (REST API Endpoints)
                            v
+-------------------------------------------------------------+
|                    FastAPI Backend Router                   |
|  - Endpoints (/api/forms, /api/questions, /api/responses)  |
|  - Pydantic Validations                                     |
+-------------------------------------------------------------+
                            |
                            | (SQLAlchemy Session ORM)
                            v
+-------------------------------------------------------------+
|                     SQLite Database                         |
|  - file: backend/typeform.db                                |
+-------------------------------------------------------------+
```

---

## Database Schema

```text
  +------------------+             +--------------------+
  |      Form        |1           *|     Question       |
  |  - id (PK)       |-------------|  - id (PK)         |
  |  - title         |             |  - form_id (FK)    |
  |  - description   |             |  - type            |
  |  - status        |             |  - title           |
  |  - created_at    |             |  - description     |
  |  - updated_at    |             |  - required        |
  |  - published_at  |             |  - position        |
  +------------------+             |  - settings (JSON) |
          |1                       +--------------------+
          |                                  |1
          |                                  |
          |*                                 |*
  +------------------+             +--------------------+
  |    Response      |1           *|   ResponseAnswer   |
  |  - id (PK)       |-------------|  - id (PK)         |
  |  - form_id (FK)  |             |  - response_id (FK)|
  |  - submitted_at  |             |  - question_id (FK)|
  +------------------+             |  - value (Text)    |
                                   +--------------------+
```

### Models & Relationships
1. **Form**: Holds form configuration. Has a one-to-many relationship with `Question` and `Response`. Deleting a form cascade-deletes all questions and submissions.
2. **Question**: Stores question configuration (e.g. `short_text`, `rating`, `multiple_choice`, etc.). Options lists or rating configurations are persisted in a flexible `settings` JSON column.
3. **Response**: Records form submission events and timestamps.
4. **ResponseAnswer**: Connects submitted string values to a specific `Response` and `Question`.

---

## API Documentation

### Forms Endpoints
*   `GET /api/forms` - Retrieves all forms.
*   `GET /api/forms/{id}` - Retrieves details and questions of a specific form.
*   `POST /api/forms` - Creates a new form draft.
*   `PUT /api/forms/{id}` - Updates a form's settings.
*   `DELETE /api/forms/{id}` - Deletes a form and all related answers.
*   `POST /api/forms/{id}/duplicate` - Duplicates a form structure.
*   `POST /api/forms/{id}/publish` - Publishes a form.
*   `POST /api/forms/{id}/unpublish` - Unpublishes a form.

### Questions Endpoints
*   `GET /api/forms/{id}/questions` - Retrieves questions of a form.
*   `POST /api/forms/{id}/questions` - Adds a question.
*   `PUT /api/questions/{id}` - Updates question details.
*   `DELETE /api/questions/{id}` - Deletes a question.
*   `PUT /api/forms/{id}/questions/reorder` - Reorders question positions.

### Responses Endpoints
*   `GET /api/forms/{id}/responses` - Retrieves submissions.
*   `GET /api/forms/{id}/responses/csv` - Downloads all submissions as an RFC 4180 compliant CSV file.
*   `POST /api/public/forms/{id}/responses` - Submits a respondent's form answers. Performs server-side validation (required fields, email format, numeric values).

---

## Local Setup

### 1. Backend Setup (FastAPI)
Navigate to the `backend/` directory, set up your Python virtual environment, install requirements, initialize the database tables, run the seed script, and start uvicorn:

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

# Create database tables and populate mock seed data
python -m app.seed

# Run the development server
python -m uvicorn app.main:app --reload --port 8000
```
*   **API URL**: `http://127.0.0.1:8000`
*   **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup (Next.js)
Navigate to the `frontend/` directory, install dependencies, and run the development server:

```bash
# Move to frontend folder
cd frontend

# Install package dependencies
npm install

# Run the local server
npm run dev
```
*   **Frontend App URL**: `http://localhost:3000`

---

## Environment Variables

### Frontend (`frontend/.env.local`)
Create a `.env.local` file inside the `frontend/` directory (optional, falls back to default localhost):
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### Backend (`backend/.env`)
Create a `.env` file inside the `backend/` directory (optional):
```env
DATABASE_URL=sqlite:///./typeform.db
```

---

## Assumptions

1. **Simplified Authentication**: Creator authentication is simplified for local testing (default logged-in creator user profile).
2. **Public Respondents**: Responding to published forms requires no registration or login.
3. **Draft Restrictions**: Responses can only be submitted for forms in `published` status. Draft forms return a `400 Bad Request` on response submission.
4. **Single-Question Layout**: Every question type is displayed one at a time. Multi-page configurations are not supported.

---

## Design Decisions

*   **FastAPI & Python**: Provides rapid development speed, automatic documentation generation, and native type-safety support with Pydantic.
*   **Next.js (App Router)**: Offers optimized routing, React component standard structures, and seamless component rendering.
*   **SQLite**: Fits full-stack assignments perfectly with a zero-configuration, serverless single-file database.
*   **SQLAlchemy ORM**: Standardizes clean transactions and handles relations with automatic cascades.
*   **Framer Motion**: Gives premium transitions (slide-ins) representing a Typeform look-and-feel.
*   **dnd-kit**: Lightweight and modular React library designed specifically for drag-and-drop lists without heavy bloat.

---

## Future Improvements

*   **Authentication & Access Control**: Integrate Clerk, NextAuth, or Auth0 for multi-tenant account security.
*   **Branching & Logic Jump**: Add conditions to skip questions or branch to other layouts based on answers.
*   **Collaboration**: Real-time multi-creator builder access using WebSockets.
*   **Integrations**: Direct export channels to Google Sheets, Notion databases, or Slack notifications.
*   **File Uploads**: Supporting media attachments inside question responses.
*   **Custom Themes**: Allow form builders to choose custom backgrounds, color themes, and font families.
