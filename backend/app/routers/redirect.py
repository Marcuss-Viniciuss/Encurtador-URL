from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse

from app.dependencies import get_url_service
from app.services import UrlService

router = APIRouter(tags=["redirect"])


@router.get("/{short_code}")
def redirect_to_original(short_code: str, service: UrlService = Depends(get_url_service)):
    original_url = service.resolve(short_code)
    # 307 (e não 301): navegadores não cacheiam, então todo clique chega ao servidor.
    return RedirectResponse(url=original_url, status_code=307)
