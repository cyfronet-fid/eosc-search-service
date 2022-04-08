#!/bin/bash

set -e

SCRIPT="$0"

solr_url="http://localhost:8983"
s3_endpoint_url="https://s3.cloud.cyfronet.pl"
s3_profile="ess_mock_admin"

function usage {
  cat <<EOM
Usage: $SCRIPT [options] [chunk name]...
Options:
  --collection: collection name
  --solr-url: URL for Solr server to check. Default: $solr_url
  --s3-endpoint-url: S3 endpoint URL to connect to. Default: $s3_endpoint_url
  --s3-prefix: prefix to load chunks from. For example: s3://ess-mock-dumps/oag-2/openaire_prod_20220126/v2/publication/
  --s3-profile: aws tool's profile to use. Default: $s3_profile
  --work-dir: directory where temporary files will be placed
  --dry-run: don't perform the actual download, transform and index operations
EOM
}

while (( $# > 0 )); do
  case "$1" in
   --help)
     usage
     exit 0
     ;;

   --collection)
     collection="$2";
     shift 2;
     ;;

   --solr-url)
     solr_url="$2";
     shift 2
     ;;

   --s3-endpoint-url)
     s3_endpoint_url="$2";
     shift 2
     ;;

   --s3-prefix)
     s3_prefix="$2";
     shift 2
     ;;

   --s3-profile)
     s3_profile="$2";
     shift 2
     ;;

   --work-dir)
     work_dir="$2";
     shift 2
     ;;

   --dry-run)
     dry_run=1;
     shift 1;
     ;;

   * )
     break
     ;;
  esac
done

if [[ -z "$collection" ]] || [[ -z "$s3_prefix" ]] || [[ -z "$work_dir" ]]; then
  echo "Missing --collection AND/OR --s3-prefix AND/OR --work-dir"
  usage
  exit 1
fi

for arg; do
  if [[ $arg == --* ]]; then
    echo "You passed $arg, which either isn't a known argument or was preceded by some chunk names"
    usage
    exit 1
  fi
done

if [ ! -d "$work_dir/stage-0" ] || [ ! -d "$work_dir/stage-1" ]; then
  echo "Create work directory $work_dir with subdirectories stage-0 and stage-1 and run again"
  exit 1
fi

for chunk_name; do
  # download data
  s3_path="$s3_prefix$chunk_name"
  echo "aws --endpoint-url $s3_endpoint_url --profile $s3_profile s3 cp $s3_path $work_dir/stage-0/$chunk_name"
  if [[ -z "$dry_run" ]]; then
    aws --endpoint-url $s3_endpoint_url --profile $s3_profile s3 cp $s3_path $work_dir/stage-0/$chunk_name
  fi
  # process data
  echo "pushd transform"
  pushd ../transform
  echo "pipenv run python transform/v3/tsv_to_jsonl.py ../loader/$work_dir/stage-0/$chunk_name > ../loader/$work_dir/stage-1/$chunk_name.jsonl"
  if [[ -z "$dry_run" ]]; then
    pipenv run python transform/v3/tsv_to_jsonl.py ../loader/$work_dir/stage-0/$chunk_name > ../loader/$work_dir/stage-1/$chunk_name.jsonl
  fi
  echo "popd"
  popd
  # remove downloaded
  echo "rm $work_dir/stage-0/$chunk_name"
  if [[ -z "$dry_run" ]]; then
    rm $work_dir/stage-0/$chunk_name
  fi
  # load data
  echo "docker run --rm -v \"$PWD/$work_dir/stage-1/$chunk_name.jsonl:/data.jsonl\" --network=host solr:8.11 post -url $solr_url/solr/$collection/update /data.jsonl"
  if [[ -z "$dry_run" ]]; then
    docker run --rm -v "$PWD/$work_dir/stage-1/$chunk_name.jsonl:/data.jsonl" --network=host solr:8.11 post -url $solr_url/solr/$collection/update /data.jsonl
  fi
  # remove processed
  echo "rm $work_dir/stage-1/$chunk_name.jsonl"
  if [[ -z "$dry_run" ]]; then
    rm $work_dir/stage-1/$chunk_name.jsonl
  fi
done
