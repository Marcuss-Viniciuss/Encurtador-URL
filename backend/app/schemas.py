from datetime import datetime

from pydantic import BaseModel, HttpUrl


class UrlCreate(BaseModel):
    url: HttpUrl  # valida formato e restringe a http/https


class UrlResponse(BaseModel):
    short_code: str
    short_url: str
    original_url: str
    clicks: int
    created_at: datetime
