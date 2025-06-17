export interface IAdapterModel {
  catalogues: string[];
  changelog: string[];
  code_repository_url: string;
  description: string[];
  documentation_url: string;
  id: string;
  last_update: string;
  license: string;
  logo?: string;
  node?: string;
  programming_language: string;
  related_guidelines?: string[];
  related_services?: string[];
  releases: string[];
  tagline?: string;
  title: string[];
  type: string;
  version: string;
}
