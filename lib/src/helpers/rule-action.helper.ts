// @flow

import { ProgramRuleAction, EventData } from '../interfaces/rules-engine.types';
import { replaceVariables, processValue } from '../helpers/rules-engine.helper';
import { runRuleExpression } from './run-expression.helper';
import trimQuotes from '../utils/trim-quotes.utils';
import * as log from 'loglevel';
import typeKeys from '../constants/types-keys.constant';
import { isString } from './d2-utils.helper';

const getRuleData = (action: any, variablesHash: any): string => {
  const actionData: string = action.data;
  let ruleDataEval = actionData;

  const nameWithoutBrackets = actionData.replace('#{', '').replace('}', '');

  if (variablesHash[nameWithoutBrackets]) {
    // The variable exists, and is replaced with its corresponding value
    ruleDataEval = variablesHash[nameWithoutBrackets].variableValue;
  } else if (actionData.includes('{') || actionData.includes('d2:')) {
    //Since the value couldnt be looked up directly, and contains a curly brace or a dhis function call,
    //the expression was more complex than replacing a single variable value.
    //Now we will have to make a thorough replacement and separate evaluation to find the correct value:
    ruleDataEval = replaceVariables(actionData, variablesHash);
    //In a scenario where the data contains a complex expression, evaluate the expression to compile(calculate) the result:
    ruleDataEval = runRuleExpression(
      ruleDataEval,
      actionData,
      `actions: ${action.id}`,
      variablesHash
    );
  }

  //trimQuotes if found
  if (ruleDataEval && isString(ruleDataEval)) {
    ruleDataEval = trimQuotes(ruleDataEval);
  }

  return ruleDataEval;
};

const buildAssignVariable = (variableHash: any, variableValue: any) => {
  const { variableType, variablePrefix } = variableHash;

  return {
    variableValue,
    variableType,
    hasValue: true,
    variableEventDate: '',
    variablePrefix: variablePrefix ? variablePrefix : '#',
    allValues: [variableValue],
  };
};

const ruleActionEval = (
  action: ProgramRuleAction,
  variableHash: any,
  eventData: EventData
): any => {
  const { programRuleActionType, data, content, dataElement } = action;
  const dataElementId = dataElement && dataElement.id;
  const actionData: string = data
    ? getRuleData(action, variableHash)
    : String(data);

  let newVariableHash = variableHash;

  if (programRuleActionType === 'ASSIGN' && content) {
    const variableToAssign = content
      .replace('#{', '')
      .replace('A{', '')
      .replace('}', '');

    const variableObject = newVariableHash[variableToAssign];
    if (variableObject) {
      const { variableType, variablePrefix } = variableObject;
      const baseValue = processValue(actionData, variableType);
      variableHash[variableToAssign] = buildAssignVariable(
        variableObject,
        baseValue
      );
      const variableValue = isString(baseValue)
        ? `${trimQuotes(baseValue)}`
        : baseValue;
      eventData.dataValues[dataElementId] = variableValue;
    } else {
      //If a variable is mentioned in the content of the rule, but does not exist in the variables hash, show a warning:
      // log.warn('Variable ' + variableToAssign + ' was not defined.');
    }
  }

  return { variableHash, eventData };
};

export default ruleActionEval;
