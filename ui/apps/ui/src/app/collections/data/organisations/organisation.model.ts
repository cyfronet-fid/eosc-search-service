import { IValueWithLabel } from '@collections/repositories/types';

export interface IOrganisation {
  country: string;
  title: string;
  abbreviation: string;
  url: string;
  type: IValueWithLabel;
  related_publication_number?: number;
  related_dataset_number?: number;
  related_other_number?: number;
  related_project_number?: number;
  related_software_number?: number;
}
