// @flow
export interface ProgramRuleEffect {
  id: string,
  location?: string,
  action: string,
  dataElementId?: string,
  trackedEntityAttributeId?: string,
  programStageId?: string,
  programStageSectionId?: string,
  optionGroupId?: string,
  optionId?: string,
  content: string,
  data?: string,
  ineffect: boolean
};

export interface ProgramRuleAction {
  id: string,
  content: string,
  data?: string,
  location?: string,
  programRuleActionType: string,
  dataElementId?: string,
  dataElement?: any,
  programStageId?: string,
  programStageSectionId?: string,
  trackedEntityAttributeId?: string
};

export interface ProgramRule {
  id: string,
  condition: string,
  priority: number,
  description?: string,
  displayName: string,
  programId: string,
  programStageId?: string,
  programRuleActions: Array<ProgramRuleAction>
};

export interface ProgramRuleVariable {
  id: string,
  displayName: string,
  programRuleVariableSourceType: string,
  programId: string,
  dataElementId?: string,
  dataElement?: { id: string },
  trackedEntityAttributeId?: string,
  programStageId?: string,
  useNameForOptionSet?: boolean
};

export interface Option {
  code: string,
  displayName: string,
  id: string
};

export interface OptionSet {
  id: string,
  displayName: string,
  options: Option[]
};

export interface OptionSets {
  [id: string]: OptionSet
};

export interface Constant {
  id: string,
  displayName: string,
  value: any
};


export interface ProgramRulesContainer {
  programRulesVariables?: Array<ProgramRuleVariable>,
  programRules?: Array<ProgramRule>,
  constants?: Constant[]
};

export interface EventMain {
  eventId: string,
  programId: string,
  programStageId: string,
  orgUnitId: string,
  orgUnitName: string,
  trackedEntityInstanceId: string,
  enrollmentId: string,
  enrollmentStatus: string,
  status: string,
  eventDate: string,
  dueDate: string,
  dataValues: EventValue
};
export interface EventValue {
  dataElement: string;
  value: string;
};
export interface EventValues {
  [elementId: string]: any
};

export type EventData = EventMain | EventValues;

export interface EventsDataContainer {
  all: EventData[],
  byStage: { [stageId: string]: EventData[] }
};

export interface DataElement {
  id: string,
  valueType: string,
  optionSetId?: string
};

export interface DataElements { [elementId: string]: DataElement };

export interface TrackedEntityAttribute {
  id: string,
  valueType: string,
  optionSetId?: string
};

export interface TrackedEntityAttributes {
  [id: string]: TrackedEntityAttribute
};

export interface Enrollment {
  enrollmentDate?: string,
  incidentDate?: string,
  enrollmentId?: string
};

export interface TEIValues {
  [attributeId: string]: any
};

export interface OrgUnit {
  id: string,
  code: string
};

export type Variable = {
  variableValue: any,
  useCodeForOptionSet: boolean,
  variableType: string,
  hasValue: boolean,
  variableEventDate?: string,
  variablePrefix: string,
  allValues?: any[]
};
export interface DateUtils {
  getToday: () => string,
  daysBetween: (firstRulesDate: string, secondRulesDate: string) => string,
  weeksBetween: (firstRulesDate: string, secondRulesDate: string) => string,
  monthsBetween: (firstRulesDate: string, secondRulesDate: string) => string,
  yearsBetween: (firstRulesDate: string, secondRulesDate: string) => string,
  addDays: (rulesDate: string, daysToAdd: string) => string
};

export type Moment = Object;
export interface IMomentConverter {
  rulesDateToMoment(rulesEngineValue: string): Moment;
  momentToRulesDate(momentValue: Moment): string;
}

export interface IConvertInputRulesValue {
  convertText(value: any): string;
  convertLongText(value: any): string;
  convertLetter(value: any): string;
  convertPhoneNumber(value: any): string;
  convertEmail(value: any): string;
  convertBoolean(value: any): boolean | string;
  convertTrueOnly(value: any): boolean | string;
  convertDate(value: any): string;
  convertDateTime(value: any): string;
  convertTime(value: any): string;
  convertNumber(value: any): number | string;
  convertInteger(value: any): number | string;
  convertIntegerPositive(value: any): number | string;
  convertIntegerNegative(value: any): number | string;
  convertIntegerZeroOrPositive(value: any): number | string;
  convertPercentage(value: any): number | string;
  convertUrl(value: any): string;
  convertAge(value: any): number | string;
}
