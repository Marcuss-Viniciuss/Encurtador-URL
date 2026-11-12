import re
import secrets
import string
from collections.abc import Callable
from urllib.parse import urlparse

from sqlalchemy.exc import IntegrityError

from app.exceptions import ShortCodeGenerationError, UrlNotFoundError
from app.models import Url
from app.repositories import UrlRepository

ALPHABET = string.ascii_letters + string.digits


def generate_short_code(length: int) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))


def slug_prefix(original_url: str, max_length: int = 12) -> str:
    """gemini.google.com -> 'gemini'; www.youtube.com -> 'youtube'."""
    host = (urlparse(original_url).hostname or "").lower()
    if host.startswith("www."):
        host = host[4:]
    first_label = host.split(".")[0]
    return re.sub(r"[^a-z0-9]", "", first_label)[:max_length]


class UrlService:
    MAX_ATTEMPTS = 5

    def __init__(self, repository: UrlRepository, code_generator: Callable[[], str]):
        self._repository = repository
        self._generate_code = code_generator  # injetável: facilita testes

    def shorten(self, original_url: str) -> Url:
        prefix = slug_prefix(original_url)
        # Em vez de "checar e inserir" (condição de corrida), inserimos e deixamos
        # a constraint UNIQUE do banco decidir; em colisão, tentamos outro código.
        for _ in range(self.MAX_ATTEMPTS):
            random_part = self._generate_code()
            code = f"{prefix}-{random_part}" if prefix else random_part
            url = Url(short_code=code, original_url=original_url)
            try:
                return self._repository.add(url)
            except IntegrityError:
                continue
        raise ShortCodeGenerationError("Não foi possível gerar um código único.")

    def resolve(self, short_code: str) -> str:
        url = self._repository.get_by_code(short_code)
        if url is None:
            raise UrlNotFoundError(short_code)
        self._repository.increment_clicks(short_code)
        return url.original_url

    def list_urls(self) -> list[Url]:
        return self._repository.list_recent()
