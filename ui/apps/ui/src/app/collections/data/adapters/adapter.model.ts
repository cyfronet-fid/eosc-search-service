export interface IAdapterModel {
  catalogues: string[];
  changelog: string[];
  description: string[];
  documentation_url: string;
  id: string;
  license: string;
  logo?: string;
  node?: string;
  publication_date: string;
  programming_language: string;
  repository: string;
  related_guidelines?: string[];
  related_services?: string[];
  tagline?: string;
  title: string[];
  type: string;
  version: string;
  keywords?: string[];
  sqa_badge?: string | string[];
  creator_names?: string[];
  creator_identifiers?: string;
  creator_affiliations?: string[];
  package?: string;
}
