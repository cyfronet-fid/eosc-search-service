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
  releases: string[];
  tagline?: string;
  title: string[];
  type: string;
  version: string;
  keywords?: string[];
}
