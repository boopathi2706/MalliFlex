# Malli Flix - Netflix Clone (FastAPI Python Backend Migration)

This project is a Netflix Clone web application featuring a modern React frontend and a Python FastAPI backend with dynamic web scraping capabilities.

---

## 🏗 System Architecture

```text
Existing Netflix Frontend (React + Vite)
        │
        │ HTTP REST API (VITE_API_URL=http://localhost:8000)
        ▼
   FastAPI Backend (Python)
        │
        ├── GET /api/movies
        │       ↓
        │   movies.json (cached locally or auto-scraped)
        │
        └── POST /api/movie/details
                ↓
        scrape_movie_details(movieUrl) [7-Step Scraper Chain]
                ↓
             watchUrl
                ↓
      Existing Netflix Video Player
```

---

## 🚀 Setup & Execution Instructions

### 1. Python Backend Setup

#### Prerequisites
* Python 3.8+ installed

#### Installation
Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
* **Windows**:
  ```bash
  python -m venv venv
  .\venv\Scripts\activate
  ```
* **Linux / macOS**:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

#### Run Backend Server
Start the FastAPI server using Uvicorn on port 8000:
```bash
python -m uvicorn main:app --reload --port 8000
```
The FastAPI interactive documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 2. Frontend Setup

#### Prerequisites
* Node.js (v18+)

#### Installation
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
```

#### Environment Configuration
Ensure `frontend/.env` is configured with:
```env
VITE_API_URL=http://localhost:8000
```

#### Run Frontend Dev Server
```bash
npm run dev
```
The application will launch locally at `http://localhost:5173`.

---

## 📡 API Endpoints Summary

### 1. `GET /api/movies`
Returns the list of scraped movies.
* Checks if `movies.json` exists in the backend directory.
* If absent, automatically invokes `scrape_movies()` to scrape and generate `movies.json`.
* Returns formatted JSON array of movie objects.

### 2. `POST /api/movie/details`
Extracts the final playable watch URL for a selected movie using the 7-step detail scraper chain.
* **Request Body**:
  ```json
  {
    "movieUrl": "https://moviezda.net/movie-page"
  }
  ```
* **Success Response**:
  ```json
  {
    "watchUrl": "https://moviezda.net/video.mp4"
  }
  ```
* **Error Response**:
  ```json
  {
    "detail": "Unable to retrieve movie watch URL"
  }
  ```

### 3. `POST /api/movies/refresh`
Admin/development endpoint to force re-scraping of `movies.json`.

---

## 🛡️ Production & Security Safeguards
* **SSRF Protection**: Domain validation (`ALLOWED_DOMAINS`) ensures requests to `/api/movie/details` only target authorized origins.
* **Error Handling**: Graceful error catching preventing raw stack trace leakage to the client.
* **Non-blocking Request Handling**: State management prevents concurrent duplicate scraping requests on the frontend.
