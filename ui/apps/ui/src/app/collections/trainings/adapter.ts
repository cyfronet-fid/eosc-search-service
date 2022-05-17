import { ITraining } from './training.model';
import { IResult } from '../../result/result.model';

export const trainingToResult = (
  training: Partial<ITraining>,
  typeUrlPath: string,
  collection: string
): IResult => ({
  title: training.title || '',
  description: training.description || '',
  Author: training.author || '',
  type: 'Trainings',
  typeUrlPath,
  collection,
  url: '',
  fieldToFilter: {},
  fieldsToTags: ['Author'],
});
export const resultToTrainingFilter = {
  Author: 'author',
};
