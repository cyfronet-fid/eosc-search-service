#!/usr/bin/env bash

mem=$(docker stats eosc-search-service_solr1_1 --no-stream --format "{{.MemUsage}}" | awk '{ print $1 }')
disk=$(docker run --rm -t -v eosc-search-service_solr-data:/volume_data alpine sh -c "du -s /volume_data | cut -f1")

echo "$mem $disk"
