export interface IProject {
  id: string;
  _version_: number;
  type: string;
  funding_title?: string;
  title?: string;
  abbreviation?: string;
  open_access_mandate_for_publications?: boolean;
  open_access_mandate_for_dataset?: boolean;
  description?: string;
  code?: string;
  tag_list?: string[];
  funded_amount?: number;
  currency?: string;
  total_cost?: number;
  keywords?: string[];
  funding_stream_title?: string;
  start_date?: string;
  end_date?: string;
  date_range: string;
  year_range: string;
  related_organisation_titles?: string;
}
