#!/usr/bin/env bash

docker run --rm --user="$(id -u)" --group-add="$(id -g)" \
    -v $PWD:/target \
    -v $PWD/../eosc-search-service-api:/source \
    openapitools/openapi-generator-cli:v5.3.0 generate \
    -g python-fastapi \
    -i /source/eosc-search-service-v1.yaml \
    -o /target \
    --package-name search_service