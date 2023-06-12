import { domainDictionary } from './domainDictionary';
import { interoperabilityGuidelinesStatusDictionary } from './interoperabilityGuidelinesStatusDictionary';
import { interoperabilityGuidelinesTypeDictionary } from './interoperabilityGuidelinesTypeDictionary';
import { trainingAccessDictionary } from './trainingAccessDictionary';
import { trainingTargetGroupDictionary } from './trainingTargetGroupDictionary';
import { trainingUrlTypeDictionary } from './trainingUrlTypeDictionary';
import { interoperabilityGuidelinesIdentifierTypeDictionary } from './interoperabilityGuidelinesIdentifierTypeDictionary';
import { DICTIONARY_TYPE_FOR_PIPE } from './dictionaryType';
import { interoperabilityGuidelinesResourceTypeGeneralDictionary } from './interoperabilityGuidelinesResourceTypeGeneralDictionary';
import { interoperabilityGuidelinesAuthorTypeDictionary } from './interoperabilityGuidelinesAuthorTypeDictionary';
import { trainingQualificationsDictionary } from './trainingQualificationsDictionary';
import { trainingDomainDictionary } from './trainingDomainDictionary';

function cleanGuidelineProvider(str: string): string {
  const index = str.indexOf('.');
  const newValue = str.substring(index + 1).replace(/_+|-+/g, ' ');
  return newValue;
}

export function translateDictionaryValue(
  type: string | string[],
  value: string | string[]
) {
  const valueType: string | string[] = value.toString().toLowerCase();
  switch (type) {
    case DICTIONARY_TYPE_FOR_PIPE.RESOURCE_GENERAL_TYPE:
      return (
        interoperabilityGuidelinesResourceTypeGeneralDictionary[valueType] ||
        value
      );
      break;
    case 'type_general':
      return (
        interoperabilityGuidelinesResourceTypeGeneralDictionary[valueType] ||
        value
      );
      break;
    case DICTIONARY_TYPE_FOR_PIPE.STATUS:
      return interoperabilityGuidelinesStatusDictionary[valueType] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.GUIDELINE_TYPE:
      return interoperabilityGuidelinesTypeDictionary[valueType] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.TRAINING_ACCESS_TYPE:
      return trainingAccessDictionary[valueType] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.TRAINING_TARGET_GROUP:
      return trainingTargetGroupDictionary[valueType] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.TRAINING_URL_TYPE:
      return trainingUrlTypeDictionary[valueType] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.IDENTIFIER_TYPE:
      return (
        interoperabilityGuidelinesIdentifierTypeDictionary[valueType] || value
      );
      break;
    case DICTIONARY_TYPE_FOR_PIPE.AUTHOR_TYPE:
      return interoperabilityGuidelinesAuthorTypeDictionary[valueType] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.DOMAIN:
      return domainDictionary[valueType] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.TRAINING_QUALIFICATIONS:
      return trainingQualificationsDictionary[valueType] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.TRAINING_BEST_ACCESS_RIGHT:
      return trainingAccessDictionary[valueType] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.TRAINING_ACCESS_RIGHT:
      return trainingAccessDictionary[valueType] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.TRAINING_DOMAIN:
      return trainingDomainDictionary[valueType] || value;
      break;
    case DICTIONARY_TYPE_FOR_PIPE.GUIDELINE_PROVIDER:
      return cleanGuidelineProvider(valueType);
      break;
    case DICTIONARY_TYPE_FOR_PIPE.BUNDLE:
      return valueType === 'bundles' ? 'bundle' : value;
      break;
    default:
      return value;
  }
}
