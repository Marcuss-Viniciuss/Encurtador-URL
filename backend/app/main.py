from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse

from app.config import settings
from app.database import Base, engine
from app.exceptions import ShortCodeGenerationError, UrlNotFoundError
from app.routers import redirect, urls


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)  # em produção, trocar por Alembic
    yield


app = FastAPI(title="URL Shortener API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.exception_handler(UrlNotFoundError)
async def url_not_found_handler(_: Request, exc: UrlNotFoundError):
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(ShortCodeGenerationError)
async def generation_error_handler(_: Request, exc: ShortCodeGenerationError):
    return JSONResponse(status_code=503, content={"detail": str(exc)})


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")


app.include_router(urls.router)
app.include_router(redirect.router)  # por último: /{short_code} é um "catch-all"
