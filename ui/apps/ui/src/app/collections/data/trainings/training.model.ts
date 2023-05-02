export interface ITraining {
  id: string;
  // url: string[];
  title?: string[];
  description?: string[];
  // author_names: string;
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
  // new data set for trainings
  author_names?: string[];
  author_names_tg: string[];
  /* best_access_right: string;
  catalogue: string;
  content_type: string[];
  description: string[];
  eosc_provider: string[];
  geographical_availabilities: string[];
  id: string;
  keywords: string[];
  keywords_tg: string[];
  language: string[];
  learning_outcomes: string[];
  license: string;
  resource_type: string[];
  scientific_domains: string[];
  target_group: string[];
  title: string[];
  unified_categories: string[];

  level_of_expertise: string;
  _version_: string;
  publication_date: string;
  open_access: string;
  type: string;
   */
  catalogue: string;
  resource_organisation?: string;
  url?: string[];
  learning_outcomes?: string[];
  geographical_availabilities?: string[];
  scientific_domains?: string[];
}
