from fastapi import APIRouter, Depends, status

from app.config import settings
from app.dependencies import get_url_service
from app.models import Url
from app.schemas import UrlCreate, UrlResponse
from app.services import UrlService

router = APIRouter(prefix="/api/urls", tags=["urls"])


def to_response(url: Url) -> UrlResponse:
    return UrlResponse(
        short_code=url.short_code,
        short_url=f"{settings.base_url}/{url.short_code}",
        original_url=url.original_url,
        clicks=url.clicks,
        created_at=url.created_at,
    )


@router.post("", response_model=UrlResponse, status_code=status.HTTP_201_CREATED)
def create_short_url(payload: UrlCreate, service: UrlService = Depends(get_url_service)):
    return to_response(service.shorten(str(payload.url)))


@router.get("", response_model=list[UrlResponse])
def list_short_urls(service: UrlService = Depends(get_url_service)):
    return [to_response(u) for u in service.list_urls()]
