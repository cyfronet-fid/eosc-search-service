# Create all collection
## ENV variables
We are using .env to store user-specific constants. This file is not tracked by git and it needs to be present in the project directory. Details:
### Data dump:
- `DATASET_PATH` - A path to datasets **directory**. Default: `input_data/dataset/`
- `PUBLICATION_PATH` - A path to publications **directory**. Default: `input_data/publication/`
- `SOFTWARE_PATH` - A path to software **directory**. Default: `input_data/software/`
- `OTHER_RP_PATH` - A path to other research products **directory**. Default: `input_data/orther_rp/`
- `SERVICE_PATH` - A path to services **directory**. Default: `input_data/service/`
- `DATASOURCE_PATH` - A path to datasources **directory**. Default: `input_data/datasource/`
- `PROVIDER_PATH` - A path to providers **directory**. Default: `input_data/provider/`
- `BUNDLE_PATH` - A path to bundles **directory**. Default: `input_data/bundle/`

### Data from API:
- `GUIDELINE_ADDRESS` - A full address to get all interoperability guidelines **endpoint**. Default: `https://beta.providers.eosc-portal.eu/api/interoperabilityRecord/all`
- `TRAINING_ADDRESS` - A full address to get all trainings **endpoint**. Default: `https://beta.providers.eosc-portal.eu/api/trainingResource/all`
<br></br>

### Other data related params:
- `INPUT_FORMAT` - Format of the input data files. Default: `JSON`.
- `OUTPUT_FORMAT` - Format of the output data files. Default: `JSON`.
- `OUTPUT_PATH` - Where the output should be locally saved? **IMPORTANT**: during each iteration the whole content of this path will be deleted! Therefore, use some empty path. Default: `output/`.
<br></br>

### Third party services:
- `SEND_TO_SOLR` -  A flag which indicates if data should be sent to Solr. Default `True`.
  <br> To send data to Solr it is needed to provide also:
  - `SOLR_ADDRESS` - Solr address. Default: `http://127.0.0.1`.
  - `SOLR_PORT` - Solr port. Default: `8983`.
  - `SOLR_DATASET_COLS` - The name of the collection/collections to which datasets will be sent. To specify multiple collections, pass them in `""` and separate them by a space. Example: `"all dataset"`.
  - `SOLR_PUBLICATION_COLS` - The name of the collection/collections to which publications will be sent. Example: `"all publication"`.
  - `SOLR_SOFTWARE_COLS` - The name of the collection/collections to which software will be sent. Example: `"all software"`.
  - `SOLR_OTHER_RP_COLS` - The name of the collection/collections to which other research products will be sent. Example: `"all other_rp"`.
  - `SOLR_TRAINING_COLS` - The name of the collection/collections to which trainings will be sent. Example: `"all training"`.
  - `SOLR_SERVICE_COLS` - The name of the collection/collections to which services will be sent. Example: `"all service"`.
  - `SOLR_DATASOURCE_COLS` - The name of the collection/collections to which datasources will be sent. Example: `"all datasource"`.
  - `SOLR_PROVIDER_COLS` - The name of the collection/collections to which providers will be sent. Example: `"provider"`.
  - `SOLR_GUIDELINE_COLS` - The name of the collection/collections to which interoperability guidelines will be sent. Example: `"guideline"`.
  - `SOLR_BUNDLE_COLS` - The name of the collection/collections to which bundles will be sent. Example: `"all bundle"`.
<br></br>
- `SEND_TO_S3` - A flag which indicates if data should be sent to S3. Default `False`.
  <br> To send data to S3 it is needed to provide also:
  - `S3_ACCESS_KEY` - Your S3 access key with write permissions.
  - `S3_SECRET_KEY` - Your S3 secret key with write permissions.
  - `S3_ENDPOINT` - S3 endpoint. Example: `https://s3.cloud.com`.
  - `S3_BUCKET` - S3 bucket. Example: `ess-mock-dumps`.
  <br></br>
- `CREATE_LOCAL_DUMP` - A flag which indicates if output files should be preserved and packed into local archive. Default `False`.
  <br> To create local dump you can also provide:
  - `LOCAL_DUMP_PATH` - A destination path for the local dump. Default: `<current_date>_ess_dump`
