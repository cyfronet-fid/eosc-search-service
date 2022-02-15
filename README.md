# EOSC Search Service

## Running with docker

Run `docker-compose up`.


## Solr

To run a standalone Solr instance run: `docker-compose up -d solr1 zoo1`.
It registers all configsets from `/solr/config/configsets/`.

To access the web interface go to http://localhost:8983/solr.

To upload an additional configset:
```shell
docker run --rm -v "$PWD/solr/config/configsets:/configsets" --network=host solr:8.11 \
       solr zk upconfig -n "<name>" -d "/configsets/<name>" -z localhost:2181
```

To create a new collection, run
```shell
solr/create-collection.sh --name ess --config-name base-1
```

Obtain an example data sample using for example selects from
https://docs.cyfronet.pl/display/FID/OpenAire+indexable+data.

Below assumes that Solr instance is available under localhost:8983, i.e. the port 8983
is forwarded to host network.

### mock-dump-1

Then, to load an example dataset, stored in CSV:
```
docker run --rm -v "$PWD/data.csv:/mydata/data.csv" \
           --network=host \
           solr:8.11 \
           post -c ess /mydata/data.csv
```

### mock-dump-2

Either use directly the jsonl file or transform the original using (assuming the file is placed in `tmp/000017_0`):
```
python transform/tsv-to-jsonl-1.py tmp/000017_0 > tmp/000017_0.jsonl
```

Then, load such a sanitized dataset:
```
docker run --rm -v "$PWD/tmp/000017_0.jsonl:/mydata/data.jsonl" \
           --network=host \
           solr:8.11 \
           post -c ess /mydata/data.jsonl
```

### queries v2

How to load output of version 2 of the Hive queries, as available in: https://docs.cyfronet.pl/display/FID/Queries+v2.

Either use directly the jsonl file or transform the original using (assuming the file is placed in `tmp/qv2-pub/000550_0`):
```
python transform/v2/tsv_to_jsonl.py tmp/qv2-pub/000550_0 > tmp/qv2-pub/000550_0.jsonl
```

To process datafiles without journal (you can check for it in the confluence page) set envvar `OMIT_JOURNAL=1` for
processing.

Then, load such a sanitized dataset:
```
docker run --rm -v "$PWD/tmp/000017_0.jsonl:/mydata/data.jsonl" \
           --network=host \
           solr:8.11 \
           post -c ess /mydata/data.jsonl
```


## Running RS locally

Check-out the code from
https://git.man.poznan.pl/stash/scm/eosc-rs/online-ml-ai-engine.git
(commit ea3545a6fc3 at the time of writing) to a separate directory, and
build the image:
```shell
docker build -t "omae:0.0.1" .
```

Then, run the image:
```shell
docker run -p 9080:80 omae:0.0.1
```


## Deployment

There are to be two machines:
- (I) for db, api and RS mock
- (II) for solr.
See docker-compose.yml for components.

`api` envs:
- `DATABASE_URI`, in format: `postgresql+psycopg2://<db_user>:<db_password>@db:5432/<db_name>`
- `SOLR_URL`, for example `http://solr.domain:8983/solr/`
- `RS_URL`, for example `http://localhost:9080/`
- `SECRET_KEY`
- `OIDC_CLIENT_ID`
- `OIDC_CLIENT_SECRET`

`db` envs:
- `DB_POSTGRES_DB`
- `DB_POSTGRES_USER`
- `DB_POSTGRES_PASSWORD`

The RS mock (online-ml-ai-engine, omae) should be deployed as described in "Running RS locally",
with `api`'s RS_URL pointed at it.

`solr1` envs:
- `ZK_HOST`, comma separated Zookeeper hosts, e.g. `zoo1:2181` or `zoo1:2181,zoo2:2181,zoo3:2181`

`zoo1` doesn't have any envs.

### DB migration

DB has to be migrated after code changes, to do it run alembic in the
`/backend/Dockerfile` image, setting the `DATABASE_URI` env.

```shell
docker run --rm \
           --network "<ess-local_network>" \
           -e "DATABASE_URI=<as_for_api_above>" \
           -it $(docker build -q ./backend) \
           pipenv run alembic upgrade head
```


### DB seed

Add the new dump content by running:
```shell
docker run --rm \
           --network "<ess-local_network>" \
           -e "DATABASE_URI=<as_for_api_above>" \
           -it $(docker build -q ./backend) \
           pipenv run python -m app.manager db seed-oag-2
```


### Solr

Run `solr1` with the explicit volumes as in `docker-compose.yml`, so that it creates missing configsets in Zookeeper
on startup.

Then, you will need to create collections manually, see the section on Solr.
The cluster should have collection: `publication_oa_prod_20211208_v2` (schema: `oa_prod_20211208_v2`).

Populate it using v2 publication data (see v2 comment to https://docs.cyfronet.pl/display/FID/OpenAire+indexable+data).
The records are in `publication/000550_0`. They need to be transformed and pushed to the collection (see also
the Solr section above for how to do it for v2).

## Releasing

To create a release commit use the [standard-version](https://github.com/conventional-changelog/standard-version).

To create a release:
```
npx standard-version
```
It will update the changelog and create a tag (according to the Conventional Commits spec).

Then you have to push the tag and the commit to the remote.

On pushing to remote a release with an extended changelog should be created.