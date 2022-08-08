# Create all collection
Note that binary data (`.tsv`) can be transformed to JSONL format via `tsv_to_jsonl.py` [script](https://github.com/cyfronet-fid/eosc-search-service/blob/a4662788bc5f62d5f2a804727c8df517ccfbc971/transform/transform/v3/tsv_to_jsonl.py).
## ENV variables
We are using .env to store user-specific constants. This file is not tracked by git and it needs to be present in the project directory. Details:
- `DATASET_PATH` - path to datasets data file.
- `PUBLICATION_PATH` - path to publications data file.
- `SOFTWARE_PATH` - path to software data file.
- `TRAININGS_PATH` - path to trainings data file.
- `SERVICES_PATH` - path to services data file (optional).
- `OUTPUT_PATH` - where the output should be saved? Default: `output`
- `INPUT_FORMAT` - Format of the input data files. Default: `JSON`.
- `OUTPUT_FORMAT` - Format of the output data files. Default: `JSON`.