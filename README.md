# EOSC Search Service

## Table of contents
- [Running the Backend with a docker](#running-the-backend-with-a-docker)
- [UI](#ui)
  - [Install dependencies](#install-dependencies)
  - [Run](#run)
  - [Build](#build)
  - [Code auto-formatting](#code-automatic-formatting)
- [Solr](#solr)
  - [Solr schema](#solr-schema)
  - [Solr collection seeding](#solr-collection-seeding)
- [Running Recommender System locally](#running-recommender-system-locally)
- [Deployment](#deployment)
  - [API env variables](#api-env-variables)
    - [General](#general)
    - [Operational](#operational)
    - [Services](#services)
      - [Solr](#solr)
      - [Recommender System](#recommender-system)
      - [STOMP](#stomp)
      - [OIDC](#oidc)
      - [Other](#other)
    - [Redirections](#redirections)
  - [DB env variables](#db-envs)
  - [DB migration](#db-migration)
  - [DB seed](#db-seed)
  - [Solr seed](#solr-seed)
- [Release](#release)
- [Deployment](#deployment)

## Running the Backend with a docker

Run `docker-compose up --build`.

## UI
**IMPORTANT!!! UI working directory is `ui`, commands will work only in the catalog.**

### Compile time environmental variables

UI uses [ng-node-environment](https://github.com/kopz9999/ng-node-environment) to generate variables.
Please consult the documentation of the package for details, but TLDR is following:
every environmental variable prefixed by `NG_` is put into object `sharedEnvironment` in `/ui/apps/ui/src/environments/environment.generated.ts`. As for the names `NG_` prefix 
is removed and rest of the name is converted from `UNDERSCORE_CASE` into `UnderscoreCase`.
Example: when only variable provided is `NG_COLLECTIONS_PREFIX='beta_'` then created
`environment.generated.ts` will look as follows:

```typescript
export const sharedEnvironment = {
  'collectionsPrefix': 'beta_'
}

export default sharedEnvironment;
```

`sharedEnvironment` environment is included in `commonEnvironment` from `environment.common.ts`.
`environment.generated.ts` is generated in `prestart` and `prebuild` scripts which are automatically called when running `npm start` and `npm run build`

### Install dependencies
`npm i --force`

### Run
**IMPORTANT!!! To change collections prefix copy `<root>/.env` file to `<root>/backend` with `COLLECTIONS_PREFIX` env variable.**

`npm start`

### Build
Build artifacts can be found in `ui/dist/apps/ui`.
**IMPORTANT!!! To change collections prefix copy `<root>/.env` file to `<root>/backend` with `COLLECTIONS_PREFIX` env variable.**

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

## Running Recommender System locally

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

### `API` env variables:
#### General:
- `ENVIRONMENT`: `Literal["dev", "test", "production"] = "production"` - Choose environment in which you want to work in.
- `LOG_LEVEL`: `str = "info"` - Logging level.

#### Operational:
- `BACKEND_BASE_URL`: `Url = "http://localhost:8000/"` - your backend URL. 
- `UI_BASE_URL`: `Url = "http://localhost:4200/"` - your UI URL.
- `DATABASE_URI`: `PostgresDsn = "postgresql+psycopg2://ess:ess@localhost:5442/ess"` - your database URI.
- `MAX_RESULTS_BY_PAGE`: `int = 50` - how many results to fetch with a single call to SOLR backend.
- `SHOW_BETA_COLLECTIONS`: `bool = False` - show collections that are in beta version?

#### Services:
##### Solr
- `SOLR_URL`: `Url = "http://localhost:8983/solr/"` - your Solr URL.
- `COLLECTIONS_PREFIX`: `str = ""` - Specify custom prefix for solr collections. Then your specific collection with that prefix will be used by default. Otherwise, determined with a request header, if it's present.
##### Recommender System
- `RS_URL`: `Url = "http://localhost:9080/"` - your Recommender System URL.
- `RECOMMENDER_ENDPOINT`: `Url = "http://localhost:8081/recommendations"` - your endpoint that returns recommendations.
- `SHOW_RECOMMENDATIONS`: `bool = True` - Show recommendations?
- `SHOW_RANDOM_RECOMMENDATIONS`: `bool = True` - Show random recommendations on failure? 
- `IS_SORT_BY_RELEVANCE`: `bool = True` - Enable sort by relevance?
- `MAX_ITEMS_SORT_RELEVANCE`: `int = 250` - Max items send to sort by relevance endpoint.

##### STOMP
- `STOMP_HOST`: `str = "127.0.0.1"` - STOMP host. 
- `STOMP_PORT`: `int = 61613`- STOMP port.
- `STOMP_LOGIN`: `str = "guest"` - STOMP login.
- `STOMP_PASS`: `str = "guest"`- STOMP password.
- `STOMP_USER_ACTIONS_TOPIC`: `str = "/topic/user_actions"` - topic to which user actions will be sent.
- `STOMP_CLIENT_NAME`: `str = "dev-client"` - STOMP client name
- `STOMP_SSL`: `bool = False` - enable SSL?

##### OIDC
- `OIDC_HOST`: `Url = "https://aai-demo.eosc-portal.eu"` - OIDC host.
- `OIDC_CLIENT_ID`: `str = "NO_CLIENT_ID"` - The service ID stored in AAI for auth purposes.
- `OIDC_CLIENT_SECRET`: `str = "NO_CLIENT_SECRET"` - Private key of the service needed in AAI auth process.
- `OIDC_AAI_NEW_API`: `bool = False` - A param switching between new kind of endpoints and old one (AAI changed endpoints between instances)

##### Sentry
- `SENTRY_DSN`: endpoint for Sentry logged errors. For development leave this variable unset.

##### Other
- `RELATED_SERVICES_ENDPOINT`: `Url = "https://beta.providers.eosc-portal.eu/api/public/interoperabilityRecord/relatedResources"` - base URL to get related services for interoperability guidelines.

##### Redirections
- `MARKETPLACE_BASE_URL`: `Url = "https://marketplace.eosc-portal.eu/"` - marketplace base url (used to generate links back to MP).
- `EOSC_COMMONS_URL`: `Url = "https://s3.cloud.cyfronet.pl/eosc-portal-common/"` - Base URL to eosc commons.
- `EOSC_COMMONS_ENV`: `str = "production"` - Environment used to load eosc commons. Together with `EOSC_COMMONS_URL` two assets are loaded:
  > `<EOSC_COMMONS_URL>index.<EOSC_COMMONS_ENV>.min.js` and `<EOSC_COMMONS_URL>index.<EOSC_COMMONS_ENV>.min.css`

- `EOSC_EXPLORE_URL`: `Url = "https://explore.eosc-portal.eu/"` - base URL to OpenAire Explore - used when constructing links for publications, datasets ETC.
- `KNOWLEDGE_HUB_URL`: `Url = "https://knowledge-hub.eosc-portal.eu/"` - base URL to Knowledge Hub.

### `db` envs:
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


### Solr seed

Run `solr1` with the explicit volumes as in `docker-compose.yml`, so that it creates missing configsets in Zookeeper
on startup.

Then, you will need to create collections manually, see the section on Solr.
The cluster should have collection: `oag_researchoutcomes_prod_20211208_v2` (schema: `oa_prod_20211208_v2`).

Populate it using v2 publication data (see v2 comment to https://docs.cyfronet.pl/display/FID/OpenAire+indexable+data).
The records are in `publication/000550_0`. They need to be transformed and pushed to the collection (see also
the Solr section above for how to do it for v2).

## Release
Releases are automatically created based on [release-please-action](https://github.com/google-github-actions/release-please-action).

Procedure:
1. Run [Trigger release](https://github.com/cyfronet-fid/eosc-search-service/actions/workflows/trigger-release.yml)
2. Wait for `automatic-release` action in
  [Actions](https://github.com/cyfronet-fid/eosc-search-service/actions)
  , when action is finished, a new `Pull Request` should occur in
  [Pull requests](https://github.com/cyfronet-fid/eosc-search-service/pulls)
3. Go to `Pull Request` with name format: `chore(master): release x.y.z`, at this level you can customize release data:
    - release version is build based on `x.y.z` version in commit format `chore(master): release x.y.z`,
    - on `x.y.z` version change in commit, update also properly `CHANGELOG.md` section and `version.txt`
    - list of changes that will occur in release is written in `CHANGELOG.md`
    - the changes should land in one commit (squashed or amended) in format `chore(master): release x.y.z`
4. Choose merge option `Rebase and merge`
