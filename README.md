# EOSC Search Service

## Running with docker

Run `docker-compose up --build`.

## UI
**IMPORTANT!!! UI working directory is `ui`, commands will work only in the catalog.**

### Install dependencies
`npm i --force`

### Run
`npm start`

### Build
Build artifacts can be found in `ui/dist/apps/ui`.

`npm build`

### Code automatic formatting

`npx nx lint --fix`

`npx nx format:write`

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

### Solr schema
1) New schema have to be created for example using "Schema Designer" on the web GUI.
2) The schema should be placed in [solr/config/configsets](https://github.com/cyfronet-fid/eosc-search-service/tree/development/solr/config/configsets)
3) Now schema is available for everyone. Use: `docker compose build`
### Solr collection seeding
Add data to already existing collection
```
curl --location --request POST '<address>:<port>/solr/<collection_name>/update/json/docs' --header 'Content-Type: application/json' -T '<data_file>'
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
- `DATABASE_URI`
  > Format: `postgresql+psycopg2://<db_user>:<db_password>@db:5432/<db_name>`
- `SOLR_URL`
  > Example: `http://solr.domain:8983/solr/`
- `RS_URL`
  > Example: `http://localhost:9080/`
- `BASE_URL`
  > URL of the backend instance, required by AAI. Need to be set before any request will be made. 
- `SECRET_KEY`
- `OIDC_CLIENT_ID`
  > The service ID stored in AAI for auth purposes
- `OIDC_CLIENT_SECRET`
  > Private key of the service need in AAI auth process
- `USER_ACTIONS_QUEUE`
  > Connection URI to databus for user actions 
  > Format `rabbitmq://guest:guest@127.0.0.1:61613/topic/user_actions`
- `USER_ACTIONS_QUEUE_CLIENT_ID`
  > Client id used to identify databus (jms) client
- `RECOMMENDER_ENDPOINT`
  > Recommender endpoint (default http://localhost:8081/recommendations)
- `LOG_LEVEL`
  > Level of logging, allowed values: DEBUG, INFO, ERROR 
- `STOMP_HOST`
  > Example: 127.0.0.1
- `STOMP_PORT`
  > Example: 61613 
- `STOMP_LOGIN`
  > Example: guest 
- `STOMP_PASS`
  > Example: guest 
- `STOMP_USER_ACTIONS_TOPIC`
  > Example: /topic/user_actions 
- `STOMP_CLIENT_NAME`
  > Example: dev-client

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
The cluster should have collection: `oag_researchoutcomes_prod_20211208_v2` (schema: `oa_prod_20211208_v2`).

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
