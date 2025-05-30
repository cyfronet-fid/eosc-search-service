import { IValueWithLabel } from '@collections/repositories/types';

export interface ICatalogue {
  id: string;
  title: string;
  abbreviation: string;
  description: string;
  legal_status: string[];
  scientific_domains: string[];
  keywords: string[];
  publication_date: string;
  pid: string;
  type: IValueWithLabel;
  node: string;
}
