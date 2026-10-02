import os
import json
import logging
from typing import List, Optional
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from dotenv import load_dotenv

from scraper import MOVIES_JSON_PATH, scrape_movies, scrape_movie_details

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Malli Flix Python Backend API",
    description="FastAPI service for movie listing & scraping watch URLs",
    version="1.0.0"
)

# CORS Configuration
allowed_origins_env = os.getenv(
    "ALLOWED_ORIGINS",
    "*"
)
if allowed_origins_env == "*":
    origins = ["*"]
else:
    origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Allowed domains for SSRF protection
ALLOWED_DOMAINS = [
    domain.strip() for domain in os.getenv("ALLOWED_DOMAINS", "moviezda.net,moviezda.org").split(",") if domain.strip()
]

# --- Pydantic Models ---

class MovieItem(BaseModel):
    id: Optional[str] = None
    title: str
    movieUrl: Optional[str] = None
    posterUrl: Optional[str] = None
    page: Optional[int] = None
    backdropUrl: Optional[str] = None
    category: Optional[str] = "Movie"
    year: Optional[int] = 2026
    duration: Optional[str] = "2h 15m"
    language: Optional[str] = "Tamil"
    description: Optional[str] = "High quality movie streaming"
    genre: Optional[str] = "Drama / Action"
    isTrending: Optional[bool] = False
    isDubbed: Optional[bool] = False
    videoUrl: Optional[str] = None

class MovieListResponse(BaseModel):
    movies: List[MovieItem]

class MovieDetailsRequest(BaseModel):
    movieUrl: str

class MovieDetailsResponse(BaseModel):
    watchUrl: str

# Helper to validate input URLs against SSRF / unauthorized domain targeting
def is_url_allowed(url_str: str) -> bool:
    try:
        parsed = urlparse(url_str)
        if parsed.scheme not in ["http", "https"]:
            return False
        hostname = parsed.hostname
        if not hostname:
            return False
        for allowed in ALLOWED_DOMAINS:
            if hostname == allowed or hostname.endswith("." + allowed):
                return True
        return False
    except Exception:
        return False

# --- API Endpoints ---

@app.get("/api/movies")
def get_movies():
    """
    1. Check whether movies.json exists.
    2. If it does not exist, call scrape_movies().
    3. Read movies.json.
    4. Return the movie list as JSON formatted for the frontend.
    """
    try:
        if not os.path.exists(MOVIES_JSON_PATH):
            logger.info("movies.json not found. Triggering scrape_movies()...")
            movies_data = scrape_movies()
        else:
            logger.info(f"Reading movies from existing {MOVIES_JSON_PATH}")
            with open(MOVIES_JSON_PATH, "r", encoding="utf-8") as f:
                movies_data = json.load(f)

        # Enrich movies with required UI properties if not present
        formatted_movies = []
        for idx, m in enumerate(movies_data):
            title = m.get("title") or "Untitled Movie"
            movie_url = m.get("movieUrl") or ""
            poster_url = m.get("posterUrl") or "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
            
            # Map into rich movie objects for the Netflix clone frontend
            movie_obj = {
                "id": f"movie_{idx + 1}",
                "title": title,
                "movieUrl": movie_url,
                "posterUrl": poster_url,
                "page": m.get("page", 1),
                "backdropUrl": poster_url,
                "category": "Action" if idx % 2 == 0 else "Drama",
                "year": 2026,
                "duration": "2h 15m",
                "language": "Tamil",
                "description": f"Experience {title} in full HD high quality streaming.",
                "genre": "Action / Drama",
                "isTrending": idx < 3,
                "isDubbed": "dubbed" in title.lower(),
                "videoUrl": None
            }
            formatted_movies.append(movie_obj)

        return formatted_movies
    except Exception as e:
        logger.error(f"Error fetching movie list: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load movies list."
        )

@app.post("/api/movie/details")
def get_movie_details(payload: MovieDetailsRequest):
    """
    Receives movieUrl, validates domain, runs 7-step detail scraper, returns watchUrl.
    """
    movie_url = payload.movieUrl
    if not movie_url or not isinstance(movie_url, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid movieUrl provided"
        )

    # Validate target domain for SSRF protection
    if not is_url_allowed(movie_url):
        logger.warning(f"Rejected unauthorized domain request: {movie_url}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unauthorized or invalid movie URL target domain"
        )

    try:
        watch_url = scrape_movie_details(movie_url)
        if not watch_url:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Unable to retrieve movie watch URL"
            )
        return {"watchUrl": watch_url}
    except ValueError as ve:
        logger.error(f"Scraping extraction error for {movie_url}: {ve}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to retrieve movie watch URL from source page"
        )
    except Exception as err:
        logger.error(f"Unexpected error during movie detail scraping: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve movie watch URL due to an internal scraper error"
        )

# --- Pydantic Models for Auth, Favourites, and Watched ---

class LoginRequest(BaseModel):
    username: str
    password: Optional[str] = None

class ToggleFavouriteRequest(BaseModel):
    movieId: str

# In-memory storage for user favourites and watched status
in_memory_favourites = ["movie_1", "movie_3", "movie_6"]
in_memory_watched = {}

# --- AUTH API ---

@app.post("/api/auth/login")
def login(payload: LoginRequest):
    """
    Python Auth Login endpoint replacing Node server.js logic.
    """
    username = payload.username or "wife"
    role = "admin" if username == "admin@husband" else "client"
    return {
        "success": True,
        "user": {"username": username, "role": role},
        "token": f"py-jwt-token-{username}"
    }

# --- FAVOURITES API ---

@app.get("/api/favourites")
def get_favourites():
    return in_memory_favourites

@app.post("/api/favourites/toggle")
def toggle_favourite(payload: ToggleFavouriteRequest):
    movie_id = payload.movieId
    is_fav = movie_id in in_memory_favourites
    if is_fav:
        in_memory_favourites.remove(movie_id)
    else:
        in_memory_favourites.append(movie_id)
    return {"favourites": in_memory_favourites, "isFav": not is_fav}

# --- WATCHED API ---

@app.post("/api/movies/{movie_id}/watch")
def watch_movie(movie_id: str):
    in_memory_watched[movie_id] = True
    return {"id": movie_id, "watched": True, "watchProgress": 20}

@app.post("/api/movies/refresh")
def refresh_movies():
    """
    Admin/Dev endpoint to force re-scraping of movies.json
    """
    try:
        movies_data = scrape_movies()
        return {"message": "Movies list successfully refreshed", "count": len(movies_data)}
    except Exception as e:
        logger.error(f"Error refreshing movies list: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to refresh movies list"
        )
