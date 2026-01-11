# FeedHub

A full-stack social media application built with FastAPI backend and Streamlit frontend. Users can authenticate, upload images with captions, view their feed, and manage their profiles.

## Features

- User authentication and authorization with JWT
- Image upload with caption support
- Feed display with user information
- User profile management
- Async database operations with SQLAlchemy
- Image optimization and storage with ImageKit

## Tech Stack

- Backend: FastAPI, SQLAlchemy, FastAPI-Users
- Frontend: Streamlit
- Database: SQLite (development)
- Authentication: JWT
- Image Service: ImageKit

## Installation

1. Clone the repository and navigate to the project directory:

```bash
cd /FeedHub
```

2. Install dependencies using uv:

```bash
uv sync
```

3. Create a `.env` file with required environment variables (ImageKit credentials)

## Running the Application

Start the FastAPI backend server:

```bash
uv run main.py
```

The API will be available at `http://0.0.0.0:8000`

In a separate terminal, start the Streamlit frontend:

```bash
uv run streamlit run frontend.py
```

The frontend will be available at `http://localhost:8501`

## Project Structure

```
app/
  app.py           - FastAPI application and routes
  db.py            - Database models and configuration
  schemas.py       - Pydantic schemas for validation
  users.py         - User authentication setup
  images.py        - Image upload configuration
frontend.py        - Streamlit UI
main.py            - Entry point for FastAPI server
```

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).
