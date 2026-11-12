from fastapi import Depends
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.repositories import UrlRepository
from app.services import UrlService, generate_short_code


def get_url_service(db: Session = Depends(get_db)) -> UrlService:
    return UrlService(
        repository=UrlRepository(db),
        code_generator=lambda: generate_short_code(settings.short_code_length),
    )
