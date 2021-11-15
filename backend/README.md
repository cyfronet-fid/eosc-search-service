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

## Styles

`pipenv run black app tests`

`pipenv run isort .`

`pipenv run pylint app tests`

## Running tests

`pipenv run pytest`
