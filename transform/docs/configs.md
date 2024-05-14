# Solr Actual ConfigSets

This document lists the current versions of Solr collection's configsets.
Each entry specifies the collection name and its corresponding configset version.

Please create Solr collections based on these configs:

- Production

    | **Collection Name** | **ConfigSet Version**     |
    |---------------------|---------------------------|
    | all_collection      | all_collection_oag56_v205 |
    | provider            | provider_v101             |
    | organisation        | organisation_v106         |
    | project             | project_v102              |
    | catalogue           | catalogue_v101            |

- Beta

    | **Collection Name** | **ConfigSet Version**     |
    |---------------------|---------------------------|
    | all_collection      | all_collection_oag56_v205 |
    | provider            | provider_v101             |
    | organisation        | organisation_v106         |
    | project             | project_v102              |
    | catalogue           | catalogue_test_v6            |

These configs can be found [here](../../solr/config/configsets).

**IMPORTANT!** These configs should be also set in [settings](https://github.com/cyfronet-fid/eosc-search-service/blob/cf5d42f0f1c0b6d7c9811290747827c8320b4e61/transform/app/settings.py#L29)! To enable auto-suggesting. 