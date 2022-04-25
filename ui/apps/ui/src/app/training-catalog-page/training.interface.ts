import {
  accessCost,
  accessRight,
  expertiseLevel,
  languageAlphaCode2,
  learningResourceType,
  licenceId,
  urlResourceType,
} from './training-fields.types';

export interface ITraining {
  title: string;
  author: string;
  description: string;
  languageAlphaCode2: languageAlphaCode2;
  keywords: string[];
  licence: licenceId;
  accessRights: accessRight[];
  format: string;
  targetGroup: string;
  organization: string;
  rating: number;
  versionDate: string;
  urlToResource: string;
  urlResourceType: urlResourceType;
  learningResourceType: learningResourceType;
  learningOutcomes: string;
  accessCost: accessCost;
  expertiseLevel: expertiseLevel;
}
