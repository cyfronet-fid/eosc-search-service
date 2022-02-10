# EOSC Search Service UI

## Description
UI representation of search service.

## Development server

Run `npx ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Installation

Nodejs version is managed by [asdf](https://github.com/asdf-vm/asdf).

Run `npm install` to install required packages.

## Build

Run `npx ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npx ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npx ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `npx ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Solr collections

In order for the UI to show results from Solr, you need to load the data to the Solr collections.

In general, the collections will be structured based on source. And then, for each source there may be a number
of collections.
For example:
- oag
  * oag_researchoutcomes_prod_20211208_v2
  * oag_providers_prod_20211208_v2
  * oag_organisations_prod_20211208_v2
- mp
  * mp_v1
- kh
  * kh_v1

The prod_20211208 matches the name of the tables in Hue.
It seems that each time OpenAIRE generates new OAG version it stored in a DB containing such substring.
Then, each such DB has tables like publications, datasets, providers, organisations, etc.
Providers and organisations will be treated separately.
Publications, datasets, etc., will be put into a single collection researchoutcomes (or an alias to that effect).

The trailing _v2, on the other hand designates our version of queries used to get information from this DB.
Apart from the queries, it also translates to a Solr configset and transform scripts.

For now, the UI fixes the collection name to `oag_researchoutcomes_prod_20211208_v2`.
Load the data as described in `/README.md` (version for "queries v2") to this collection or
[create an alias](https://solr.apache.org/guide/8_11/collection-aliasing.html#createalias) to that effect.
