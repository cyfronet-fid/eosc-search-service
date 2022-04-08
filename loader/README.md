# Loader

Tools for data loading.

## How to use

The scripts here are meant to facilitate loading data into a Solr collection.
They assume the data (~TSV) is stored in a Ceph bucket under a common prefix and objects are named `XXXXXX_0`,
for example `000123_0`.

We assume the Solr instance is available from the loader instance at `http://solr:8983`.
If you don't have a collection with proper schema (i.e. `oa_prod_20211208_v2`) then create it beforehand, we assume
here it's named `test-pubs`.
Refer to `../README.md` for exact instructions.

You will also need read access to Ceph, configure an [aws-cli](https://github.com/aws/aws-cli/) with appropriate
credentials. Save the credentials in profile `loader_user`.

(Bear in mind that the commands must be run in the folder this README is placed in and all the repo should be in place.)

Then, generate the chunk names to load with: `bin/gen_chunks.py`.
For example, to generate chunk names from `000000_0` to `000010_0` run `bin/gen_chunks.py range 0 11`
(Refer to the tool's help for other options.)

Then, dry-run the actual loader:
```
bin/load_chunks.sh --dry-run \
                   --collection test-pubs \
                   --solr-url http://solr:8983 \
                   --s3-prefix s3://ess-mock-dumps/oag-2/openaire_prod_20220126/v2/publication/ \
                   --s3-profile loader_user \
                   --work-dir tmp \
                   `bin/gen_chunks.py range 0 11`
```

If you followed the instructions then you will get an error to create the temporary directory,
run `mkdir -p tmp/stage-0 tmp/stage-1` to correct it and run again. You should get a listing of all the actions
the loader will take.

Remove the `--dry-run` and execute the command again. The loader will perform the actual loading now.
It is normal to get a bunch of `Incorrect length` error during transformation from TSV to JSONL.
However, the Solr POST tool's output should look similar to this:
```
docker run --rm -v [redacted]/loader/tmp/stage-1/001092_0.jsonl:/data.jsonl --network=host solr:8.11 post -url http://solr:8983/solr/test-pubs/update /data.jsonl
/usr/local/openjdk-11/bin/java -classpath /opt/solr/dist/solr-core-8.11.1.jar -Dauto=yes -Durl=http://solr:8983/solr/test-pubs/update -Dc= -Ddata=files org.apache.solr.util.SimplePostTool /data.jsonl
SimplePostTool version 5.0.0
Posting files to [base] url http://solr:8983/solr/test-pubs/update...
Entering auto mode. File endings considered are xml,json,jsonl,csv,pdf,doc,docx,ppt,pptx,xls,xlsx,odt,odp,ods,ott,otp,ots,rtf,htm,html,txt,log
POSTing file data.jsonl (application/json) to [base]/json/docs
1 files indexed.
COMMITting Solr index changes to http://solr:8983/solr/test-pubs/update...
Time spent: 0:01:20.960
```


## Useful commands

To investigate the memory and disk used by Solr container you can use a script similar to the following:
```bash
#!/usr/bin/env bash

mem=$(docker stats <solr_container> --no-stream --format "{{.MemUsage}}" | awk '{ print $1 }')
disk=$(docker run --rm -t -v <solr_data_volume>:/volume_data alpine sh -c "du -s /volume_data | cut -f1")

echo "$mem $disk"
```
