#!/bin/bash

set -e

SCRIPT="$0"

solr_url="http://localhost:8983"

function usage {
  cat <<EOM
Usage: $SCRIPT [options]
Options:
  --name: collection name
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

if [[ -z "$name" ]]; then
  echo "Missing --name"
  usage
  exit 1
fi

url="$solr_url"
url="$url/solr/admin/collections?action=DELETE"
url="$url&name=$name&wt=json"

echo "Calling: GET $url"
if [[ -z "$dry_run" ]]; then
  curl "$url"
fi