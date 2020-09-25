// @flow
import {
  ProgramRule,
  ProgramRuleVariable,
  ProgramRuleAction,
  EventData,
  DataElements,
  OptionSets,
} from '../interfaces/rules-engine.types';

import { getVariables } from './variable.service';
import {
  orderRulesByPriority,
  replaceVariables,
} from '../helpers/rules-engine.helper';
import { runRuleExpression } from '../helpers/run-expression.helper';
import ruleActionEval from '../helpers/rule-action.helper';

export const ruleExcutionService = (
  eventData: EventData,
  dataElements: DataElements,
  programRules: Array<ProgramRule>,
  programRuleVariables: Array<ProgramRuleVariable>,
  optionSets: OptionSets
) => {
  if (!programRules.length) {
    return eventData;
  }

  const rules: ProgramRule[] = orderRulesByPriority(programRules);
  let variableHash = getVariables(
    eventData,
    programRules,
    programRuleVariables,
    dataElements,
    optionSets
  );

  rules.forEach((rule) => {
    let { condition: expression, programRuleActions } = rule;
    let canRuleEvaluate = false;
    if (expression) {
      if (expression.includes('{')) {
        expression = replaceVariables(expression, variableHash);
      }
      canRuleEvaluate = runRuleExpression(
        expression,
        rule.condition,
        `rule:${rule.id}`,
        variableHash
      );
    } else {
      // console.warn(
      //   `Rule id: ${rule.id} and name: ${rule.name} had no condition specified. Please check rule configuration.`
      // );
    }

    if (canRuleEvaluate) {
      programRuleActions.forEach((action) => {
        const helperResponse = ruleActionEval(action, variableHash, eventData);
        eventData = helperResponse.eventData;
        variableHash = helperResponse.variableHash;
      });
    }
  });

  return eventData;
};

export const ruleExecutionWithActionService = (
  eventData: EventData,
  dataElements: DataElements,
  programRules: Array<ProgramRule>,
  programRuleVariables: Array<ProgramRuleVariable>,
  allProgramRuleActions: ProgramRuleAction[],
  optionSets: OptionSets
) => {
  let actions: ProgramRuleAction[] = [];
  if (!programRules || programRules.length === 0) {
    return actions;
  }

  const rules: ProgramRule[] = orderRulesByPriority(programRules);

  let variableHash = getVariables(
    eventData,
    programRules,
    programRuleVariables,
    dataElements,
    optionSets
  );

  rules.forEach((rule) => {
    let { condition: expression, programRuleActions } = rule;

    let canRuleEvaluate = false;
    if (expression) {
      if (expression.includes('{')) {
        expression = replaceVariables(expression, variableHash);
      }

      canRuleEvaluate = runRuleExpression(
        expression,
        rule.condition,
        `rule:${rule.id}`,
        variableHash
      );
    } else {
      // console.warn(
      //   `Rule id: ${rule.id} and name: ${rule.name} had no condition specified. Please check rule configuration.`
      // );
    }

    actions = [
      ...actions,
      ...programRuleActions.map((programRuleAction) => {
        return {
          ...programRuleAction,
          programRuleActionType: canRuleEvaluate
            ? programRuleAction.programRuleActionType
            : '',
        };
      }),
    ];
  });

  return actions;
};
