# Data upload and transformation for Polish EOSC

### .env variables:
- `DATASET_ADDRESS` - A Rodbuk's datasets address. E.g.: https://rodbuk.pl/api/search?q=*&type=dataset&per_page=1000&metadata_fields=citation:*
- `LICENSE_ADDRESS` - An address for license for a certain dataset based on doi. E.g.: https://rodbuk.pl/api/datasets/export?exporter=dataverse_json&persistentId=
- `SOLR_URL` - - Solr address. Default: `http://149.156.182.2:8983`.
- `SOLR_EOSCPL_DATASET_COLS_NAME` -  The name of the collections to which datasets will be sent. E.g.: "pl_all_collection pl_dataset"
<br></br>