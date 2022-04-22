import * as languages from './languages.json';
import * as licences from './licences.json';
import { ILanguages } from './language.interface';
import { ILicence } from './licence.interface';

const languageAlphaCode2 = Object.keys(
  (languages as unknown as ILanguages).default
);
const licenceId = (licences as unknown as ILicence[]).map(
  (licence) => licence.licenceId
);

// source, page 15
// https://schema.datacite.org/meta/kernel-4.2/doc/DataCite-MetadataKernel_v4.2.pdf
type urlResourceType =
  | 'URL'
  | 'DOI'
  | 'ARK'
  | 'AudioVisual'
  | 'Collection'
  | 'DataPaper'
  | 'Dataset'
  | 'Event'
  | 'Image'
  | 'InteractiveResource'
  | 'Model'
  | 'PhysicalObject'
  | 'Service'
  | 'Software'
  | 'Sound'
  | 'Text'
  | 'Workflow'
  | 'Other';
// source, table 3
// https://wiki.eoscfuture.eu/display/PUBLIC/Training+Catalogue+-+Minimal+Metadata+for+Learning+Resources
type learningResourceType =
  | 'Diagram'
  | 'Figure'
  | 'Graph'
  | 'Index'
  | 'Slide'
  | 'Table'
  | 'Narrative'
  | 'Text';
type accessCost = 'yes' | 'no' | 'maybe' | 'it depends' | 'it changes';
type expertiseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
type right = 'open' | 'closed' | 'restricted' | 'with a cost';
export interface ITraining {
  title: string;
  author: string;
  description: string;
  languageAlphaCode2: typeof languageAlphaCode2;
  keywords: string[];
  licence: typeof licenceId;
  accessRights: right[];
  format: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
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
