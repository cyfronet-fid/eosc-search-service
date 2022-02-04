FROM python:3.10

WORKDIR /app

# Don't write pyc files to disk
ENV PYTHONDONTWRITEBYTECODE 1
# Don't buffer stdout and stderr
ENV PYTHONUNBUFFERED 1

COPY Pipfile Pipfile.lock /app/

RUN pip install --upgrade pip pipenv
RUN pipenv install --deploy --system

COPY alembic alembic
COPY alembic.ini .
COPY app app

CMD pipenv run uvicorn --host 0.0.0.0 --port 8000 app.main:app
