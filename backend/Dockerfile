FROM python:3.10

WORKDIR /app

COPY Pipfile Pipfile.lock /app/

RUN pip install --upgrade pip pipenv
RUN pipenv install --deploy

COPY app app

CMD pipenv run uvicorn --host 0.0.0.0 --port 8000 app.main:app
