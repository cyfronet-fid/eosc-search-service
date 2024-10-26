.. contents:: Table of Contents
   :local:

Introduction
============

The EOSC Data Transform Service is a service that supplies the EOSC Search Service portal with data from various sources. The data is collected, transformed to meet our requirements, and then sent to external services such as Solr and Amazon S3 Cloud.

The data obtained from APIs includes ``services, data sources, providers, offers, bundles, trainings, interoperability guidelines``. These data are updated in real-time, but there is also a possibility of updating all records.

The data obtained from dumps includes ``publications, datasets, software, other research products, organizations, and projects``. Live updates are not available, only batch updates.

Documentation
=============
The service uses Sphinx for generating both local and public documentation. Follow the instructions below to access the documentation.

Public Documentation
---------------------
The public documentation for the EOSC Data Transform Service is available online at `Read the Docs <https://eosc-search-service.readthedocs.io/en/latest/index.html>`_.
This should be your first point of reference for detailed information about the service.

Local Sphinx Documentation
---------------------------
You can generate and view the Sphinx documentation locally by running the following command in the docs directory:

.. code-block:: shell

   make html

Once generated, the documentation will be available at `docs/build/html/index.html`. Open it in a browser to navigate the API, Schemas and other documentation.

To remove old build files and ensure a fresh documentation generation, use the following command before running `make html`:

.. code-block:: shell

   make clean

This will delete the `docs/build/` directory, allowing Sphinx to regenerate all files from scratch.

API
===

Transform Endpoints
-------------------

- ``/batch`` - handles a live update. One or more resources per request.
- ``/full`` - handles an update of the whole data collection.
- ``/dump`` - handles a dump update to create a single data iteration.

Solr Manipulation Endpoints
---------------------------

- ``/create_collections`` - creates all necessary Solr collections for a single data iteration.
- ``/create_aliases`` - creates aliases for all collections from a single data iteration.
- ``/delete_collections`` - deletes all collections from a single data iteration.

Deployment
==========

1. Get Solr instance and/or Amazon S3 bucket.
2. Adjust ``docker-compose.yml`` to your requirements.
3. Set ``.env`` variables.
4. Deployment is simple and easy. Type:

.. code-block:: shell

    docker-compose up -d --build
    docker-compose up

Dependencies
------------

- ``Solr`` instance (optional) **and/or** ``Amazon S3 cloud`` (optional). At least one of them is necessary.

ENV variables
-------------

We are using ``.env`` (in the root of the EOSC Transform Service) to store user-specific constants. Details:

General
^^^^^^^
- ``ENVIRONMENT``: ``Literal["dev", "test", "production"] = "dev"`` - Choose environment in which you want to work in.
- ``LOG_LEVEL``: ``str = "info"`` - Logging level.
- ``SENTRY_DSN`` - endpoint for Sentry logged errors. For development leave this variable unset.

Services
^^^^^^^^
Solr
----
- ``SOLR_URL``: ``AnyUrl = "http://localhost:8983/solr/"`` - Solr address.
- ``SOLR_COLS_PREFIX``: ``str = ""`` - The prefix of the Solr collections to which data will be sent.

S3
--
- ``S3_ACCESS_KEY``: ``str = ""`` - Your S3 access key with write permissions.
- ``S3_SECRET_KEY``: ``str = ""`` - Your S3 secret key with write permissions.
- ``S3_ENDPOINT``: ``str = ""`` - S3 endpoint. Example: ``https://s3.cloud.com``.
- ``S3_BUCKET``: ``str = ""`` - S3 bucket. Example: ``ess-mock-dumps``.

STOMP
-----
- ``STOMP_SUBSCRIPTION``: ``bool = True`` - Subscribe to JMS?
    - ``STOMP_HOST``: ``str = "127.0.0.1"`` - The hostname or IP address of the STOMP broker.
    - ``STOMP_PORT``: ``int = 61613``- The port on which the STOMP broker is listening.
    - ``STOMP_LOGIN``: ``str = "guest"`` - The username for connecting to the STOMP broker.
    - ``STOMP_PASS``: ``str = "guest"``- The password for connecting to the STOMP broker.
    - ``STOMP_CLIENT_NAME``: ``str = "transformer-client"`` - A name to identify this STOMP client instance.
    - ``STOMP_SSL``: ``bool = False`` - Set to ``True`` to enable SSL for the STOMP connection. Ensure SSL certificates are properly configured if this is enabled.

Sources of Data
^^^^^^^^^^^^^^^
Local Data Dump
---------------

- ``DATASET_PATH``: ``str`` - A path to datasets **directory**.
- ``PUBLICATION_PATH``: ``str`` - A path to publications **directory**.
- ``SOFTWARE_PATH``: ``str`` - A path to software **directory**.
- ``OTHER_RP_PATH``: ``str`` - A path to other research products **directory**.
- ``ORGANISATION_PATH``: ``str`` - A path to organisation **directory**.
- ``PROJECT_PATH``: ``str`` - A path to project **directory**.

Relations
---------

- ``RES_ORG_REL_PATH``: ``str`` - A path to resultOrganization **directory**.
- ``RES_PROJ_REL_PATH``: ``str`` - A path to resultProject **directory**.
- ``ORG_PROJ_REL_PATH``: ``str`` - A path to organizationProject **directory**.

Data from API
-------------

- ``MP_API_ADDRESS``: ``AnyUrl = "https://marketplace.sandbox.eosc-beyond.eu"`` - A Marketplace API address.
- ``MP_API_TOKEN``: ``str`` - An authorization token for the Marketplace API.
- ``GUIDELINE_ADDRESS``: ``AnyUrl = "https://integration.providers.sandbox.eosc-beyond.eu/api/public/interoperabilityRecord/all?catalogue_id=all&active=true&suspended=false&quantity=10000"`` - A full address to get all interoperability guidelines **endpoint**.
- ``TRAINING_ADDRESS``: ``AnyUrl = "https://integration.providers.sandbox.eosc-beyond.eu/api/public/trainingResource/all?catalogue_id=all&active=true&suspended=false&quantity=10000"`` - A full address to get all trainings **endpoint**.

Transformation General Settings
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
- ``INPUT_FORMAT``: ``str = "json"`` - Format of the input data files.
- ``OUTPUT_FORMAT``: ``str = "json"`` - Format of the output data files.

Running Service
===============

How to use the service? Upon successful launch of the service, the following components will be initiated:

- ``EOSC Transform Service``: by default, at http://0.0.0.0:8080 and http://0.0.0.0:8080/docs to access Swagger. It can be used to trigger actions.
- ``Flower Dashboard``: by default, at http://0.0.0.0:5555 to view current and past actions and monitor them.
