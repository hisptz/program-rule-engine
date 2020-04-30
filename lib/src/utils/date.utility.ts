export const getToday = () =>{
    var calendarSetting = CalendarService.getSetting();
    var today = $filter('date')(new Date(), calendarSetting.keyDateFormat);
    return today;
}

export const format = (dateValue) => {
    if (!dateValue) {
        return;
    }

    var calendarSetting = CalendarService.getSetting();
    dateValue = moment(dateValue, calendarSetting.momentFormat)._d;
    dateValue = $filter('date')(dateValue, calendarSetting.keyDateFormat);
    return dateValue;
}