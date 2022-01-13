#!/bin/bash

set -e

SCRIPT="$0"

solr_url="http://localhost:8983"
num_shards="1"

function usage {
  cat <<EOM
Usage: $SCRIPT [options]
Options:
  --name: collection name
  --config-name: config name
  --num-shards: number of shards. Default: $num_shards
  --solr-url: URL for Solr server to check. Default: $solr_url
  --dry-run: don't perform the request
EOM
}

while (( $# > 0 )); do
  case "$1" in
   --help)
     usage
     exit 0
     ;;

   --name)
     name="$2";
     shift 2;
     ;;

   --config-name)
     config_name="$2";
     shift 2;
     ;;

   --num-shards)
     num_shards="$2";
     shift 2;
     ;;

   --solr-url)
     solr_url="$2";
     shift 2
     ;;

   --dry-run)
     dry_run=1;
     shift 1;
     ;;

   * )
     usage
     exit 1
     ;;
  esac
done

if [[ -z "$name" ]] || [[ -z "$config_name" ]]; then
  echo "Missing --name AND/OR --config-name"
  usage
  exit 1
fi

url="$solr_url"
url="$url/solr/admin/collections?action=CREATE"
url="$url&name=$name&collection.configName=$config_name&numShards=$num_shards&wt=json"

echo "Calling: GET $url"
if [[ -z "$dry_run" ]]; then
  curl "$url"
fi