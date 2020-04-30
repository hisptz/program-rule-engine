// @flow
import typeKeys from '../constants/types-keys.constant';
import * as mapTypeToInterfaceFnName from '../constants/types-to-interface-fn.constant';
import * as log from 'loglevel';

import {
  EventData,
  ProgramRule,
  DataElement,
  DataElements,
  ProgramRuleVariable,
  Constant,
  OptionSets,
  Variable
} from '../interfaces/rules-engine.types';
import variablePrefixes from '../constants/variable-prefix.constant';

import { getoptionSetName } from '../utils/options.utils';
import trimQuotes from '../utils/trim-quotes.utils';
import { processValue } from '../helpers/rules-engine.helper';

const EMPTY_STRING = '';

const DATAELEMENT_CURRENT_EVENT = 'DATAELEMENT_CURRENT_EVENT';

const variableSourceTypesDataElementSpecific:{[x:string]:string} = {
  DATAELEMENT_CURRENT_EVENT
};

export const buildVariable = (
  value: any,
  allValues: any[],
  type: string,
  valueFound: boolean,
  variablePrefix: string,
  variableEventDate?: string,
  useNameForOptionSet?: boolean
): Variable => {
  const processedValues = allValues ? allValues.map(alternateValue => processValue(alternateValue, type)) : null;

  return {
    variableValue: processValue(value, type),
    useCodeForOptionSet: !useNameForOptionSet,
    variableType: useNameForOptionSet ? typeKeys.TEXT : type,
    hasValue: valueFound,
    variableEventDate,
    variablePrefix,
    allValues: processedValues
  };
};

const getDataElementValueForVariable = (
  value: any,
  dataElementId: string,
  useNameForOptionSet?: boolean,
  dataElements?: DataElements,
  optionSets?: OptionSets
) => {
  const hasValue = !!value || value === 0 || value === false;
  return hasValue &&
    useNameForOptionSet &&
    dataElements &&
    dataElements[dataElementId] &&
    dataElements[dataElementId].optionSetId
    ? getoptionSetName(optionSets[dataElements[dataElementId].optionSetId].options, value)
    : value;
};

export const getVariableFromCurrentEvent = (
  programRuleVariable: ProgramRuleVariable,
  dataElements: DataElements,
  eventData: { [elementId: string]: any },
  optionSets: OptionSets
): Variable => {
  // $FlowFixMe
  const dataElementId: string = programRuleVariable.dataElement && programRuleVariable.dataElement.id;

  const dataElement: DataElement = dataElements[dataElementId];

  if (!eventData) {
    return null;
  }
  const dataElementValue = eventData && eventData[dataElementId];
  if (!dataElementValue && dataElementValue !== 0 && dataElementValue !== false) {
    return null;
  }

  const value = getDataElementValueForVariable(
    dataElementValue,
    dataElementId,
    programRuleVariable.useNameForOptionSet,
    dataElements,
    optionSets
  );

  return buildVariable(
    value,
    null,
    dataElement.valueType,
    true,
    variablePrefixes.DATAELEMENT,
    eventData.eventDate,
    programRuleVariable.useNameForOptionSet
  );
};

export const functionMapper:{[x:string]:Function} = {
  "DATAELEMENT_CURRENT_EVENT": getVariableFromCurrentEvent
};

export const getVariables = (
  eventData: EventData,
  programRules: ProgramRule[],
  programRuleVariables: ProgramRuleVariable[],
  dataElements: DataElements,
  optionSets: OptionSets
) => {
  const variables = programRuleVariables.reduce((accVariables:any = {}, currentRuleVariable: ProgramRuleVariable) => {
    let variable;
    const { programRuleVariableSourceType } = currentRuleVariable;
    const variableKey: string = currentRuleVariable.displayName;
    const getterFunction = functionMapper[programRuleVariableSourceType];

    if (!getterFunction) {
      log.error(`Unknown programRuleVariableSourceType:${currentRuleVariable.programRuleVariableSourceType}`);
      variable = buildVariable(
        EMPTY_STRING,
        null,
        typeKeys.TEXT,
        false,
        variablePrefixes.DATAELEMENT,
        null,
        currentRuleVariable.useNameForOptionSet
      );

      accVariables[variableKey] = variable;
      return accVariables;
    }

    if (variableSourceTypesDataElementSpecific[programRuleVariableSourceType]) {
      variable = preCheckDataElement(currentRuleVariable, dataElements);
    }

    if (variable) {
      accVariables[variableKey] = variable;
      return accVariables;
    }

    variable = getterFunction(currentRuleVariable, dataElements, eventData.dataValues, optionSets);

    if (!variable) {
      variable = postcheckDataElement(currentRuleVariable, dataElements);
    }

    if (variable) {
      accVariables[variableKey] = variable;
    }
    return accVariables;
  }, {});

  return { ...variables, ...getConstantVariables([]) };
};

export const preCheckDataElement = (programVariable: ProgramRuleVariable, dataElements?: DataElements) => {
  const dataElementId = programVariable.dataElement && programVariable.dataElement.id;
  const dataElement = dataElementId && dataElements && dataElements[dataElementId];
  if (!dataElement) {
    log.warn(
      `Variable id:${programVariable.id} name:${
        programVariable.displayName
      } contains an invalid dataelement id (id: ${dataElementId || ''})`
    );
    return buildVariable(
      EMPTY_STRING,
      null,
      typeKeys.TEXT,
      false,
      variablePrefixes.DATAELEMENT,
      null,
      programVariable.useNameForOptionSet
    );
  }
  return null;
};

export const postcheckDataElement = (programVariable: ProgramRuleVariable, dataElements: DataElements) => {
  const dataElementId = programVariable.dataElement && programVariable.dataElement.id;
  // $FlowFixMe
  const dataElement: DataElement = dataElements[dataElementId];
  return buildVariable(
    EMPTY_STRING,
    null,
    dataElement.valueType,
    false,
    variablePrefixes.DATAELEMENT,
    EMPTY_STRING,
    programVariable.useNameForOptionSet
  );
};

export const getConstantVariables = (constants?: Constant[]) => {
  const constantVariables = constants
    ? constants.reduce((accConstantVariables:any, constant) => {
        accConstantVariables[constant.id] = buildVariable(
          constant.value,
          null,
          typeKeys.INTEGER,
          true,
          variablePrefixes.CONSTANT_VARIABLE,
          null,
          false
        );
        return accConstantVariables;
      }, {})
    : {};

  return constantVariables;
};
