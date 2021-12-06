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

Obtain an example data sample using for example selects from
https://docs.cyfronet.pl/display/FID/OpenAire+indexable+data.


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
