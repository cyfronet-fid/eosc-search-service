"""Schema for dump update request body"""

from typing import Literal, Union

from pydantic import AnyUrl, BaseModel, conlist

from app.settings import settings


class PeripheralData(BaseModel):
    """Data not included in the dump that can be obtained via API"""

    mp_api_addresses: str = ""
    mp_api_token: str = ""
    guideline_address: str = ""
    training_address: str = ""


class BaseInstance(PeripheralData):
    """Base class for all instances"""

    type: Literal["solr", "s3"]


class SolrInstance(BaseInstance):
    """Solr instance"""

    type: Literal["solr"]
    url: AnyUrl = settings.SOLR_URL
    cols_prefix: str = "oag<dump_version>"
    all_col_conf: str = settings.SOLR_ALL_COL_CONF
    org_conf: str = settings.SOLR_ORG_CONF
    proj_conf: str = settings.SOLR_PROJ_CONF
    provider_conf: str = settings.SOLR_PROVIDER_CONF
    cat_conf: str = settings.SOLR_CAT_CONF
    num_shards: int = 1
    replication_factor: int = 1


class S3Instance(BaseInstance):
    """S3 instance"""

    type: Literal["s3"]
    s3_output_url: str = None


class DumpUpdateRequest(BaseModel):
    """Dump update request"""

    dump_url: AnyUrl
    records_threshold: int
    instances: conlist(Union[SolrInstance, S3Instance], min_length=1)

    # Update swagger request body example
    class Config:
        json_schema_extra = {
            "example": {
                "dump_url": "https://example.com/",
                "records_threshold": 1000,
                "instances": [
                    {
                        "type": "solr",
                        "url": settings.SOLR_URL,
                        "cols_prefix": "oag<ver>_YYYYMMDD_",
                        "all_col_conf": settings.SOLR_ALL_COL_CONF,
                        "org_conf": settings.SOLR_ORG_CONF,
                        "proj_conf": settings.SOLR_PROJ_CONF,
                        "provider_conf": settings.SOLR_PROVIDER_CONF,
                        "cat_conf": settings.SOLR_CAT_CONF,
                        "num_shards": 1,
                        "replication_factor": 1,
                        "mp_api_addresses": "",
                        "mp_api_token": "",
                        "guideline_address": "",
                        "training_address": "",
                    },
                    {
                        "type": "s3",
                        "mp_api_addresses": "",
                        "mp_api_token": "",
                        "guideline_address": "",
                        "training_address": "",
                        "s3_output_url": "",
                    },
                ],
            }
        }

    def dict_for_celery(self) -> dict:
        """Convert all AnyUrl fields to strings for Celery serialization"""
        d = self.dict()
        d["dump_url"] = str(d["dump_url"])
        for instance in d.get("instances", []):
            if "url" in instance:
                instance["url"] = str(instance["url"])
            if "all_col_conf" in instance:
                instance["all_col_conf"] = str(instance["all_col_conf"])
            if "cat_conf" in instance:
                instance["cat_conf"] = str(instance["cat_conf"])
            if "org_conf" in instance:
                instance["org_conf"] = str(instance["org_conf"])
            if "proj_conf" in instance:
                instance["proj_conf"] = str(instance["proj_conf"])
            if "provider_conf" in instance:
                instance["provider_conf"] = str(instance["provider_conf"])
        return d
