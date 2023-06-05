export interface ITraining {
  id: string;
  title?: string[];
  description?: string[];
  language: string;
  keywords: string[];
  license: string;
  best_access_right: string;
  publication_date: string;
  resource_type: string;
  content_type: string;
  URL_s: string;
  eosc_provider: string;
  format: string;
  level_of_expertise: string;
  target_group: string;
  qualification: string;
  duration: string;
  type: string;
  usage_counts_views: string;
  usage_counts_downloads: string;
  author_names?: string[];
  author_names_tg: string[];
  catalogue: string;
  resource_organisation?: string;
  url?: string[];
  url_type?: string;
  learning_outcomes?: string[];
  geographical_availabilities?: string[];
  scientific_domains: string[];
}
