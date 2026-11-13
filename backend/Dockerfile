FROM python:3.14

COPY --from=ghcr.io/astral-sh/uv:0.11.32 /uv /uvx /bin/

WORKDIR /app

# Don't write pyc files to disk
ENV PYTHONDONTWRITEBYTECODE 1
# Don't buffer stdout and stderr
ENV PYTHONUNBUFFERED 1
# uv: copy packages instead of hardlinking (cache is a separate mount),
# never download a different interpreter, use the image's python
ENV UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never \
    UV_COMPILE_BYTECODE=0
# Make the project venv the default environment (e.g. for docker-compose `command: uvicorn ...`)
ENV PATH="/app/.venv/bin:$PATH"

# Update system packages and refresh CA certificates (fixes stale/expired
# root CAs that can cause slow/failing TLS handshakes on pip/apt installs)
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml uv.lock /app/

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-install-project

COPY alembic alembic
COPY alembic.ini .
COPY app app

CMD ["uvicorn", "--host", "0.0.0.0", "--port", "8000", "app.main:app"]
