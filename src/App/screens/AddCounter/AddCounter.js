// react
import React, { Component } from 'react';
import {connect} from "react-redux";
import ReactNative, { View, KeyboardAvoidingView, ScrollView } from 'react-native';
// libraries
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import uuid from "uuid";
// own component
import CounterField from '../../components/counterField/CounterField';
import CommonButton from '../../components/buttons/CommonButton';
import { createCounter, createCounterTariff } from './actions/AddCounterActions';
import { cloneObject } from "../../constants/FunctionConst";
import InterfaceBuilder, { TARIFF_COMPONENT } from './constatnts/InterfaceBuilder';
// styles
import styles from './AddCounterStyles';

const defaultFieldsLength = Object.keys(InterfaceBuilder.counter.fields).length;

const TITLE = {
    CREATE: 'Создать счетчик',
    EDIT: 'Редактировать счетчик',
};

class AddCounter extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', ''),
            headerRight: (
                <CommonButton style={{marginRight: 10, height: 38, borderRadius: 4}}
                              caption='Готово'
                              captionStyle={{fontSize: 16, fontWeight: "bold"}}
                              onPress={() => navigation.state.params.createCounter()}/>

            )
        }
    };

    constructor(props) {
        super(props);
        this.inputsRefs = [];
        this.scrollView = React.createRef();
        this.view = React.createRef();
        this.getFieldsComponents = this.getFieldsComponents.bind(this);
        this.handleFieldTariffChange = this.handleFieldTariffChange.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleRemoveTariffField = this.handleRemoveTariffField.bind(this);
        this.state = {
            customTariffsFields: [], // {name: '', amount: ''}
            isRequiredFieldsFilled: false,
            requiredFields: {},
            fieldsValues: {},
            tariffsValues: {}, // {index: {name: '', amount: '', value: number}}
            refs: [],
            errorsDefault: [],
            errorsTariff: [], // реальные индексы на форме
        };
    }

    componentDidMount() {
        const { navigation, counters = {}, tariffs = {}, tariffsValues = {} } = this.props;
        const { counterId } = counters;
        navigation.setParams({ createCounter: this.handleCreateCounter});

        if (counterId && counters.list && counters.list[counterId]) {
            const fieldsValues = cloneObject(counters.list[counterId]);
            const tariffsCopy = cloneObject(tariffs.list[counterId]);
            const tariffsDataCopy = cloneObject(tariffsValues.list);

            const tariffsFiledValues = {};
            const defaultFields = InterfaceBuilder.counter.fields;
            let index = Object.keys(defaultFields).length;

            Object.keys(tariffsCopy).forEach(tariffId => {
                // значения полей тарифа
                tariffsFiledValues[index] = tariffsCopy[tariffId];
                // начальное значение
                if (tariffsDataCopy) {
                    const tariffDataValues = tariffsDataCopy[tariffId] || {};
                    const tariffsDataKeys = Object.keys(tariffDataValues);
                    if (tariffsDataKeys.length) {
                        tariffsDataKeys.sort((key1, key2) => tariffDataValues[key1].createTime - tariffDataValues[key2].createTime);

                        tariffsFiledValues[index] = {...tariffsFiledValues[index], ...tariffDataValues[tariffsDataKeys[0]]};
                    }
                }
                this.handleAddTariffFields();
                index++;
            });

            this.setState({
                fieldsValues: fieldsValues,
                tariffsValues: tariffsFiledValues,
            })
        } else {
            // по умолчанию д.б. 1 тарифф
            this.handleAddTariffFields();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.customTariffsFields.length && prevState.customTariffsFields.length !== this.state.customTariffsFields.length) {
            setTimeout(() => {
                this.scrollToBottom();
            }, 0);
        }
    }

    handleAddTariffFields = (e) => {
        const newTariff = {
            name: {...TARIFF_COMPONENT.name, autoFocus: !!e},
            amount: {...TARIFF_COMPONENT.amount},
            value: {...TARIFF_COMPONENT.value},
        };
        this.setState((state) => {
            return {
                customTariffsFields: state.customTariffsFields.concat(newTariff)
            }
        });
    };

    handleRemoveTariffField(index) {
        const { customTariffsFields = [], errorsTariff = [], tariffsValues = {} } = this.state;
        const fields = customTariffsFields.slice();
        fields.splice(index - defaultFieldsLength, 1);

        const values = {};
        let indexCorrection = 0;
        Object.keys(tariffsValues).forEach(key => {
            if (Number(key) !== index) {
                values[key - indexCorrection] = tariffsValues[key];
            } else {
                indexCorrection = 1;
            }
        });

        const errors = errorsTariff.slice();
        errors.splice(errors.indexOf(index), 1);

        this.inputsRefs.splice(index, 1);

        this.setState({
            customTariffsFields: fields,
            errorsTariff: errors,
            tariffsValues: values,
        })


    }

    handleFieldTariffChange = (field, value, index) => {
        const { tariffsValues, errorsTariff } = this.state;
        const newValues = cloneObject(tariffsValues);
        const values = newValues[index] || {};
        values[field] = value;
        newValues[index] = values;

        if (errorsTariff.includes(index) && !!value) {
            errorsTariff.splice(errorsTariff.indexOf(index), 1);
        }
        this.setState({
                tariffsValues: newValues,
                errorsTariff: errorsTariff,
        });
    };

    handleFieldChange = (fieldName, value) => {
        const { errorsDefault } = this.state;
        if (errorsDefault.includes(fieldName) && !!value) {
            errorsDefault.splice(errorsDefault.indexOf(fieldName), 1);
        }
        this.setState((state, props) => {
            return {
                fieldsValues: {
                    ...state.fieldsValues,
                    [fieldName]: value
                },
                errorsDefault: errorsDefault,

            };
        });
    };

    checkRequiredFilled = () => {
        const { fieldsValues, tariffsValues, customTariffsFields } = this.state;
        const defaultFields = InterfaceBuilder.counter.fields;

        const defaultRequiredFields = Object.keys(defaultFields).filter(key => defaultFields[key].required);
        const valuesKeys = Object.keys(fieldsValues);
        let errorFields = [];
        if (defaultRequiredFields.length) {
            errorFields = defaultRequiredFields.filter(fieldName => !valuesKeys.includes(fieldName) || !fieldsValues[fieldName]);
        }
        // e-mail не обязательное поле, но у него нужно проверить правильность заполнения
        if (valuesKeys.includes('emailAddress') && fieldsValues['emailAddress'] && !this.validateEmail(fieldsValues['emailAddress'])) {
            errorFields.push('emailAddress');
        }

        // проверка тарифов
        // реальные индексы на отрисованной форме
        const tariffErrorsIndexes = [];
        let index = defaultFieldsLength;
        if (customTariffsFields.length) {
            customTariffsFields.forEach((tariff, i) => {
                 Object.keys(tariff).forEach(key => {
                        if (tariff[key].required && (!Object.keys(tariffsValues).length || !tariffsValues[index] || !tariffsValues[index][key])) {
                            tariffErrorsIndexes.push(index);
                        }
                 });
                index++;
            });
        }

        if (errorFields.length || tariffErrorsIndexes.length) {
            this.setState({
                errorsDefault: errorFields,
                errorsTariff: tariffErrorsIndexes,

            });
            setTimeout(() => {
                this.scrollToError();
            }, 0);
            return false;
        }

        return true;
    };

    // копипаста https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    handleCreateCounter = () => {
        const { fieldsValues, tariffsValues } = this.state;
        const { counterId } = this.props.counters;
        if (this.checkRequiredFilled()) {
            const id = counterId ? counterId : uuid.v4();
            this.props.createCounter(fieldsValues, id);
            this.props.createCounterTariff(id, tariffsValues);
            this.props.navigation.goBack();
        }
    };

    scrollToBottom = () => {
        if (this.scrollView && this.scrollView.current) {
            this.scrollView.current.scrollTo({x: 0, y: 100000});
        }
    };

    scrollToError() {
        const { errorsDefault, errorsTariff } = this.state;
        let errorFieldIndex = 0;

        if (errorsDefault.length) {
            const defaultFieldsKeys = Object.keys(InterfaceBuilder.counter.fields);
            errorFieldIndex = defaultFieldsKeys.findIndex((key) => key === errorsDefault[0]);
        } else if (errorsTariff.length) {
            errorFieldIndex = errorsTariff[0];
        }

        this.inputsRefs[errorFieldIndex].current.focus();
        this.inputsRefs[errorFieldIndex].current.measureLayout(ReactNative.findNodeHandle(this.scrollView.current), ( xPos, yPos, Width, Height ) =>
        {
            this.scrollView.current.scrollTo({x: 0, y: yPos});
        });
    }

    getTariffComponents = () => {
        const { customTariffsFields = [], errorsTariff, tariffsValues } = this.state;

        const fields = [];
        let index = defaultFieldsLength;
        customTariffsFields.forEach((tariff, i) => {

            Object.keys(tariff).forEach((key) => {
                if (key === 'name') {
                    this.inputsRefs[index] = React.createRef();
                }
                fields.push(
                    <CounterField key={`${key}_${index}`}
                                  type={key}
                                  field={tariff[key]}
                                  index={index}
                                  value={tariffsValues && tariffsValues[index] && tariffsValues[index][key]}
                                  ref={key === 'name' && this.inputsRefs[index] || ''}
                                  isError={!!errorsTariff.length && errorsTariff.includes(index) && tariff[key].required}
                                  onChange={this.handleFieldTariffChange}
                                  onDelPress={this.handleRemoveTariffField}
                                  autoFocus={tariff[key].autoFocus}
                                  hasDelButton={i > 0 && key === 'name'} />
                );
            });
            index++;
        });
        return fields;
    };

    getFieldsComponents = (fields = {}) => {
        const { errorsDefault, fieldsValues } = this.state;
        const { counterId } = this.props.counters;
        const fieldsKeys = Object.keys(fields);

        return fieldsKeys.map((key, i) => {
            this.inputsRefs[i] = React.createRef();
            const onSubmitEditing = i !== fieldsKeys.length - 1 ? this.focusNextInput : () => {};
            return (
                <CounterField key={`${key}_${i}`}
                              type={key}
                              field={fields[key]}
                              autoFocus={!counterId && fields[key].autoFocus}
                              index={i}
                              value={fieldsValues[key]}
                              ref={this.inputsRefs[i]}
                              onSubmitEditing={onSubmitEditing}
                              isError={!!errorsDefault.length && errorsDefault.includes(key)}
                              onChange={this.handleFieldChange} />
            )
        });
    };

    focusNextInput = (index) => {
        if (this.inputsRefs[index] && this.inputsRefs[index].current) {
            this.inputsRefs[index].current.focus();
        }
    };

    render() {
        const fields = InterfaceBuilder.counter.fields;
        const fieldsComp = this.getFieldsComponents(fields);
        const tariffsComp = this.getTariffComponents();

        return (
            <View style={styles.container} >
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}
                                         ref={this.scrollView}
                                         getTextInputRefs={() => { return this.inputsRefs }}
                >
                    {fieldsComp}
                    {tariffsComp}
                </KeyboardAwareScrollView>
                <CommonButton onPress={this.handleAddTariffFields}
                              caption={'Добавить тариф'}
                              icon={{name: 'plus', type: 'material-community', color: 'white'}}/>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counters: state.counters,
    tariffs: state.tariffs,
    tariffsValues: state.tariffsData,
});
const dispatchers = dispatch => ({
    createCounter: (counterData, id) => {
        dispatch(createCounter(counterData, id));
    },
    createCounterTariff: (counterId, tariffsData) => {
        dispatch(createCounterTariff(counterId, tariffsData));
    },
});

export default connect(mapStateToProps, dispatchers)(AddCounter);