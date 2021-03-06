import {
  ruleExcutionService,
  ruleExecutionWithActionService,
} from '../services/execution.service';
import {
  EventData,
  ProgramRule,
  ProgramRuleVariable,
  DataElements,
  OptionSets,
  EventValue,
  ProgramRuleAction,
} from '../interfaces/rules-engine.types';

export const execute = (
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

export const executeWithAction = (
  eventData: EventData,
  dataElements: DataElements,
  programRules: ProgramRule[],
  programRuleVariables: ProgramRuleVariable[],
  programRuleActions: ProgramRuleAction[],
  optionSets: OptionSets
): ProgramRuleAction[] => {
  const { dataValues = [] } = eventData;
  const eventValues = dataValues.reduce((acc: any, cur: EventValue) => {
    const { dataElement, value } = cur;
    acc[dataElement] = value;
    return acc;
  }, {});

  const transformedData = { ...eventData, dataValues: eventValues };
  const actions: ProgramRuleAction[] = ruleExecutionWithActionService(
    transformedData,
    dataElements,
    programRules,
    programRuleVariables,
    programRuleActions,
    optionSets
  );
  return actions;
};
