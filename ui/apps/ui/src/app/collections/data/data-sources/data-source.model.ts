export interface IDataSource {
  id: string;
  description: string[];
  title: string[];
  access_types: string[];
  language: string[];
  scientific_domains: string[];
  resource_organisation: string;
  pid: string;
  best_access_right: string;
  type: string;
  usage_counts_views: string;
  usage_counts_downloads: string;
  tag_list: string[];
  horizontal: boolean;
  guidelines: string[];
  eosc_if: string[];
}
