import pytest
from sqlalchemy.exc import IntegrityError

from app.exceptions import ShortCodeGenerationError, UrlNotFoundError
from app.services import UrlService


class FakeRepository:
    def __init__(self):
        self.items = {}

    def add(self, url):
        if url.short_code in self.items:
            raise IntegrityError("", {}, Exception())
        url.clicks = 0
        self.items[url.short_code] = url
        return url

    def get_by_code(self, code):
        return self.items.get(code)

    def increment_clicks(self, code):
        self.items[code].clicks += 1

    def list_recent(self, limit=50):
        return list(self.items.values())


def make_service(codes):
    it = iter(codes)
    return UrlService(FakeRepository(), code_generator=lambda: next(it))


def test_shorten_prefixes_code_with_site_name():
    service = make_service(["abc123"])
    url = service.shorten("https://gemini.google.com/app/c08a4e7ce3f6")
    assert url.short_code == "gemini-abc123"
    assert url.clicks == 0


def test_shorten_ignores_www_prefix():
    service = make_service(["x1"])
    assert service.shorten("https://www.youtube.com/watch?v=1").short_code == "youtube-x1"


def test_shorten_retries_on_code_collision():
    service = make_service(["dup", "dup", "novo"])
    service.shorten("https://a.com")
    second = service.shorten("https://a.com")
    assert second.short_code == "a-novo"


def test_shorten_fails_after_max_attempts():
    service = make_service(["dup"] * 6)
    service.shorten("https://a.com")
    with pytest.raises(ShortCodeGenerationError):
        service.shorten("https://a.com")


def test_resolve_returns_original_and_counts_click():
    service = make_service(["abc"])
    service.shorten("https://example.com")
    assert service.resolve("example-abc") == "https://example.com"
    assert service.list_urls()[0].clicks == 1


def test_resolve_unknown_code_raises():
    service = make_service([])
    with pytest.raises(UrlNotFoundError):
        service.resolve("nope")
