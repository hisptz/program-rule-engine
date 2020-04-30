import { trimquotes } from "./helpers.utility";
import { getCode } from "./optionset.utility";
import * as DateUtils from './date.utility';

export const processValue = function(processedValue:any,valueType:string){
    //First clean away single or double quotation marks at the start and end of the variable name.
    processedValue = trimquotes(processedValue);

    //Append single quotation marks in case the variable is of text or date type:
    if(valueType === 'LONG_TEXT' || valueType === 'TEXT' || valueType === 'DATE' || valueType === 'AGE' || valueType === 'OPTION_SET' ||
        valueType === 'URL' || valueType === 'DATETIME' || valueType === 'TIME' || valueType === 'PHONE_NUMBER' || 
        valueType === 'ORGANISATION_UNIT' || valueType === 'USERNAME') {
        if(processedValue) {
            processedValue = "'" + processedValue + "'";
        } else {
            processedValue = "''";
        }
    }
    else if(valueType === 'BOOLEAN' || valueType === 'TRUE_ONLY') {
        if(processedValue === "Yes") {
        processedValue = true;
        }
        else if(processedValue === "No") {
            processedValue = false;
        }
        else if(processedValue && eval(processedValue)) {
            processedValue = true;
        }
        else {
            processedValue = false;
        }
    }
    else if( valueType === "INTEGER" || valueType === "NUMBER" || valueType === "INTEGER_POSITIVE"
         ||  valueType === "INTEGER_NEGATIVE" || valueType === "INTEGER_ZERO_OR_POSITIVE" ||
             valueType === "PERCENTAGE") {
        if(processedValue) {
            processedValue = Number(processedValue);
        } else {
            processedValue = 0;
        }
    }
    else{
        console.warn("unknown datatype:" + valueType);
    }

    return processedValue;
};

export const getDataElementValueOrCodeForValue = (useCodeForOptionSet:boolean, value:string, dataElementId:string, allDes:{[x:string]:any}, optionSets:any[]) =>{
    return useCodeForOptionSet && allDes && allDes[dataElementId].dataElement.optionSet ? 
                                        getCode(optionSets[allDes[dataElementId].dataElement.optionSet.id].options, value)
                                        : value;
};
const geTrackedEntityAttributeValueOrCodeForValue = (useCodeForOptionSet:boolean, value:string, trackedEntityAttributeId:string, allTeis:{[x:string]:any}, optionSets:any[]) => {
    return useCodeForOptionSet && allTeis && allTeis[trackedEntityAttributeId].optionSet ? 
                                        getCode(optionSets[allTeis[trackedEntityAttributeId].optionSet.id].options, value)
                                        : value;
};
const pushVariable = (variables:any, variablename:string, varValue:any, allValues:any, varType:any, variablefound:any, variablePrefix:any, variableEventDate:any, useCodeForOptionSet?:any) => {

    var processedValues:any = [];

    allValues.forEach((alternateValue:any) => {
        processedValues.push(processValue(alternateValue,varType));
    });

    variables[variablename] = {
        variableValue:processValue(varValue, varType),
        useCodeForOptionSet:useCodeForOptionSet,
        variableType:varType,
        hasValue:variablefound,
        variableEventDate:variableEventDate,
        variablePrefix:variablePrefix,
        allValues:processedValues
    };
    return variables;
};
export const getVariables = (allProgramRules:any, executingEvent:any, evs:any, allDes:any, allTeis:any, selectedEntity:any, selectedEnrollment:any, optionSets:any, selectedOrgUnit:any, selectedProgramStage:any) =>{

    var variables = {};

    var programVariables = allProgramRules.programVariables;

    programVariables = programVariables.concat(allProgramRules.programIndicators.variables);

    programVariables.forEach((programVariable:any) =>{
        var dataElementId = programVariable.dataElement;
        
        if(programVariable.dataElement && programVariable.dataElement.id) {
            dataElementId = programVariable.dataElement.id;
        }

        var dataElementExists = dataElementId && allDes && allDes[dataElementId];

        var trackedEntityAttributeId = programVariable.trackedEntityAttribute;
        if(programVariable.trackedEntityAttribute && programVariable.trackedEntityAttribute.id) {
            trackedEntityAttributeId = programVariable.trackedEntityAttribute.id;
        }

        var programStageId = programVariable.programStage;
        if(programVariable.programStage && programVariable.programStage.id) {
            programStageId = programVariable.programStage.id;
        }

        var valueFound = false;
        //If variable evs is not defined, it means the rules is run before any events is registered, skip the types that require an event
        if(programVariable.programRuleVariableSourceType === "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE" && evs && evs.byStage && dataElementExists){
            if(programStageId) {
                var allValues:any[] = [];
                evs.byStage[programStageId].forEach((event:any) => {
                    if(event[dataElementId] !== null) {
                        if(event[dataElementId]
                                && event[dataElementId] !== ""){
                            var value = getDataElementValueOrCodeForValue(programVariable.useCodeForOptionSet, event[dataElementId], dataElementId, allDes, optionSets);
                                    
                            allValues.push(value);
                            valueFound = true;
                            variables = pushVariable(variables, programVariable.displayName, value, allValues, allDes[dataElementId].dataElement.valueType, valueFound, '#', event.eventDate, programVariable.useCodeForOptionSet);
                        }
                    }
                });
            } else {
                console.warn("Variable id:'" + programVariable.id + "' name:'" + programVariable.displayName
                    + "' does not have a programstage defined,"
                    + " despite that the variable has sourcetype DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE" );
            }
        }
        else if(programVariable.programRuleVariableSourceType === "DATAELEMENT_NEWEST_EVENT_PROGRAM" && evs && dataElementExists){
            var allValues = [];
            evs.all.forEach((event:any) => {
                if(event[dataElementId]
                    && event[dataElementId] !== null 
                    && event[dataElementId] !== ""){
                    var value = getDataElementValueOrCodeForValue(programVariable.useCodeForOptionSet, event[dataElementId], dataElementId, allDes, optionSets);
                            
                    allValues.push(value);
                    valueFound = true;
                    variables = pushVariable(variables, programVariable.displayName, value, allValues, allDes[dataElementId].dataElement.valueType, valueFound, '#', event.eventDate, programVariable.useCodeForOptionSet);
                }
            });
        }
        else if(programVariable.programRuleVariableSourceType === "DATAELEMENT_CURRENT_EVENT" && evs && dataElementExists){
            if(executingEvent[dataElementId]
                && executingEvent[dataElementId] !== null 
                && executingEvent[dataElementId] !== ""){
                var value = getDataElementValueOrCodeForValue(programVariable.useCodeForOptionSet, executingEvent[dataElementId], dataElementId, allDes, optionSets);
                    
                valueFound = true;
                variables = pushVariable(variables, programVariable.displayName, value, null, allDes[dataElementId].dataElement.valueType, valueFound, '#', executingEvent.eventDate, programVariable.useCodeForOptionSet );
            }
        }
        else if(programVariable.programRuleVariableSourceType === "DATAELEMENT_PREVIOUS_EVENT" && evs && dataElementExists){
            //Only continue checking for a value if there is more than one event.
            if(evs.all && evs.all.length > 1) {
                var allValues = [];
                var previousvalue = null;
                var previousEventDate = null;
                var currentEventPassed = false;
                for(var i = 0; i < evs.all.length; i++) {
                    //Store the values as we iterate through the stages
                    //If the event[i] is not the current event, it is older(previous). Store the previous value if it exists
                    if(!currentEventPassed && evs.all[i] !== executingEvent &&
                        evs.all[i][dataElementId]
                        && evs.all[i][dataElementId] !== "") {
                        previousvalue = getDataElementValueOrCodeForValue(programVariable.useCodeForOptionSet, evs.all[i][dataElementId], dataElementId, allDes, optionSets);
                        previousEventDate = evs.all[i].eventDate;
                        allValues.push(value);
                        valueFound = true;
                    }
                    else if(evs.all[i] === executingEvent) {
                        //We have iterated to the newest event - store the last collected variable value - if any is found:
                        if(valueFound) {
                            variables = pushVariable(variables, programVariable.displayName, previousvalue, allValues, allDes[dataElementId].dataElement.valueType, valueFound, '#', previousEventDate, programVariable.useCodeForOptionSet);
                        }
                        //Set currentEventPassed, ending the iteration:
                        currentEventPassed = true;
                    }
                }
            }
        }
        else if(programVariable.programRuleVariableSourceType === "TEI_ATTRIBUTE"){
            selectedEntity.attributes.forEach((attribute:any) =>{
                if(!valueFound) {
                    if(attribute.attribute === trackedEntityAttributeId
                            && attribute.value
                            && attribute.value !== null
                            && attribute.value !== "") {
                        valueFound = true;
                        //In registration, the attribute type is found in .type, while in data entry the same data is found in .valueType.
                        //Handling here, but planning refactor in registration so it will always be .valueType
                        variables = pushVariable(variables, 
                            programVariable.displayName, 
                            geTrackedEntityAttributeValueOrCodeForValue(programVariable.useCodeForOptionSet,attribute.value, trackedEntityAttributeId, allTeis, optionSets),
                            null, 
                            attribute.type ? attribute.type : attribute.valueType, valueFound, 
                            'A', 
                            '',
                            programVariable.useCodeForOptionSet);
                    }
                }
            });
        }
        else if(programVariable.programRuleVariableSourceType === "CALCULATED_VALUE"){
            //We won't assign the calculated variables at this step. The rules execution will calculate and assign the variable.
        }

        if(!valueFound){
            //If there is still no value found, assign default value:
            if(dataElementId && allDes) {
                var dataElement = allDes[dataElementId];
                if( dataElement ) {
                    variables = pushVariable(variables, programVariable.displayName, "", null, dataElement.dataElement.valueType, false, '#', '', programVariable.useCodeForOptionSet );
                }
                else {
                    variables = pushVariable(variables, programVariable.displayName, "", null, "TEXT",false, '#', '', programVariable.useCodeForOptionSet );
                }
            }
            else if (programVariable.trackedEntityAttribute) {
                //The variable is an attribute, set correct prefix and a blank value
                variables = pushVariable(variables, programVariable.displayName, "", null, "TEXT",false, 'A', '', programVariable.useCodeForOptionSet );
            }
            else {
                //Fallback for calculated(assigned) values:
                variables = pushVariable(variables, programVariable.displayName, "", null, "TEXT",false, '#', '', programVariable.useCodeForOptionSet );
            }
        }
    });

    //add context variables:
    //last parameter "valuefound" is always true for event date
    variables = pushVariable(variables, 'environment', 'WebClient',null,'TEXT',true,'V','',false);
    variables = pushVariable(variables, 'current_date', DateUtils.getToday(), null, 'DATE', true, 'V', '', false );

    variables = pushVariable(variables, 'event_date', executingEvent.eventDate, null, 'DATE', true, 'V', '', false );
    variables = pushVariable(variables, 'due_date', executingEvent.dueDate, null, 'DATE', true, 'V', '' );
    variables = pushVariable(variables, 'event_count', evs ? evs.all.length : 0, null, 'INTEGER', true, 'V', '', false );

    variables = pushVariable(variables, 'enrollment_date', selectedEnrollment ? selectedEnrollment.enrollmentDate : '', null, 'DATE', selectedEnrollment ? selectedEnrollment.enrollmentDate ? true : false : false, 'V', '', false );
    variables = pushVariable(variables, 'enrollment_id', selectedEnrollment ? selectedEnrollment.enrollment : '', null, 'TEXT',  selectedEnrollment ? true : false, 'V', '', false );
    variables = pushVariable(variables, 'event_id', executingEvent ? executingEvent.event : '', null, 'TEXT',  executingEvent ? true : false, 'V', executingEvent ? executingEvent.eventDate : false, false);
    variables = pushVariable(variables, 'event_status', executingEvent ? executingEvent.status : '', null, 'TEXT',  executingEvent ? true : false, 'V', executingEvent ? executingEvent.eventDate : false, false);

    variables = pushVariable(variables, 'incident_date', selectedEnrollment ? selectedEnrollment.incidentDate : '', null, 'DATE',  selectedEnrollment ? true : false, 'V', '', false);
    variables = pushVariable(variables, 'enrollment_count', selectedEnrollment ? 1 : 0, null, 'INTEGER', true, 'V', '', false);
    variables = pushVariable(variables, 'tei_count', selectedEnrollment ? 1 : 0, null, 'INTEGER', true, 'V', '', false);
    
    variables = pushVariable(variables, 'program_stage_id',(selectedProgramStage && selectedProgramStage.id) || '', null, 'TEXT', selectedProgramStage && selectedProgramStage.id ? true : false, 'V', '', false);
    variables = pushVariable(variables, 'program_stage_name',(selectedProgramStage && selectedProgramStage.name) || '', null, 'TEXT', selectedProgramStage && selectedProgramStage.name ? true : false, 'V', '', false);


    //Push all constant values:
    allProgramRules.constants.forEach((constant:any)=>{
        variables = pushVariable(variables, constant.id, constant.value, null, 'INTEGER', true, 'C', '', false);
    });

    if(selectedOrgUnit){
        variables = pushVariable(variables, 'orgunit_code', selectedOrgUnit.code, null, 'TEXT', selectedOrgUnit.code ? true : false, 'V', '', false);
    }

    return variables;
}