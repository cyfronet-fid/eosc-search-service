# Create all collection
Note that binary data (`.tsv`) can be transformed to JSONL format via `tsv_to_jsonl.py` [script](https://github.com/cyfronet-fid/eosc-search-service/blob/a4662788bc5f62d5f2a804727c8df517ccfbc971/transform/transform/v3/tsv_to_jsonl.py).
## ENV variables
We are using .env to store user-specific constants. This file is not tracked by git and it needs to be present in the project directory. Details:
- `DATASET_PATH` - path to datasets **directory**. Default: `input_data/dataset/`
- `PUBLICATION_PATH` - path to publications **directory**. Default: `input_data/publication/`
- `SOFTWARE_PATH` - path to software **directory**. Default: `input_data/software/`
- `OTHER_RP_PATH` - path to other research products **directory**. Default: `input_data/orther_rp/`
- `TRAINING_PATH` - path to trainings **directory**. Default: `input_data/training/`
- `SERVICE_PATH` - path to services **directory**. Default: `input_data/service/`
- `DATASOURCE_PATH` - path to datasources **directory**. Default: `input_data/datasource/`
- `OUTPUT_PATH` - where the output should be saved? Default: `output`.
- `INPUT_FORMAT` - Format of the input data files. Default: `JSON`.
- `OUTPUT_FORMAT` - Format of the output data files. Default: `JSON`.
- `SOLR_ADDRESS` - Solr address. Default: `http://127.0.0.1`.
- `SOLR_PORT` - Solr port. Default: `8983`.
- `SOLR_DATASET_COLS` - The name of the collection/collections to which datasets will be sent. To specify multiple collections, pass them in `""` and separate them by a space. Example: `"all dataset"`.
- `SOLR_PUBLICATION_COLS` - The name of the collection/collections to which publications will be sent. Example: `"all publication"`.
- `SOLR_SOFTWARE_COLS` - The name of the collection/collections to which software will be sent. Example: `"all software"`.
- `SOLR_OTHER_RP_COLS` - The name of the collection/collections to which other research products will be sent. Example: `"all other_rp"`.
- `SOLR_TRAINING_COLS` - The name of the collection/collections to which trainings will be sent. Example: `"all training"`.
- `SOLR_SERVICE_COLS` - The name of the collection/collections to which services will be sent. Example: `"all service"`.
- `SOLR_DATASOURCE_COLS` - The name of the collection/collections to which datasources will be sent. Example: `"all datasource"`.