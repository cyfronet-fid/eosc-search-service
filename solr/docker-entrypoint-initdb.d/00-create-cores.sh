#!/bin/bash

set -e

/opt/docker-solr/scripts/wait-for-zookeeper.sh --max-attempts 3

for entry in /configsets/*/; do
  name="${entry%*/}" # remove trailing /
  name="${name##*/}" # keep all after the last /
  echo "Creating configset: $name"
  /opt/solr/bin/solr zk upconfig -n "$name" -d "$entry"
done