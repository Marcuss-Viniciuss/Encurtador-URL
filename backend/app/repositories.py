from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Url


class UrlRepository:
    """Única camada que conhece o SQLAlchemy."""

    def __init__(self, db: Session):
        self._db = db

    def add(self, url: Url) -> Url:
        try:
            self._db.add(url)
            self._db.commit()
        except IntegrityError:
            self._db.rollback()
            raise
        self._db.refresh(url)
        return url

    def get_by_code(self, short_code: str) -> Url | None:
        return self._db.scalar(select(Url).where(Url.short_code == short_code))

    def list_recent(self, limit: int = 50) -> list[Url]:
        stmt = select(Url).order_by(Url.created_at.desc()).limit(limit)
        return list(self._db.scalars(stmt))

    def increment_clicks(self, short_code: str) -> None:
        # UPDATE atômico no banco: evita perder cliques em requisições concorrentes.
        self._db.execute(
            update(Url).where(Url.short_code == short_code).values(clicks=Url.clicks + 1)
        )
        self._db.commit()
