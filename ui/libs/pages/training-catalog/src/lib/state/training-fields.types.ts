import {languagesAlphaCodes2, licencesIds} from '@eosc-search-service/search';

export type languageAlphaCode2 = typeof languagesAlphaCodes2;
export type licenceId = typeof licencesIds;

// source, page 15
// https://schema.datacite.org/meta/kernel-4.2/doc/DataCite-MetadataKernel_v4.2.pdf
export type urlResourceType =
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
export type learningResourceType =
  | 'Diagram'
  | 'Figure'
  | 'Graph'
  | 'Index'
  | 'Slide'
  | 'Table'
  | 'Narrative'
  | 'Text';
export type accessCost = 'yes' | 'no' | 'maybe' | 'it depends' | 'it changes';
export type expertiseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type accessRight = 'open' | 'closed' | 'restricted' | 'with a cost';
