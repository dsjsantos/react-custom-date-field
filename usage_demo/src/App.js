import React, { useState } from 'react';
import DateWithDatePicker from 'react-custom-date-field';
import pt_BR from "date-fns/locale/pt-BR";

import './App.css';

const customMaskRemove = maskedValue => maskedValue ? maskedValue.replace(/\D/g, "") : "";

const customMaskAdd = (unmaskedValue, erasing) => {
    if(unmaskedValue) {
        if(erasing) { // add first '/' with 3 digits and '/' 5 dígitos
            return unmaskedValue
                .replace(/\D/g, '')
                .replace(/^(\d{2})(\d)/, "$1/$2")
                .replace(/(\d{2})(\d)/, "$1/$2")
                .replace(/(\d{4})(\d)/, "$1 $2")
                .replace(/( \d{2})(\d+?)$/, "$1:$2")
                .replace(/(:\d{2})\d+?$/, "$1");
                
        } else { // add first '/' with 2 digits and '/' 4 dígitos
            return unmaskedValue
                .replace(/\D/g, '')
                .replace(/^(\d{2})(\d*)/, "$1/$2")
                .replace(/(\/\d{2})(\d*)/, "$1/$2")
                .replace(/(\/\d{4})(\d*)/, "$1 $2")
                .replace(/( \d{2})(\d*)$/, "$1:$2")
                .replace(/(:\d{2})\d+?$/, "$1");
        }
    }
    return "";
}

const customValidation = val => {
    return (!val || val===dateToString(stringToDate(val)) ? true : false);
}

const dateToString = date => {
    if(date instanceof Date) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth()+1).padStart(2, '0'); //January is 0!
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, '0');
        const mi = String(date.getMinutes()).padStart(2, '0');
        return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
    }
    return "";
}

const stringToDate = str => {
    if(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(str)) {
        const parts = str.split(" ");
        const dateParts = parts[0].split("/");
        const year = dateParts[2];
        const month = dateParts[1] - 1;
        const day = dateParts[0];
        const hourParts = parts[1].split(":");
        const hour = hourParts[0];
        const minute = hourParts[1];
        return new Date(year, month, day, hour, minute);
    }
    return null;
}

export default function App() {
    const [ value1, setValue1 ] = useState(null);
    const [ value2, setValue2 ] = useState(null);
    const [ value3, setValue3 ] = useState(null);
    const [ value4, setValue4 ] = useState(null);
    const [ valueCustom, setValueCustom ] = useState(null);
    const [ valueFrom1, setValueFrom1 ] = useState(null);
    const [ valueTo1, setValueTo1 ] = useState(null);
    const [ valueFrom2, setValueFrom2 ] = useState(null);
    const [ valueTo2, setValueTo2 ] = useState(null);
    const [ valid1, setValid1 ] = useState(true);
    const [ validFrom1, setValidFrom1 ] = useState(true);
    const [ validTo1, setValidTo1 ] = useState(true);
    const [ errorMessage1, setErrorMessage1 ] = useState(null);
    const [ errorMessage2, setErrorMessage2 ] = useState(null);
    const [ errorMessage3, setErrorMessage3 ] = useState(null);
    const [ errorMessage4, setErrorMessage4 ] = useState(null);
    const [ errorMessageFrom1, setErrorMessageFrom1 ] = useState(null);
    const [ errorMessageTo1, setErrorMessageTo1 ] = useState(null);
    const [ errorMessageFrom2, setErrorMessageFrom2 ] = useState(null);
    const [ errorMessageTo2, setErrorMessageTo2 ] = useState(null);
    const [ errorMessageCustom, setErrorMessageCustom ] = useState(null);

    const _handleClearError = () => {
        setErrorMessage1(null);
        setErrorMessage2(null);
        setErrorMessage3(null);
        setErrorMessage4(null);
        setErrorMessageFrom1(null);
        setErrorMessageTo1(null);
        setErrorMessageFrom2(null);
        setErrorMessageTo2(null);
        setErrorMessageCustom(null)
    }
    
    const _handleShowError = () => {
        setErrorMessage1("Error date 1");
        setErrorMessage2("Error date 2");
        setErrorMessage3("Error date 3");
        setErrorMessage4("Error date 3");
        setErrorMessageFrom1("Test error 'from 1'");
        setErrorMessageTo1("Test error 'to 1'");
        setErrorMessageFrom2("Test error 'from 2'");
        setErrorMessageTo2("Test error 'to 2'");
        setErrorMessageCustom("Test error custom");
    }

    const _handleValueSet = () => {
        const date = new Date();
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth()+1).padStart(2, '0'); //January is 0!
        const yyyy = date.getFullYear();
        const today = `${mm}/${dd}/${yyyy}`;
        setValue1(today);
        setValue2(today);
    }

    return (
        <div className="main-app">
            <h1>React custom date field component Demonstration</h1>
            <h2>Welcome to React Custom Date Field component.</h2>
            <p>React Custom Date component that renders a custom date input field with an optional date picker and mask customization.</p>

            <div className='action-row'>
                <button type='button' className='btn-action' onClick={_handleClearError}>Clear fields erro</button>
                <button type='button' className='btn-action' onClick={_handleShowError}>Set fields erro</button>
                <button type='button' className='btn-action' onClick={_handleValueSet}>Set 'today' to fields 1 and 2</button>
            </div>

            <div className='section-title'>
                    <h4>With date picker, invalid emphasis and clear invalid value on blur and required mark indicator</h4>
                    <h5>Date picker limited between January 1st, 2023 amd August 31, 2023</h5>
                </div>
            <form name='frmMain'>
                <div className='field-row-invalid-feedback'>
                    <DateWithDatePicker
                        id="fldDate1_ID"
                        name="fldDate1"
                        autoComplete={false}
                        label="Date field 1"
                        className="field-one"
                        placeolder="Inform a date"
                        floatingPlaceholder={false}
                        disabled={false}
                        requiredMark={true}
                        initialValue={value1}
                        value={value1}
                        errorMessage={errorMessage1 ? errorMessage1 : (!valid1 ? "Invalid value" : "")}
                        clearInvalidValueOnBlur={true}
                        swapMonthAndDay={false}
                        onChange={(val, valid) => { setValue1(val); setValid1(valid); }}
                        datePicker={{ 
                            enabled: true,
                            locale: undefined, 
                            offsetYAboveInput: 0,
                            offsetYUnderInput: 0,
                            minDate: "01/01/2023",
                            maxDate: "08/31/2023",
                            pickImageTitle: "Open date picker",
                            pickImageAlt: "date picker",
                            customTriggerContent: undefined
                        }}
                        customization={null}
                    />
                    <DateWithDatePicker
                        id="fldDate1_ID"
                        name="fldDate2"
                        label={null}
                        className="field-two"
                        placeolder="Date field 2"
                        floatingPlaceholder={true}
                        disabled={false}
                        requiredMark={false}
                        initialValue={value2}
                        value={value2}
                        errorMessage={errorMessage2}
                        clearInvalidValueOnBlur={true}
                        onChange={setValue2}
                        datePicker={{
                            enabled: true,
                            minDate: "01/01/2023",
                            maxDate: "08/31/2023"
                        }}
                        customization={null}
                    />
                </div>

                <div className='section-title'>
                    <h4>Without date picker, not invalid emphasis and do not clear invalid value on blur</h4>
                </div>
                <div className='field-row-common'>
                    <DateWithDatePicker
                        id="fldDate1_ID"
                        name="fldDate3"
                        label="Date field 3"
                        className="field-three"
                        placeolder="mm/dd/yyyy"
                        floatingPlaceholder={false}
                        disabled={false}
                        requiredMark={false}
                        initialValue={value3}
                        errorMessage={errorMessage3}
                        onChange={setValue3}
                        datePicker={false}
                    />

                    <DateWithDatePicker
                        id="fldDate1_ID"
                        name="fldDate4"
                        label={null}
                        className="field-four no-border-feedback"
                        placeolder="Date field 4"
                        floatingPlaceholder={true}
                        disabled={false}
                        requiredMark={false}
                        initialValue={value4}
                        errorMessage={errorMessage4}
                        onChange={setValue4}
                        datePicker={false}
                    />
                </div>

                <div className='section-title'>
                    <h4>Range dates with, no invalid emphasis and do not clear invalida values on blur</h4>
                    <h5>Date picker range limited according to other's field valid value ('To' limits max date to 'From' and 'From' limits min date of 'To')</h5>
                </div>
                <div className='field-row-period'>
                    <DateWithDatePicker
                        id="fldDateFrom1_ID"
                        name="fldDateFrom1"
                        label="From 1"
                        className="field-date-from"
                        placeolder="mm/dd/yyyy"
                        floatingPlaceholder={false}
                        disabled={false}
                        requiredMark={false}
                        initialValue={valueFrom1}
                        errorMessage={errorMessageFrom1}
                        onChange={(val, valid) => { setValueFrom1(val); setValidFrom1(valid); }}
                        datePicker={{
                            enabled: true,
                            maxDate: (validTo1 && valueTo1) ? valueTo1 : undefined
                        }}
                    />

                    <DateWithDatePicker
                        id="fldDateTo1_ID"
                        name="fldDateTo1"
                        label="To 1"
                        className="field-date-to"
                        placeolder="mm/dd/yyyy"
                        floatingPlaceholder={false}
                        disabled={false}
                        requiredMark={false}
                        initialValue={valueTo1}
                        errorMessage={errorMessageTo1}
                        onChange={(val, valid) => { setValueTo1(val); setValidTo1(valid); }}
                        datePicker={{
                            enabled: true,
                            minDate: (validFrom1 && valueFrom1) ? valueFrom1 : undefined
                        }}
                    />
                </div>

                <div className='section-title'>
                    <h4>Date range, date picker with customized language (pt-BR), mask with inverted month and day</h4>
                    <h5>Date picker without date limit</h5>
                </div>
                <div className='field-row-period'>
                    
                    <DateWithDatePicker
                        id="fldDateFrom2_ID"
                        name="fldDateFrom2"
                        label="From 2"
                        className="field-date-from"
                        placeolder="dd/mm/yyyy"
                        floatingPlaceholder={false}
                        disabled={false}
                        requiredMark={false}
                        initialValue={valueFrom2}
                        errorMessage={errorMessageFrom2}
                        clearInvalidValueOnBlur={true}
                        swapMonthAndDay={true}
                        onChange={setValueFrom2}
                        datePicker={{ 
                            enabled: true,
                            locale: pt_BR
                        }}
                    />

                    <DateWithDatePicker
                        id="fldDateTo2_ID"
                        name="fldDateTo2"
                        label="To 2"
                        className="field-date-to"
                        placeolder="dd/mm/yyyy"
                        floatingPlaceholder={false}
                        disabled={false}
                        requiredMark={false}
                        initialValue={valueTo2}
                        errorMessage={errorMessageTo2}
                        clearInvalidValueOnBlur={true}
                        swapMonthAndDay={true}
                        onChange={setValueTo2}
                        datePicker={{
                            enabled: true,
                            locale: pt_BR
                        }}
                    />
                </div>

                <div className='section-title'>
                    <h4>Date with custom validaton methods, invalid emphasis, do not clear invalid value on blur</h4>
                    <h5>- Custom validation methods implies in disable the internal date picker</h5>
                </div>
                <div className='field-row-invalid-feedback'>
                    <DateWithDatePicker
                        id="fldDateFrom_ID"
                        name="fldDateCustom"
                        label="Custom"
                        className="field-date-custom"
                        placeolder="dd/mm/yyyy hh:mi"
                        floatingPlaceholder={false}
                        disabled={false}
                        requiredMark={false}
                        initialValue={valueCustom}
                        errorMessage={errorMessageCustom}
                        clearInvalidValueOnBlur={false}
                        swapMonthAndDay={true}
                        onChange={setValueCustom}
                        customization={{ 
                            addMask: customMaskAdd,
                            removeMask: customMaskRemove,
                            validate: customValidation,
                            inputRegEx: "^[0-9]{0,12}$"
                        }}
                    />
                </div>

            </form>

            <div className='empty-block'></div>

        </div>
    );
}
