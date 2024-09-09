# Dataset input schema
# TODO include citation:*
"""
    name: str,
    type: str,
    url: str,
    global_id: str, # DOI
    description: str,
    published_at: date,
    publisher: str,
    citationHtml: str,
    identifier_of_dataverse: str,
    name_of_dataverse: str,
    citation: str,
    country: arr[str],
    storageIdentifier: str,
    keywords: arr[str],
    subjects: arr[str], # empty for all resources
    fileCount: int,
    versionId: int,
    versionState: str,
    majorVersion: int,
    createdAt: date,
    updatedAt: date,
    contacts: arr[{name: str, affiliation: str}],
    authors: arr[str],
    publications: arr[{citation: str, url: str}],
    producers: arr[str],
"""
