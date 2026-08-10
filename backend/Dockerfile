FROM python:3.10

WORKDIR /app

# Don't write pyc files to disk
ENV PYTHONDONTWRITEBYTECODE 1
# Don't buffer stdout and stderr
ENV PYTHONUNBUFFERED 1

# Update system packages and refresh CA certificates (fixes stale/expired
# root CAs that can cause slow/failing TLS handshakes on pip/apt installs)
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY Pipfile Pipfile.lock /app/

RUN pip install --upgrade pip pipenv
RUN pipenv install --ignore-pipfile --system

COPY alembic alembic
COPY alembic.ini .
COPY app app

CMD pipenv run uvicorn --host 0.0.0.0 --port 8000 app.main:app
