from app.settings import settings


def ids_mapping(id_: int | str, col_name: str) -> str:
    """Map ids"""
    match col_name:
        case "service":
            return str(id_ + settings.SERVICE_IDS_INCREMENTOR)
        case "data source":
            return str(id_ + settings.DATA_SOURCE_IDS_INCREMENTOR)
        case "provider":
            return str(id_ + settings.PROVIDER_IDS_INCREMENTOR)
        case "offer":
            return str(id_ + settings.OFFER_IDS_INCREMENTOR)
        case "bundle":
            return str(id_ + settings.BUNDLE_IDS_INCREMENTOR)
        case "catalogue":
            return str(id_ + settings.CATALOGUE_IDS_INCREMENTOR)
        case _:
            return id_


def get_default_headers() -> dict:
    """Return default headers for Solr API requests."""
    return {"Accept": "application/json", "Content-Type": "application/json"}
