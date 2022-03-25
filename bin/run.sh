#!/bin/bash

set -e

sizes_file=sizes_file.log
echo "start $(bin/get_mem_and_disk_usage.sh)" >> $sizes_file

tmp_dir=tmp/test-pubs/
rm -rf $tmp_dir
mkdir -p $tmp_dir/stage-0 $tmp_dir/stage-1

collection=test-pubs
# create collection
solr/create-collection.sh --name $collection --config-name oa_prod_20211208_v2

# in loop
while (( $# > 0 )); do
  name=$1
  shift 1
  # download data
  s3_path="s3://ess-mock-dumps/oag-2/openaire_prod_20220126/v2/publication/$name"
  aws --endpoint-url=https://s3.cloud.cyfronet.pl --profile ess_mock_admin s3 cp $s3_path $tmp_dir/stage-0/$name
  # process data
  pushd transform
  pipenv run python transform/v2/tsv_to_jsonl.py ../$tmp_dir/stage-0/$name > ../$tmp_dir/stage-1/$name.jsonl
  popd
  # remove downloaded
  rm $tmp_dir/stage-0/$name
  # load data
  docker run --rm -v "$PWD/$tmp_dir/stage-1/$name.jsonl:/data.jsonl" --network=host solr:8.11 post -c $collection /data.jsonl
  # remove processed
  rm $tmp_dir/stage-1/$name.jsonl
  # run a query to mobilize indexes etc
  curl "http://localhost:8983/solr/$collection/select?defType=edismax&indent=true&q.op=OR&q=energy&qf=title%20description%20author_pids%20author_names%20publisher%20subject"
  # measure memory/disk
  echo "$name $(bin/get_mem_and_disk_usage.sh)" >> $sizes_file
done

# remove collection
solr/delete-collection.sh --name $collection

echo "end $(bin/get_mem_and_disk_usage.sh)" >> $sizes_file