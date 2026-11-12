import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app


@pytest.fixture
def client():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    TestingSession = sessionmaker(bind=engine)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)  # sem "with": não dispara o lifespan no banco real
    app.dependency_overrides.clear()


def test_create_and_redirect_counts_clicks(client):
    created = client.post("/api/urls", json={"url": "https://example.com/path"})
    assert created.status_code == 201
    code = created.json()["short_code"]
    assert code.startswith("example-")

    redirect = client.get(f"/{code}", follow_redirects=False)
    assert redirect.status_code == 307
    assert redirect.headers["location"] == "https://example.com/path"

    listed = client.get("/api/urls").json()
    assert listed[0]["clicks"] == 1


def test_invalid_url_returns_422(client):
    assert client.post("/api/urls", json={"url": "isso-nao-e-url"}).status_code == 422


def test_unknown_code_returns_404(client):
    assert client.get("/naoexiste", follow_redirects=False).status_code == 404
