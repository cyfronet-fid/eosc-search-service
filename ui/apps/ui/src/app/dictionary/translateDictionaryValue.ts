import { interoperabilityGuidelinesStatusDictionary } from './interoperabilityGuidelinesStatusDictionary';
import { interoperabilityGuidelinesTypeDictionary } from './interoperabilityGuidelinesTypeDictionary';
import { interoperabilityGuidelinesDomainDictionary } from './interoperabilityGuidelinesDomainDictionary';
import { trainingAccessDictionary } from './trainingAccessDictionary';
import { trainingTargetGroupDictionary } from './trainingTargetGroupDictionary';
import { trainingUrlTypeDictionary } from './trainingUrlTypeDictionary';

export function translateDictionaryValue(type: string, value: string) {
  const valueType: string | string[] = value.toString().toLowerCase();
  switch (type) {
    case 'domain':
      return interoperabilityGuidelinesDomainDictionary[valueType] || value;
      break;
    case 'status':
      return interoperabilityGuidelinesStatusDictionary[valueType] || value;
      break;
    case 'eosc_guideline_type':
      return interoperabilityGuidelinesTypeDictionary[valueType] || value;
      break;
    case 'access_type':
      return trainingAccessDictionary[valueType] || value;
      break;
    case 'target_group':
      return trainingTargetGroupDictionary[valueType] || value;
      break;
    case 'url_type':
      return trainingUrlTypeDictionary[valueType] || value;
      break;
    default:
      return value;
  }
}
