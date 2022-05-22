import { resultToTrainingFilter, trainingToResult } from './adapter';
import { SolrQueryParams } from '../../services/search-service/solr-query-params.interface';
import { CollectionSearchMetadata } from '../collection.model';
import { ITraining } from './training.model';

export const trainingsCollection = new CollectionSearchMetadata(
  new SolrQueryParams({
    qf: [],
    collection: 'to be set',
  }),
  {},
  (item: Partial<ITraining>) =>
    trainingToResult(item, 'trainings', 'to be set'),
  resultToTrainingFilter,
  {},
  'Training'
);
