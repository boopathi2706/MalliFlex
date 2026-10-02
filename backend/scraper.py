import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import time
import os
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

BASE_URL = "https://moviezda.net/moviesda-tamil-movies-2026/"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/153.0.0.0 Safari/537.36"
    )
}

# Resolve movies.json relative to the backend directory
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
MOVIES_JSON_PATH = os.path.join(BACKEND_DIR, "movies.json")

def get_page_url(page):
    """
    Page 1: /movies
    Page 2: /movies/?page=2
    Page 3: /movies/?page=3
    """
    if page == 1:
        return BASE_URL
    base = BASE_URL.rstrip('/')
    return f"{base}/?page={page}"

def get_soup(url):
    response = requests.get(url, headers=HEADERS, timeout=20)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")

def get_last_page(soup):
    """
    Find the largest page number from pagination.
    """
    page_numbers = []
    for link in soup.select("a"):
        text = link.get_text(strip=True)
        if text.isdigit():
            page_numbers.append(int(text))
    if not page_numbers:
        return 1
    return max(page_numbers)

def scrape_page(url, page_number):
    logger.info(f"Scraping page {page_number}: {url}")
    soup = get_soup(url)
    movie_list = soup.select_one("div.container main ul#movieList")
    if not movie_list:
        logger.warning("Movie list not found")
        return []

    movies = []
    items = movie_list.select("li.movie-list-item")
    logger.info(f"Found {len(items)} movies")

    for item in items:
        anchor = item.select_one("a")
        movie_url = None
        if anchor:
            movie_url = anchor.get("href")
        if movie_url:
            movie_url = urljoin(url, movie_url)

        image = item.select_one("picture img")
        poster_url = None
        if image:
            poster_url = (
                image.get("src")
                or image.get("data-src")
                or image.get("data-lazy-src")
            )
        if poster_url:
            poster_url = urljoin(url, poster_url)

        title_element = item.select_one(
            "div.movie-content div.movie-header div.title-wrapper h3"
        )
        title = None
        if title_element:
            title = title_element.get_text(" ", strip=True)

        movie = {
            "title": title or "Untitled Movie",
            "movieUrl": movie_url,
            "posterUrl": poster_url,
            "page": page_number
        }
        movies.append(movie)

    return movies

def scrape_all_pages():
    first_page = get_soup(BASE_URL)
    last_page = get_last_page(first_page)

    logger.info(f"Last page detected: {last_page}")

    all_movies = []

    for page in range(1, last_page + 1):
        url = get_page_url(page)
        try:
            movies = scrape_page(url, page)
            all_movies.extend(movies)
            time.sleep(1)
        except requests.RequestException as error:
            logger.error(f"Error on page {page}: {error}")
        except Exception as error:
            logger.error(f"Unexpected error on page {page}: {error}")

    return all_movies

def remove_duplicates(movies):
    unique_movies = {}
    for movie in movies:
        movie_url = movie.get("movieUrl")
        if movie_url:
            unique_movies[movie_url] = movie
    return list(unique_movies.values())

def scrape_movies():
    movies = scrape_all_pages()
    movies = remove_duplicates(movies)
    logger.info(f"TOTAL MOVIES SCRAPED: {len(movies)}")

    with open(MOVIES_JSON_PATH, "w", encoding="utf-8") as file:
        json.dump(movies, file, indent=4, ensure_ascii=False)
    logger.info(f"Saved: {MOVIES_JSON_PATH}")
    return movies

# -------------------------------------------------------------
# Movie Details Scraper Chain (7 Steps)
# -------------------------------------------------------------

def next_first_page(base_url):
    response = requests.get(base_url, headers=HEADERS, timeout=20)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    link = soup.select_one("main div.f a[href]")
    if not link:
        return None

    href = link.get("href")
    if not href:
        return None

    return urljoin(base_url, href)

def next_second_page(base_url):
    response = requests.get(base_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=20)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    main = soup.select_one("body > div > main")
    if not main:
        return None

    first_f_div = main.select_one("div.f")
    if not first_f_div:
        return None

    link = first_f_div.find("a", href=True)
    if not link:
        return None

    return urljoin(base_url, link["href"])

def next_third_page(base_url):
    response = requests.get(base_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=20)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    main = soup.select_one("body > div.container > main")
    if not main:
        return None

    folder = main.select_one("div.folder")
    if not folder:
        return None

    mv_content = folder.select_one("div.mv-content")
    if not mv_content:
        return None

    left = mv_content.select_one("div.left")
    if not left:
        return None

    ul = left.find("ul")
    if not ul:
        return None

    first_li = ul.find("li")
    if not first_li:
        return None

    link = first_li.find("a", href=True)
    if not link:
        return None

    return urljoin(base_url, link["href"])

def next_fourth_page(base_url):
    response = requests.get(base_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=20)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    link = soup.select_one(
        "body > div.container > main "
        "> div.bf > div.songinfo "
        "> div.download > div.dlink "
        "> a[href]"
    )
    if not link:
        return None

    return urljoin(base_url, link["href"])

def next_fiveth_page(base_url):
    response = requests.get(base_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=20)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    link = soup.select_one(
        "body > div.bf > div.songinfo "
        "> div.download > div.dlink > a[href]"
    )
    if not link:
        return None

    return urljoin(base_url, link["href"])

def next_sixth_page(base_url):
    response = requests.get(base_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=20)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    download_divs = soup.select(
        "body > div.bf > div.songinfo > div.download"
    )
    if len(download_divs) < 2:
        return None

    second_download = download_divs[1]
    link = second_download.select_one("div.dlink > a[href]")
    if not link:
        return None

    return urljoin(base_url, link["href"])

def next_seventh_page(base_url):
    response = requests.get(base_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=20)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    source = soup.select_one(
        "body > div.wrapper > div.player-container > video > source[src]"
    )
    if not source:
        return None

    return urljoin(base_url, source["src"])

def scrape_movie_details(base_url):
    """
    Executes 7-step detail scraping chain safely.
    Raises Exception if any step in chain fails to produce a URL.
    """
    logger.info(f"Starting detail scrape chain for: {base_url}")
    
    first_page_result = next_first_page(base_url)
    if not first_page_result:
        raise ValueError("Failed to extract URL on Step 1 (next_first_page)")
    logger.info(f"Step 1 URL: {first_page_result}")

    second_page_result = next_second_page(first_page_result)
    if not second_page_result:
        raise ValueError("Failed to extract URL on Step 2 (next_second_page)")
    logger.info(f"Step 2 URL: {second_page_result}")

    third_page_result = next_third_page(second_page_result)
    if not third_page_result:
        raise ValueError("Failed to extract URL on Step 3 (next_third_page)")
    logger.info(f"Step 3 URL: {third_page_result}")

    fourth_page_result = next_fourth_page(third_page_result)
    if not fourth_page_result:
        raise ValueError("Failed to extract URL on Step 4 (next_fourth_page)")
    logger.info(f"Step 4 URL: {fourth_page_result}")

    fifth_page_result = next_fiveth_page(fourth_page_result)
    if not fifth_page_result:
        raise ValueError("Failed to extract URL on Step 5 (next_fiveth_page)")
    logger.info(f"Step 5 URL: {fifth_page_result}")

    sixth_page_result = next_sixth_page(fifth_page_result)
    if not sixth_page_result:
        raise ValueError("Failed to extract URL on Step 6 (next_sixth_page)")
    logger.info(f"Step 6 URL: {sixth_page_result}")

    seventh_page_result = next_seventh_page(sixth_page_result)
    if not seventh_page_result:
        raise ValueError("Failed to extract final video URL on Step 7 (next_seventh_page)")

    logger.info(f"Watching movie URL successfully resolved: {seventh_page_result}")
    return seventh_page_result
