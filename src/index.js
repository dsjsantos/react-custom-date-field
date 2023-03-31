import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import DatePicker, { registerLocale } from "react-datepicker";

import { getFormatMethods } from './tools.js';

// Datepicker and component styles
import "react-datepicker/dist/react-datepicker.css";
import './styles.css';


const DATE_PICKER_BUTTON_ID = "__datePickerButtonId__";
const DATE_PICKER_WRAPPER_ID = "__datePickerWrapperId__";
const PICKER_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAh1BMVEUAAAD////8/PyLi4tnZ2f4+PjW1taRkZGOjo5qamqtra2GhoZkZGTz8/Pb29u2trazs7Oqqqqfn5+UlJSAgIBwcHBtbW1cXFzY2NjQ0NC5ubmvr6+Xl5eDg4N8fHzV1dXS0tLMzMy/v7+8vLyjo6OIiIh2dnZ0dHRiYmLg4OCnp6dXV1dQUFD92TzqAAAAAXRSTlMAQObYZgAAAKdJREFUCNcVjUcSwzAMAwlS1ZJ7TWynF6f8/31RbsAMsEtEk1JnorNXVSpPpepyjD7KdRufNA6xafygYrdE72mb671d5qw97LPqQL0G1wVQWA3tyDO4NGDjUnD0aaUZOncPqgmtoj6Hnnf/MfJ8oRHA5QXeBQ04ehQn01bmeF3NaQr0fWcXuVXZLYnKngZA1+lrVgZsQiXRBD46ZrYkIqFbRbqHyN3+AG9DCqjhEuvBAAAAAElFTkSuQmCC";

let eventOnPageResizeScroll = null;

const CustomDatePicker = (props) => {
    const { id, value, locale, dateFormatMask, minDate, maxDate, str2Date, onChange, onClickOutside } = props;
    return(
        <div id={DATE_PICKER_WRAPPER_ID} className="date-picker-wrapper">
            <div className="triangle-up"></div>
            <DatePicker
                id={id}
                selected={str2Date(value)}
                locale={locale}
                dateFormat={dateFormatMask}
                onChange={date => { onChange(date); }}
                onClickOutside={e => onClickOutside(e)}
                fixedHeight={false}
                minDate={str2Date(minDate)}
                maxDate={str2Date(maxDate)}
                inline />
            <div className="triangle-down not-visible"></div>
        </div>
    )
}

const RequiredMark = () => <i className="field-required-mark">*</i>;

const DateWithDatePicker = (props) => {
    const { id, name, autoComplete, label, className, placeolder, floatingPlaceholder, disabled, requiredMark,
            initialValue, value, errorMessage, clearInvalidValueOnBlur, swapMonthAndDay, onChange, datePicker, customization } = props;
    const { locale, offsetYAboveInput, offsetYUnderInput, minDate, maxDate, pickImageTitle, pickImageAlt, customTriggerContent } = datePicker || {};
    const { addMask, removeMask, dateToString, stringToDate, isValidValue, inputRegEx } = getFormatMethods(customization, swapMonthAndDay);
    const _getFieldContentClasses = () => `${fieldValue ? 'has-content' : 'empty'}${isValidValue(fieldValue) ? ' valid' : ' invalid'}${errorMessage ? ' error' : ''}${disabled ? ' disabled' : ''}`;

    const [ visibleDatePicker, setVisibleDatePicker ] = useState(null);
    const [ fieldValue, setFieldValue ] = useState(initialValue);

    const inputClassName = `ui fluid input${errorMessage ? " error" : ""}`;
    const isDatePickerVisible = name===visibleDatePicker;
    const enableDatePicker = datePicker && datePicker.enabled && !customization;

    const _handleBlur = () => {
        if(clearInvalidValueOnBlur && !isValidValue(fieldValue) && onChange) {
            setFieldValue("");
            if(onChange) {
                onChange("", true);
            }
        }
    }

    const _handleChange = (e, val) => {
        if(e) {
            e.stopPropagation();
        }
        const isErasing = (val ? val.length : 0) < (fieldValue ? fieldValue.length : 0);
        const unmasked = removeMask(val);
        const masked = addMask(unmasked, isErasing);
        const regExInput = inputRegEx ? new RegExp(inputRegEx) : null;
        if ((masked===fieldValue) || (unmasked && regExInput && !regExInput.test(unmasked))) {
            return;
        }
        setFieldValue(masked);
        if(onChange) {
            onChange(masked, isValidValue(val));
        }
    }    

    const _handleDatePickTrigger = (field, forceHide) => {
        const newVisibleDatePicker = (forceHide || field===visibleDatePicker) ? null : field;
        eventOnPageResizeScroll = !newVisibleDatePicker ? null : () => {
            const dpWrapper = $(`#${DATE_PICKER_WRAPPER_ID}`);
            const topAbove = (offsetYAboveInput || 0) + (floatingPlaceholder ? 0 : -25) + (fieldValue ? -18 : 0);
            const topUnder = (offsetYUnderInput || 0) + (floatingPlaceholder ? 38 : 25);
            if(dpWrapper.length===1) {
                const { height } = dpWrapper[0].getBoundingClientRect();
                const ptop = dpWrapper.parent()[0].getBoundingClientRect().top;
                const vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                const upTriagle = dpWrapper.find('.triangle-up');
                const downTriagle = dpWrapper.find('.triangle-down');
                if((ptop + topUnder + height) > vh && (ptop-height)>0) { // place above input
                    if((ptop + topUnder)<vh) {
                        upTriagle.addClass('not-visible');
                        downTriagle.removeClass('not-visible');
                        dpWrapper.css('top', '-' + (height-topAbove) + 'px');
                    } else { // hide date picker
                        _hideDatePicker(null);
                    }
                } else {
                    upTriagle.removeClass('not-visible');
                    downTriagle.addClass('not-visible');
                    dpWrapper.css('top', `${topUnder}px`);
                }
            }
        };
        setVisibleDatePicker(newVisibleDatePicker);
        setTimeout(() => _handlePageResizeScroll(), 1);
    }

    const _handlePageResizeScroll = () => {
        if(eventOnPageResizeScroll) {
            eventOnPageResizeScroll();
        }
    };

    const _hideDatePicker = (obj) => {
        const { outside, nativeEvent }  = obj || {};
        const triggerId = `${visibleDatePicker}_${DATE_PICKER_BUTTON_ID}`;
        const srcElement = nativeEvent && nativeEvent.srcElement;
        const triggerClick = outside && srcElement && (srcElement.id===triggerId 
            || (srcElement.offsetParent && srcElement.offsetParent.id===triggerId));
        if(triggerClick) { // a datepicker click will be triggered and will close the date picker
            return;
        }
        _handleDatePickTrigger(null, true);
    }

    useEffect(() => {
        if(visibleDatePicker) {
            _handlePageResizeScroll();
        }
    }, [visibleDatePicker]);

    useEffect(() => {
        if(locale && locale.code) {
            registerLocale(locale.code, locale);
        }
    }, [locale]);

    useEffect(() => {
        if(value !== undefined && isValidValue(value)) {
            setFieldValue(value);
        }
    }, [value, isValidValue]);

    useEffect(() => {
        window.addEventListener("resize", _handlePageResizeScroll, true);
        document.addEventListener("scroll", _handlePageResizeScroll, true);
        return(() => {
            window.removeEventListener("resize", _handlePageResizeScroll, true);
            document.removeEventListener("scroll", _handlePageResizeScroll, true);
        });
    }, []);

    const extraParams = {};
    if(autoComplete!==false) {
        extraParams.autoComplete = autoComplete ? autoComplete : name
    }

    return(
        <div className={`__react-custom-date-field__${className ? ` ${className}` : ""}${floatingPlaceholder ? " fph-floating" : ""}`}>
            { !floatingPlaceholder && label &&
            <div className="field-label">{label}{requiredMark ? <RequiredMark /> : null}</div>
            }

            <div className={`input-wrapper ${_getFieldContentClasses(fieldValue, errorMessage, disabled)}`}>
                <input 
                    id={id}
                    name={name}
                    disabled={disabled}
                    className={inputClassName}
                    placeholder={floatingPlaceholder ? null: placeolder}
                    onChange={(e) => _handleChange(e, e.target.value)}
                    onBlur={(e) => _handleBlur(e.target.value)}
                    value={fieldValue ? fieldValue : ""}
                    {...extraParams}
                />
                { enableDatePicker &&
                <>
                    <div className="date-picker-trigger">
                        <div className="button-wrapper">
                            <button id={`${name}_${DATE_PICKER_BUTTON_ID}`} type="button" disabled={disabled} onClick={() => _handleDatePickTrigger(isDatePickerVisible ? null : name)}>
                                { customTriggerContent ? customTriggerContent :
                                <img src={PICKER_IMAGE} className="ui image" title={pickImageTitle} alt={pickImageAlt} />
                                }
                            </button>
                        </div>
                    </div>
                    { isDatePickerVisible &&
                        <CustomDatePicker 
                            id={`_datepicker_${id}`}
                            value={fieldValue}
                            locale={locale}
                            dateFormatMask={swapMonthAndDay ? "dd/MM/yyyy" : "MM/dd/yyyy"}
                            minDate={minDate}
                            maxDate={maxDate}
                            str2Date={stringToDate}
                            onChange={date => { _handleChange(null, dateToString(date)); _hideDatePicker(null); } }
                            onClickOutside={e => _hideDatePicker({ outside: true, nativeEvent: e})}
                        />
                    }
                </>
                }
                { floatingPlaceholder && 
                <div className='ui label label'>{placeolder}</div>
                }
                { errorMessage &&
                <div className="field-error">{errorMessage}</div>
                }
            </div>

        </div>
    );
}

export default DateWithDatePicker;