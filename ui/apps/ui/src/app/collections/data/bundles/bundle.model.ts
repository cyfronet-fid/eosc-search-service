import { IService } from '@collections/data/services/service.model';

export interface IOffer {
  id: string;
  best_access_right: string;
  description: string[];
  internal: boolean;
  service_id: number;
  title: string[];
  voucherable: boolean;
  _version_: number;
  open_access: boolean;
  status: string;
  service: IService | null;
  bundle_goals: string[];
  dedicated_for: string[];
  capabilities_of_goals: string[];
  helpdesk_url: string[];
  main_offer_id: number;
  offer_ids: number[];
  providers: string[];
  related_training: boolean;
  scientific_domains: string[];
  unified_categories: string[];
  type: string;
  resource_organisation: string;
  offers: object[];
  eosc_if: string[];
}

export interface IBundle {
  dedicated_for: string[];
  description: string[];
  helpdesk_url: string[];
  id: string;
  iid: number[];
  main_offer_id: number;
  offer_ids: number[];
  providers: string[];
  related_training: boolean;
  scientific_domains: string[];
  service_id: number;
  title: string[];
  _version_: number;
  type: string;
  resource_organisation: string;
  bundle_goals: string[];
  capabilities_of_goals: string[];
  unified_categories: string[];
  offers: IOffer[];
  eosc_if: string[];
}
