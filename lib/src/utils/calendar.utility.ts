export const getSetting = ()=>{

    var dhis2CalendarFormat = {keyDateFormat: 'yyyy-MM-dd', keyCalendar: 'gregorian', momentFormat: 'YYYY-MM-DD'};
    var storedFormat = storage.get('SYSTEM_SETTING');
    
    if (angular.isObject(storedFormat) && storedFormat.keyDateFormat && storedFormat.keyCalendar) {
        if (storedFormat.keyCalendar === 'iso8601') {
            storedFormat.keyCalendar = 'gregorian';
        }

        if (storedFormat.keyDateFormat === 'dd-MM-yyyy') {
            dhis2CalendarFormat.momentFormat = 'DD-MM-YYYY';
        }

        dhis2CalendarFormat.keyCalendar = storedFormat.keyCalendar;
        dhis2CalendarFormat.keyDateFormat = storedFormat.keyDateFormat;
    }
    $rootScope.dhis2CalendarFormat = dhis2CalendarFormat;
    return dhis2CalendarFormat;
}