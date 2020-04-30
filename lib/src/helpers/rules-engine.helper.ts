import isString from 'd2-utilizr/lib/isString';
import isDefined from 'd2-utilizr/lib/isDefined';
import isNumber from 'd2-utilizr/lib/isNumber';

import typeKeys from '../constants/types-keys.constant';
import mapTypeToInterfaceFnName from '../constants/types-to-interface-fn.constant';
import trimQuotes from '../utils/trim-quotes.utils';
import * as log from 'loglevel';
import inputValueFnConverters from '../helpers/input-value.helper';

/**
 * @param  [] programRules
 * @param  {} b
 * @param  {} =>a.priority&&b.priority?a.priority-b.priority
 */

export const orderRulesByPriority = programRules =>
  programRules.sort((a, b) =>
    a.priority && b.priority ? a.priority - b.priority : !a.priority && !b.priority ? 0 : !a.priority ? 1 : -1
  );

/**
 * @param  {} dataValue
 * @returns dataValue
 */

export const convertToNumber = dataValue =>
  isString(dataValue) ? (isNaN(dataValue) ? null : Number(dataValue)) : dataValue;

const DataByTypeMapping = {
  [typeKeys.BOOLEAN]: (value:any) => (isString(value) ? value === 'true' : value),
  [typeKeys.INTEGER]: convertToNumber,
  [typeKeys.INTEGER_NEGATIVE]: convertToNumber,
  [typeKeys.INTEGER_POSITIVE]: convertToNumber,
  [typeKeys.INTEGER_ZERO_OR_POSITIVE]: convertToNumber,
  [typeKeys.NUMBER]: convertToNumber,
  [typeKeys.TRUE_ONLY]: (value:any) => true
};

/**
 * @param  {} dataValue
 * @param  {} valueType
 */

export const convertDataByType = (dataValue, valueType) => {
  if (dataValue !== 0 && dataValue !== false && !dataValue) {
    return null;
  }

  return DataByTypeMapping[valueType] ? DataByTypeMapping[valueType](dataValue) : dataValue;
};

/**
 * @description Replace variable name with its respective value
 * @param  {string} epression
 * @param  {string} variable
 * @returns {string} expression
 */

export const replaceVariables = (expression: string, hashedVariable: any): string => {
  let evalExpression: string = expression;

  if (evalExpression.includes('{')) {
    // Get every variable name in the expression;
    const variablesInexpression = evalExpression.match(/[A#CV]\{[\w -_.]+}/g);

    variablesInexpression.forEach(expressionVariable => {
      // Strip away any prefix and postfix signs from the variable name
      const strippedExprVar = expressionVariable
        .replace('#{', '')
        .replace('A{', '')
        .replace('C{', '')
        .replace('V{', '')
        .replace('}', '');

      if (isDefined(hashedVariable[strippedExprVar])) {
        // Replace all occurrences of the variable name(hence using regex replacement):
        evalExpression = evalExpression.replace(
          new RegExp(hashedVariable[strippedExprVar].variablePrefix + '\\{' + strippedExprVar + '\\}', 'g'),
          hashedVariable[strippedExprVar].variableValue
        );
      } else {
        log.warn(
          `Expression ${evalExpression} contains variable ${strippedExprVar} - but this variable is not defined.`
        );
      }
    });
  }

  // Check if it has enviroment variable
  if (evalExpression.includes('V{')) {
    // Get every variable name in the expression;
    const variablesInexpression = evalExpression.match(/V{\w+.?\w*}/g);

    variablesInexpression.forEach(expressionVariable => {
      // Strip away any prefix and postfix signs from the variable name
      const strippedExprVar = expressionVariable.replace('V{', '').replace('}', '');

      if (isDefined(hashedVariable[strippedExprVar]) && hashedVariable[strippedExprVar].variablePrefix === 'V') {
        //Replace all occurrences of the variable name(hence using regex replacement):
        evalExpression = evalExpression.replace(
          new RegExp('V{' + strippedExprVar + '}', 'g'),
          variablesHash[strippedExprVar].variableValue
        );
      } else {
        log.warn(
          `Expression ${evalExpression} contains context variable  ${strippedExprVar} - but this variable is not defined.`
        );
      }
    });
  }

  // Check if it has enviroment variable
  if (evalExpression.includes('A{')) {
    // Get every variable name in the expression;
    const variablesInexpression = evalExpression.match(/A{\w+.?\w*}/g);

    variablesInexpression.forEach(expressionVariable => {
      // Strip away any prefix and postfix signs from the variable name
      const strippedExprVar = expressionVariable.replace('A{', '').replace('}', '');

      if (isDefined(hashedVariable[strippedExprVar]) && hashedVariable[strippedExprVar].variablePrefix === 'A') {
        //Replace all occurrences of the variable name(hence using regex replacement):
        evalExpression = evalExpression.replace(
          new RegExp('A{' + strippedExprVar + '}', 'g'),
          variablesHash[strippedExprVar].variableValue
        );
      } else {
        log.warn(
          `Expression ${evalExpression} conains attribute  ${strippedExprVar} - but this attribute is not defined.`
        );
      }
    });
  }

  return evalExpression;
};

export const determineValueType = value => {
  let valueType = 'TEXT';
  if (value === 'true' || value === 'false') {
    valueType = 'BOOLEAN';
  } else if (isNumber(value) || !isNaN(value)) {
    if (value % 1 !== 0) {
      valueType = 'NUMBER';
    } else {
      valueType = 'INTEGER';
    }
  }
  return valueType;
};

const addQuotesToString = (value: any) => (isNumber(value) ? value : `'${value}'`);

export const processValue = (value: any, type: string) => {
  if (isString(value)) {
    value = trimQuotes(value);
  }

  const convertFnName = mapTypeToInterfaceFnName[type];
  if (!convertFnName) {
    log.warn(`Error in converting this value of type ${type}`);
    return value;
  }

  const convertedValue = addQuotesToString(inputValueFnConverters[convertFnName](value));
  return convertedValue;
};
