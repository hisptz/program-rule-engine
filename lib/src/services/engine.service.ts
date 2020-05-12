import { ruleExcutionService } from '../services/execution.service';
import {
  EventData,
  ProgramRule,
  ProgramRuleVariable,
  DataElements,
  OptionSets,
  EventValue,
} from '../interfaces/rules-engine.types';

export const executeProgramRules = (
  eventData: EventData,
  dataElements: DataElements,
  programRules: ProgramRule[],
  programRuleVariables: ProgramRuleVariable[],
  optionSets: OptionSets
): EventData => {
  const { dataValues = [] } = eventData;
  const eventValues = dataValues.reduce((acc: any, cur: EventValue) => {
    const { dataElement, value } = cur;
    acc[dataElement] = value;
    return acc;
  }, {});
  const transformedData = { ...eventData, dataValues: eventValues };
  const processedEvent = ruleExcutionService(
    transformedData,
    dataElements,
    programRules,
    programRuleVariables,
    optionSets
  );
  const { dataValues: newDataValues = {} } = processedEvent;
  const values = Object.keys(newDataValues).map((key) => ({
    dataElement: key,
    value: newDataValues[key],
  }));
  return { ...eventData, dataValues: values };
};
