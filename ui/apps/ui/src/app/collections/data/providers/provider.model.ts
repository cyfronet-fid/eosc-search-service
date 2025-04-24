import { IValueWithLabel } from '@collections/repositories/types';

export interface IProvider {
  abbreviation: string;
  affiliations: string[];
  areas_of_activity: string[];
  catalogue: string;
  certifications: string[];
  city: string;
  country: string[];
  description: string[];
  esfri_domains: string[];
  esfri_type: string;
  hosting_legal_entity: string;
  id: string;
  legal_entity: boolean;
  legal_status: string;
  life_cycle_status: string;
  meril_scientific_domains: string[];
  multimedia_urls: string[];
  national_roadmaps: string[];
  networks: string[];
  participating_countries: string[];
  pid: string;
  postal_code: string;
  region: string;
  scientific_domains: string[];
  slug: string;
  societal_grand_challenges: string[];
  street_name_and_number: string;
  structure_types: string[];
  keywords: string[];
  keywords_tg: string[];
  webpage_url: string[];
  title: string;
  _version_: number;
  type: IValueWithLabel;
}
