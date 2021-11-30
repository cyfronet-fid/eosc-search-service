# EOSC Search Service

## Running with docker

Run `docker-compose up`.

## Solr

To run a standalone Solr instance run: `docker-compose up -d solr`.
It creates a single core, named `ess`.

Then, to load an example dataset, stored in CSV:
```
docker run --rm -v "$PWD/data.csv:/mydata/data.csv" --network=host solr:8.11 post -c ess /mydata/data.csv
```
This assumes, that Solr instance is available under localhost:8983, i.e. the port 8983 is forwarded to host network.

Obtain an example data sample using for example selects from https://docs.cyfronet.pl/display/FID/OpenAire+indexable+data.
