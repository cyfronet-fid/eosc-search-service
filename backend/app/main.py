"""The FastAPI bootstrap"""
import uvicorn

from app.server import get_app

app = get_app()
app.UI_BASE_URL = None

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
