# EOSC Search Service - backend

## Setting up environment

Ensure you have the correct python version from `.tool-versions` installed.

Dependencies are managed with [uv](https://docs.astral.sh/uv/) (`pyproject.toml` + `uv.lock`).

Install uv, e.g. `curl -LsSf https://astral.sh/uv/install.sh | sh` (or `pipx install uv`, `brew install uv`).

To create `.venv` and install all dependencies (incl. the `dev` group): `uv sync`.

To add / upgrade a dependency: `uv add <package>` / `uv lock --upgrade-package <package>`.
Always commit the updated `uv.lock`.

> `Pipfile` / `Pipfile.lock` are kept temporarily but are no longer the source of truth.

## Database

The DB can be run using docker-compose in the root directory.

```console
docker-compose up db
```

It spawns a database on `localhost:5442`.

### Migrations

To run missing migrations: `uv run alembic upgrade head`.

To auto-generate migrations after models changes:
`uv run alembic revision --autogenerate -m "<revision message>"`.

### Seed

To create basic DB seed, run:

```shell
uv run python -m app.manager db seed-basic
```

Available seeds:

- `seed-basic`
- `seed-oag-1`
- `seed-oag-2`

## Running in console

To run in console, ensure you have spun up required services
(e.g. migrated db, Solr, etc.) and execute:

```shell
uv run uvicorn app.main:app
```

To reload on changes:

```shell
uv run uvicorn app.main:app --reload
```

## Styles

```console
uv run black alembic app tests
uv run isort .
uv run pylint app tests
```

## Running tests

You need to run the test services first `docker-compose -f dc-test.yml up -d`.

```console
ENVIRONMENT=test uv run pytest
```

To skip integration tests:

```console
ENVIRONMENT=test SOLR_URL=http://localhost:8993/solr/ uv run pytest -m "not integration"
```
