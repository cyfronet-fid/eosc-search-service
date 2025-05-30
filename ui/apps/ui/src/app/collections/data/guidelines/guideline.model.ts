export interface IGuideline {
  author_names?: string[];
  author_names_tg?: string[];
  author_types?: string[];
  description?: string[];
  doi?: string[] | null;
  eosc_guideline_type?: string;
  eosc_integration_options?: string[];
  id: string | number;
  publication_date?: string;
  publication_year?: number;
  right_id?: string[];
  right_title?: string[];
  right_uri?: string[];
  status?: string;
  title?: string[];
  type?: string;
  type_info?: string[];
  updated_at?: string;
  domain?: string;
  providers?: string[];
  provider_name?: string;
  author_affiliations?: string[];
  author_affiliations_id?: string[];
  author_family_names?: string[];
  author_given_names?: string[];
  author_names_id?: string[];
  catalogue?: string;
  related_standards_uri?: string[];
  related_standards_id?: string[];
  type_general: string[];
  uri?: string[];
  keywords?: string[];
  creators: string | '';
  related_services: Record<string, string>[];
  node: string;
}

export interface ICreators {
  author_name_type_info: IAuthorNameTypeInfo;
  author_names: string;
  author_types: string | string[];
  author_given_names: string;
  author_family_names: string;
  author_names_id: string;
  author_affiliation_info: IAuthorAffiliationInfo;
  author_affiliations: string;
  author_affiliations_id: string;
}

export interface IAuthorAffiliationInfo {
  affiliation: string;
  affiliationIdentifier: string;
}

export interface IAuthorNameTypeInfo {
  author_names: string;
  author_types: string;
}
