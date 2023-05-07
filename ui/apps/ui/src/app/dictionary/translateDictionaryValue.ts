import { interoperabilityGuidelinesStatusDictionary } from './interoperabilityGuidelinesStatusDictionary';
import { interoperabilityGuidelinesTypeDictionary } from './interoperabilityGuidelinesTypeDictionary';
import { interoperabilityGuidelinesDomainDictionary } from './interoperabilityGuidelinesDomainDictionary';
import { trainingAccessDictionary } from './trainingAccessDictionary';
import { trainingTargetGroupDictionary } from './trainingTargetGroupDictionary';
import { trainingUrlTypeDictionary } from './trainingUrlTypeDictionary';

export function translateDictionaryValue(type: string, value: string) {
  value = value.toLowerCase();
  switch (type) {
    case 'domain':
      return interoperabilityGuidelinesDomainDictionary[value] || value;
      break;
    case 'status':
      return interoperabilityGuidelinesStatusDictionary[value] || value;
      break;
    case 'eosc_guideline_type':
      return interoperabilityGuidelinesTypeDictionary[value] || value;
      break;
    case 'access_type':
      return trainingAccessDictionary[value] || value;
      break;
    case 'target_group':
      return trainingTargetGroupDictionary[value] || value;
      break;
    case 'url_type':
      return trainingUrlTypeDictionary[value] || value;
      break;
    default:
      return value;
  }
}
