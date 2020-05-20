// @flow
export interface ProgramRuleEffect {
  id: string;
  location?: string;
  action: string;
  dataElementId?: string;
  trackedEntityAttributeId?: string;
  programStageId?: string;
  programStageSectionId?: string;
  optionGroupId?: string;
  optionId?: string;
  content: string;
  data?: string;
  ineffect: boolean;
}
export interface ProgramRuleAction {
  created?:                 string;
  lastUpdated?:             string;
  id:                      string;
  programRuleActionType?:   string;
  data?:                   string;
  lastUpdatedBy?:           {id: string;};
  trackedEntityAttribute?: {id: string;};
  programRule?:             {id: string;};
  dataElement?:            {id: string;};
  content?:                string;
  optionGroup?:            {id: string;};
  templateUid?:            string;
  location?:               string;
  programStageSection?:    {id: string;};
  programStage?:           {id: string;};
}

export enum ProgramRuleActionType {
  Assign = "ASSIGN",
  Displaykeyvaluepair = "DISPLAYKEYVALUEPAIR",
  Displaytext = "DISPLAYTEXT",
  Hidefield = "HIDEFIELD",
  Hideoptiongroup = "HIDEOPTIONGROUP",
  Hideprogramstage = "HIDEPROGRAMSTAGE",
  Hidesection = "HIDESECTION",
  Schedulemessage = "SCHEDULEMESSAGE",
  Sendmessage = "SENDMESSAGE",
  Showerror = "SHOWERROR",
  Showwarning = "SHOWWARNING",
  Warningoncomplete = "WARNINGONCOMPLETE",
}


export interface User {
  id: string;
}

export interface ProgramStage {
  id: string;
}

export interface Program {
  id: string;
}
export interface ProgramRule {
  created?: string;
  lastUpdated?: string;
  name?: string;
  id: string;
  description?: string;
  priority?: number;
  condition?: string;
  lastUpdatedBy?: User;
  programStage?: ProgramStage;
  program?: Program;
  programRuleActions?: ProgramRuleAction[];
}

export interface ProgramRuleVariable {
  id: string;
  programRuleVariableSourceType: string;
  dataElement?: { id: string };
  trackedEntityAttribute?: { id: string };
  programStage?: { id: string };
  useNameForOptionSet?: boolean;
  name?: string;
  useCodeForOptionSet?: boolean;
  lastUpdatedBy?: { id: string };
  program?: { id: string };
}

export interface Option {
  code: string;
  displayName: string;
  id: string;
}

export interface OptionSet {
  id: string;
  displayName: string;
  options: Option[];
}

export interface OptionSets {
  [id: string]: OptionSet;
}

export interface Constant {
  id: string;
  displayName: string;
  value: any;
}

export interface ProgramRulesContainer {
  programRulesVariables?: Array<ProgramRuleVariable>;
  programRules?: Array<ProgramRule>;
  constants?: Constant[];
}

export interface EventMain {
  event: string;
  program: string;
  programStage: string;
  orgUnit: string;
  orgUnitName?: string;
  trackedEntityInstance: string;
  enrollment: string;
  enrollmentStatus?: string;
  status: string;
  eventDate: string;
  dueDate: string;
  dataValues: EventValue[];
}
export interface EventValue {
  dataElement: string;
  value: string;
}
export interface EventValues {
  [elementId: string]: any;
}

export type EventData = EventMain | EventValues;

export interface EventsDataContainer {
  all: EventData[];
  byStage: { [stageId: string]: EventData[] };
}

export interface DataElement {
  id: string;
  valueType: string;
  optionSetId?: string;
}

export interface DataElements {
  [elementId: string]: DataElement;
}

export interface TrackedEntityAttribute {
  id: string;
  valueType: string;
  optionSetId?: string;
}

export interface TrackedEntityAttributes {
  [id: string]: TrackedEntityAttribute;
}

export interface Enrollment {
  enrollmentDate?: string;
  incidentDate?: string;
  enrollmentId?: string;
}

export interface TEIValues {
  [attributeId: string]: any;
}

export interface OrgUnit {
  id: string;
  code: string;
}

export type Variable = {
  variableValue: any;
  useCodeForOptionSet: boolean;
  variableType: string;
  hasValue: boolean;
  variableEventDate?: string;
  variablePrefix: string;
  allValues?: any[];
};
export interface DateUtils {
  getToday: () => string;
  daysBetween: (firstRulesDate: string, secondRulesDate: string) => string;
  weeksBetween: (firstRulesDate: string, secondRulesDate: string) => string;
  monthsBetween: (firstRulesDate: string, secondRulesDate: string) => string;
  yearsBetween: (firstRulesDate: string, secondRulesDate: string) => string;
  addDays: (rulesDate: string, daysToAdd: string) => string;
}

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
