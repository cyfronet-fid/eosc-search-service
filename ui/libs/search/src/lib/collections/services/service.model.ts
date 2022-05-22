import { languageAlphaCode2 } from '../trainings/training-fields.types';

export interface IService {
  id: string;
  pid_s?: string;
  description_t: string;
  slug_s: string;
  name_t: string;
  rating_f: number;
  tagline_t: string;
  resource_organisation_s: string;
  categories_ss: string[];
  scientific_domains_ss: string[];
  providers_ss: string[];
  target_users_ss: string[];
  platforms_ss: string[];
  order_type_s: string;
  geographical_availabilities_ss: languageAlphaCode2;
}
