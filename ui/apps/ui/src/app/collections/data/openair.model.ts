export interface IOpenAIREResult {
  id: string;
  title: string[];
  url: string[];
  author_names: string[];
  urls: string[];
  description: string[];
  publication_date: string[];
  best_access_right: string;
  language: string[];
  type: string;
  scientific_domains: string[];
  keywords: string[];
  open_access: boolean;
  publisher: string;
  author_pids: string[];
  license: string;
  document_type: string[];
  country: string;
  doi: string[];
  usage_counts_views: string;
  usage_counts_downloads: string;
  isResearchProduct: boolean;
  pids: string;
  exportation: InstanceExportData[];
  eosc_if: string[];
  related_organisation_titles: string[];
  affiliation: string[];
  funder: string[];
}

export interface InstanceExportData {
  url: string;
  documentType: string;
  publicationYear: string;
  license?: string;
  hostedby: string;
  extractedDoi?: string;
}
