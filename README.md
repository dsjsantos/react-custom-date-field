# React react-custom-date-field

React Custom Date component that renders a custom date input field with an optional date picker and mask customization.

## Installation

npm install --save react-custom-date-field

## Dependencies

If you will user the built in date picker functionality you need to add jQuery and react-datepicker dependencies to your project as follows:

```sh
npm install jquery react-datepicker
```

## Online Demo

Coming soon.

## Styles

The style sheet is automatically included by the component. There is no need for extra import but you may customize it to fit your needs.

## Code example

#### Import component into your react project

```jsx
import SimpleMonthPicker from 'react-custom-date-field';
```

#### Code snippet for a component

```jsx
    const [ valueBDay, setValueBDay ] = useState(null);
    const [ validBDay, setValidBDay ] = useState(true);
    const [ errorMessageBDay, setErrorMessageBDay ] = useState(null);

    <DateWithDatePicker
        id="myDateID"
        name="myDate"
        autoComplete={false}
        label="Birthday"
        className="field-bday"
        placeolder="mm/dd/yyyy"
        requiredMark={true}
        initialValue={null}
        errorMessage={errorMessageBDay ? errorMessageBDay : (!validBDay ? "Invalid value" : "")}
        clearInvalidValueOnBlur={true}
        swapMonthAndDay={false}
        onChange={(val, valid) => { setValueBDay(val); setValidBDay(valid); }}
        datePicker={{ 
            enabled: true,
            pickImageTitle: "Open date picker",
            pickImageAlt: "date picker"
        }}
        customization={{}}
    />
```

See a full demo code at then [usage_demo](https://github.com/dsjsantos/react-custom-date-field/tree/main/usage_demo)

## Properties

##### @id:
(Optional) Component id

##### @name:
(Optional) Component input field name

##### @autoComplete:
(Optional) Autocomplete field name, is empty defaults to 'name'. If false disables autocomplete.

##### @label:
(Optional) Field label, rendered before input with css class 'field-label'

##### @className:
(Optional) Aditional class style to be added to root component element wich already has a class '\_\_react-custom-date-field__'

##### @placeolder:
Component placeolder text.

##### @floatingPlaceholder:
(Optional) If true its implies in a alternative component design with label and te placeholder will change their position above the input when focused or not empty.

##### @disabled:
(Optional) If true disables field

##### @requiredMark:
(Optional) If true will render a mark '*' with class style 'field-required-mark' just by the field label.

##### @initialValue:
(Optional) Initial component input value. It will not be validated (valid date or meets custom validation), any value is accepted. It should not a valid date (or meets custom validation) rules to avoid undesired editing behaiviors.

##### @value:
(Optional) Component input value. It differs from 'initialValue' behavior that only set the initial component value and never more and is not validate. On the other hand, every time the 'value' property where changed it will change the component internal value but it must be a valid date (or meets custom validation). This property is not binded to component internal value, it will only affect the internal value if this property changes. 

##### @errorMessage=
(Optional) The current componet error message, rendered junst after input element with class style 'field-error' wich, by default is a red text with little smaller font size.

##### @clearInvalidValueOnBlur
(Optional) If true the component value will be cleared when the internal inputs loses focus and the value where not a complete valid date.

##### @swapMonthAndDay
(Optional) If true the default internal date mask will change from 'mm/dd/yyyy' to 'dd/mm/yyyy' and it reflects on date validation.

##### @onChange(value, valid)
Function to be called on component value changes. The parameters are the new value itself and if this one is already a valid date (or meets custom validation)

##### @datePicker
(Optional) It's a object that configure a optional internal date picker.


- *enabled*: (true | false) if true enables the date picker
- *locale*: (Optional) one of available languages from 'date-fns/locale/'
- *offsetYAboveInput*: Integer offset to date picker vertical position when its visible and above the input field.
- *offsetYUnderInput*: Integer offset to date picker vertical position when its visible and under the input field.
- *minDate*: (Optional) if set must be a valid date, according to internal mask and limits the picker minimum date.
- *maxDate*: (Optional) if set must be a valid date, according to internal mask and limits the picker maximum date.
- *pickImageTitle*: (Optional) date picker trigger default image 'title' property. It has no effect if 'customTriggerContent' were set.
- *pickImageAlt*: (Optional) date picker trigger default image title 'alt'. It has no effect if 'customTriggerContent' were set.
- *customTriggerContent*: (Optional) Custom content to date picker trigger 

##### @customization
(Optional) It's a object that customizes the component masking behavior. If it were set will disable the internal date pick. There are two possibilities wich are customize/override only the validation or override the validation and mask methods/properties as follows:

- *validate(value)*: Function that receives the current value (masked) and must return (true | false) indicating if the value is valid or not.
- *addMask(unmaskedValue, isErasing)*: Function to add a mask to an unmasked value. The property 'isErasing' indicates if the last editing action erased/removed part of previus value wich may be used to buid the mask correctly.

    > If present it is also required 'validate' and ('inputRegEx' or 'unmaskedMaxDigits').
- *removeMask(maskedValue)*: Function to remove mask from value, probably you dont need any customization due that the internal 'removeMask' method already remove all non digit caractes as follows:

    > If present it is also required 'validate', 'addMask' and ('inputRegEx' or 'unmaskedMaxDigits').

```js
const removeMask = maskedValue => maskedValue ? maskedValue.replace(/\D/g, "") : "";
```

- *inputRegEx*: A string regular expression to validate the unmasked value during the value change. Be aware that it's not meant to valiate the complete date itself but and it mus accept combinations from empty to complete date. e.g., the internal regular expression is "^\d{0,8}$" so the default unmasked value must contains only digits with length from 0 to 8.
- *unmaskedMaxDigits*: This is used only if 'inputRegEx' isn't present. It´s a number that represents the maximum number of digits on unmasked value. e.g. if it is 12 this is the same as a inputRegEx = "^\d{0,12}$".

    > If 'inputRegEx' or 'unmaskedMaxDigits' is present it is also required 'validate' and 'addMask'.


## Developing

Clone/fork the repository

```sh
npm install
npm run build
```

## Changelogs

### v1.0.0 (April 08, 2023)
#### Added
- First component release

## License

[Apache License v2.0](https://opensource.org/licenses/Apache-2.0)


### Enjoy-it
