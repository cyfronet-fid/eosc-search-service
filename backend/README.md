# EOSC Search Service - backend

## Setting up environment

Ensure you have the correct python version from `.tool-versions` installed.

Run `pip install --user pipx` and `pipx ensurepath`.

You should see output similar to
```
/home/ubuntu/.local/bin is already in PATH.

⚠️  All pipx binary directories have been added to PATH. If you are sure you
want to proceed, try again with the '--force' flag.

Otherwise pipx is ready to go! ✨ 🌟 ✨
```

Then, `pipx install pipenv` and `pipenv --python 3.10`.

To install the dependencies `pipenv install`.


## Database

The DB can be run using docker-compose in the root directory.
```console
docker-compose up db
```

It spawns a database on `localhost:5442`.

### Migrations

To run missing migrations: `pipenv run alembic upgrade head`.

To auto-generate migrations after models changes:
`pipenv run alembic revision --autogenerate -m "<revision message>"`.


### Seed

To create basic DB seed, run:
```shell
pipenv run python -m app.manager db seed-basic
```

Available seeds:
- `seed-basic`
- `seed-oag-1`
- `seed-oag-2`


## Running in console

To run in console, ensure you have spun up required services (e.g. migrated db, Solr, etc.) and execute:
```shell
pipenv run uvicorn app.main:app
```

To reload on changes:
```shell
pipenv run uvicorn app.main:app --reload
```


## Styles

```console
pipenv run --experimental-string-processing black alembic app tests
pipenv run isort .
pipenv run pylint app tests
```


## Running tests

You need to run the test services first `docker-compose -f dc-test.yml up -d`.

```console
PIPENV_DONT_LOAD_ENV=1 ENVIRONMENT=test pipenv run pytest
```

To skip integration tests:
```console
ENVIRONMENT=test SOLR_URL=http://localhost:8993/solr/ pipenv run pytest -m "not integration"
```
