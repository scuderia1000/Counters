// react
import React, { Component } from 'react';
import {connect} from "react-redux";
import { View } from 'react-native';
// libraries
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
// own component
import CounterField from '../../components/counterField/CounterField';
import CommonButton from '../../components/buttons/CommonButton';
import { createCounter } from './actions/AddCounterActions';
import { cloneObject } from "../../constants/FunctionConst";
import InterfaceBuilder, { TARIFF_COMPONENT } from './constatnts/InterfaceBuilder';
// styles
import styles from './AddCounterStyles';

class AddCounter extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Создать счетчик',
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
        this.getFieldsComponents = this.getFieldsComponents.bind(this);
        this.renderFields = this.renderFields.bind(this);
        this.handleChangeTariff = this.handleChangeTariff.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.state = {
            customTariffsFields: [],
            isRequiredFieldsFilled: false,
            requiredFields: {},
            fieldsValues: {},
            tariffsValues: [],
            refs: [],
            errorsDefault: [],
            errorsTariff: [],
            counterId: ''
        };
    }

    componentDidMount() {
        const { navigation, counters } = this.props;
        navigation.setParams({ createCounter: this.handleCreateCounter});
        const counterId = navigation.getParam('counterId', 'NO ID');

        if (typeof counterId === 'string' && counters.list && counters.list[counterId]) {
            const fieldsValues = cloneObject(counters.list[counterId]);
            this.setState({
                fieldsValues: {...fieldsValues},
                counterId: counterId
            })
        } else {
            // по умолчанию д.б. 1 тарифф
            this.handleAddTariff();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.customTariffsFields.length !== this.state.customTariffsFields.length) {
            setTimeout(() => {
                this.scrollToBottom();
            }, 0);
        }
    }

    renderFields = (fields) => {
        // const { defaultFields, customFields, customTariffs } = this.state;
        const fieldsComponents = this.getFieldsComponents(fields);


        return fieldsComponents;
    };

    handleAddTariff = () => {
        const { customTariffsFields = [] } = this.state;
        const newTariffs = customTariffsFields.slice();

        newTariffs.push({
            name: {...TARIFF_COMPONENT.name, autoFocus: true},
            amount: {...TARIFF_COMPONENT.amount},
        });
        this.setState({
                customTariffsFields: newTariffs
        });
    };

    handleChangeTariff = (field, value, index) => {
        const { tariffsValues, errorsTariff } = this.state;
        const newValues = tariffsValues.slice();
        const values = newValues[index] || {};
        values[field] = value;
        newValues.splice(index, 1, values);

        if (errorsTariff.includes(index) && !!value) {
            errorsTariff.splice(errorsTariff.indexOf(index), 1);
        }
        this.setState((state, props) => {
            return {
                tariffsValues: newValues,
                errorsTariff: errorsTariff,
            }
        });
    };

    handleFieldChange = (field, value) => {
        const { errorsDefault } = this.state;
        if (errorsDefault.includes(field) && !!value) {
            errorsDefault.splice(errorsDefault.indexOf(field), 1);
        }
        this.setState((state, props) => {
            return {
                fieldsValues: {
                    ...state.fieldsValues,
                    [field]: value
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

        // проверка тарифов
        const defaultFieldsLength = Object.keys(defaultFields).length;
        // реальные индексы на отрисованной форме
        const tariffErrorsIndexes = [];
        let index = defaultFieldsLength;
        if (customTariffsFields.length) {
            customTariffsFields.forEach((tariff, i) => {
                 Object.keys(tariff).forEach(key => {
                        if (tariff[key].required && (!tariffsValues.length || !tariffsValues[i] || !tariffsValues[i][key])) {
                            tariffErrorsIndexes.push(index);
                        }
                        index++;
                 });
            });
        }

        if (errorFields.length || tariffErrorsIndexes.length) {
            this.setState({
                errorsDefault: errorFields,
                errorsTariff: tariffErrorsIndexes,

            });
            return false;
        }

        return true;
    };

    handleCreateCounter = () => {
        const { fieldsValues, counterId } = this.state;
        if (this.checkRequiredFilled()) {
            this.props.createCounter(fieldsValues, counterId);
            this.props.navigation.goBack();
        }
    };

    scrollToBottom = () => {
        if (this.scrollView && this.scrollView.current) {
            this.scrollView.current.scrollTo({x: 0, y: 100000});
        }
    };

    getTariffComponents = () => {
        const { customTariffsFields = [], errorsTariff, tariffsValues } = this.state;
        const defaultFieldsLength = Object.keys(InterfaceBuilder.counter.fields).length;

        const fields = [];
        let index = defaultFieldsLength;
        customTariffsFields.forEach(tariff => {

            Object.keys(tariff).forEach((key) => {
                this.inputsRefs[index] = React.createRef();
                fields.push(
                    <CounterField key={`${key}_${index}`}
                                  type={key}
                                  field={tariff[key]}
                                  index={index}
                        // value={fieldsValues[key]}
                                  ref={this.inputsRefs[index]}
                                  isError={!!errorsTariff.length && errorsTariff.includes(index)}
                                  onChange={this.handleChangeTariff} />
                );
                index++;
            });

        });
        return fields;
    };

    getFieldsComponents = (fields = {}) => {
        const { errorsDefault, fieldsValues } = this.state;

        return Object.keys(fields).map((key, i) => {
            this.inputsRefs[i] = React.createRef();
            return (
                <CounterField key={`${key}_${i}`}
                              type={key}
                              field={fields[key]}
                              index={i}
                              value={fieldsValues[key]}
                              ref={this.inputsRefs[i]}
                              isError={!!errorsDefault.length && errorsDefault.includes(key)}
                              onChange={this.handleFieldChange} />
            )
        });
    };

    render() {
        const fields = InterfaceBuilder.counter.fields;
        const fieldsComp = this.renderFields(fields);
        const tariffsComp = this.getTariffComponents();

        console.log(this.state.errors)
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView getTextInputRefs={() => { return this.inputsRefs }}
                                         ref={this.scrollView}
                    // style={styles.container}
                    // contentContainerStyle={styles.container}
                >
                    {fieldsComp}
                    {tariffsComp}
                </KeyboardAwareScrollView>
                <CommonButton onPress={this.handleAddTariff}
                              caption={'Добавить тариф'}
                              icon={{name: 'plus', type: 'material-community', color: 'white'}}/>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counters: state.counters,
});
const dispatchers = dispatch => ({
    createCounter: (counterData, id) => {
        dispatch(createCounter(counterData, id));
    },
/*    createCounterTariff: (counterId, tariffsData) => {
        dispatch(createCounterTariff(counterId, tariffsData));
    },*/
});

export default connect(mapStateToProps, dispatchers)(AddCounter);