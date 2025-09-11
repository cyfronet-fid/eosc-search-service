export interface IDeployableServiceModel {
  // Core identification
  id: string;
  upstream_id: number;
  pid: string;
  slug: string;

  // Basic information
  title: string[];
  abbreviation: string;
  description: string[];
  tagline: string;
  type: string;
  version: string;
  status: string;

  // URLs and links
  url: string[];

  // Licensing and legal
  license: string;

  // Categorization and metadata
  catalogues: string[];
  node: string;
  scientific_domains: string[];
  keywords: string[];
  keywords_tg: string[];

  // Creator information
  creator_names: string[];
  creator_identifiers: string;
  creator_affiliations: string[];
  creators_searchable: string[];

  // Organization
  resource_organisation: string;

  // Dates and versioning
  publication_date: string;
  updated_at: string;
  synchronized_at?: string;
}
