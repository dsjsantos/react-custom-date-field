const _convertDateToString = (date, swapMonthDay) => {
    if(date instanceof Date) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth()+1).padStart(2, '0'); //January is 0!
        const yyyy = String(date.getFullYear()).padStart(4, '0');
        return swapMonthDay ? `${dd}/${mm}/${yyyy}` : `${mm}/${dd}/${yyyy}`;
    }
    return "";
}

const _convertStringToDate = (strDate, swapMonthDay) => {
    if(/^\d{2}\/\d{2}\/\d{4}$/.test(strDate)) {
        const dateParts = strDate.split("/");
        const year = dateParts[2];
        const month = (swapMonthDay ? dateParts[1] : dateParts[0]) - 1;
        const day = swapMonthDay ? dateParts[0] : dateParts[1];
        return new Date(year, month, day);
    }
    return null;
}

const _dateMaskAdd = (unmaskedValue, isErasing) => {
    if(unmaskedValue) {
        if(isErasing) { // add first '/' with 3 digits and '/' 5 dígitos
            return unmaskedValue
                .replace(/\D/g, '')
                .replace(/^(\d{2})(\d)/, "$1/$2")
                .replace(/(\d{2})(\d)/, "$1/$2")
                .replace(/(\d{4})\d+?$/, "$1");
        } else { // add first '/' with 2 digits and '/' 4 dígitos
            return unmaskedValue
                .replace(/\D/g, '')
                .replace(/^(\d{2})(\d*)/, "$1/$2")
                .replace(/(\/\d{2})(\d*)/, "$1/$2")
                .replace(/(\/\d{4})\d+?$/, "$1");
        }
    }
    return "";
}

const _dateMaskRemove = (maskedValue) => {
    if(maskedValue) {
        return maskedValue.replace(/\//g, "");
    }
    return "";
}

const _isFunction = func => {
    return func && func.constructor && func.call && func.apply &&
        (typeof func === 'function') && ({}.toString.call(func) === "[object Function]");
}

const _isString = str => {
    return typeof str === 'string' || str instanceof String;
}

const getFormatMethods = (customConfig, swapMonthAndDay) => {
    if(!customConfig || (!customConfig.addMask && !customConfig.removeMask && !customConfig.inputRegEx)) {
        return { 
            addMask: _dateMaskAdd,
            removeMask: _dateMaskRemove,
            dateToString: date => _convertDateToString(date, swapMonthAndDay),
            stringToDate: str => _convertStringToDate(str, swapMonthAndDay),
            isValidValue: (customConfig && customConfig.validate) ? customConfig.validate : val => (!val || val===_convertDateToString(_convertStringToDate(val, swapMonthAndDay), swapMonthAndDay) ? true : false),
            inputRegEx: "^[0-9]{0,8}$"
        };
    }
    let { addMask, removeMask, inputRegEx, validate } = customConfig;
    if(_isFunction(addMask) && _isFunction(removeMask) && _isString(inputRegEx) && _isFunction(validate)) {
        return { 
            addMask, removeMask, inputRegEx,
            isValidValue: validate, 
            dateToString: () => {}, // No used with customization (no internal date picker)
            stringToDate: () => {}  // No used with customization (no internal date picker)
        };
    } else {
        throw new Error("At least one of the customization methods are missing or invalid. If 'customization' property where set all methods must be defined correctly.");
    }
}

export {
    getFormatMethods
}