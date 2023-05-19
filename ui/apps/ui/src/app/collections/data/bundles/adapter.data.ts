import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { v4 as uuidv4 } from 'uuid';
import { COLLECTION } from './search-metadata.data';
import { IBundle, IOffer } from '@collections/data/bundles/bundle.model';
import { parseStatistics } from '@collections/data/utils';
import { ConfigService } from '../../../services/config.service';

export const bundlesAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    bundle: Partial<IBundle> & { id: string }
  ): IResult & { offers: IOffer[] } => ({
    id: uuidv4(),
    title: bundle['title']?.join(' ') || '',
    description: bundle['description']?.join(' ') || '',
    type: {
      label: `Service ${bundle['type']}` || '',
      value: 'bundle',
    },
    collection: COLLECTION,
    url: `${ConfigService.config?.marketplace_url}/services/${bundle.service_id}`,
    coloredTags: [],
    tags: [],
    offers: bundle.offers ?? [],
    ...parseStatistics(bundle),
  }),
};
