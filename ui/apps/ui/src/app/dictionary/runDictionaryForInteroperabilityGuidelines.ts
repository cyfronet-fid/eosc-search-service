import { interoperabilityGuidelinesStatusDictionary } from './interoperabilityGuidelinesStatusDictionary';
import { interoperabilityGuidelinesTypeDictionary } from './interoperabilityGuidelinesTypeDictionary';
import { trainingDomainDictionary } from './trainingDomainDictionary';
import { interoperabilityGuidelinesIdentifierTypeDictionary } from './interoperabilityGuidelinesIdentifierTypeDictionary';
import { interoperabilityGuidelinesAuthorTypeDictionary } from './interoperabilityGuidelinesAuthorTypeDictionary';
import { DICTIONARY_TYPE_FOR_PIPE } from './dictionaryType';
import { interoperabilityGuidelinesResourceTypeGeneralDictionary } from './interoperabilityGuidelinesResourceTypeGeneralDictionary';

export function runDictionaryForInteroperabilityGuidelines(
  type: string,
  value: string | string[]
) {
  value = value.toString();
  switch (type) {
    case DICTIONARY_TYPE_FOR_PIPE.DOMAIN:
      return trainingDomainDictionary[value] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.STATUS:
      return interoperabilityGuidelinesStatusDictionary[value] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.GUIDELINE_TYPE:
      return interoperabilityGuidelinesTypeDictionary[value] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.IDENTIFIER_TYPE:
      return interoperabilityGuidelinesIdentifierTypeDictionary[value] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.AUTHOR_TYPE:
      return interoperabilityGuidelinesAuthorTypeDictionary[value] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.RESOURCE_GENERAL_TYPE:
      return (
        interoperabilityGuidelinesResourceTypeGeneralDictionary[value] || value
      );
      break;
    default:
      return value;
  }
}
