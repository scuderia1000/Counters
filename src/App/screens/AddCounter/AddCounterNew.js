// react
import React, { Component } from 'react';
import {connect} from "react-redux";
// libraries
import ReactNative, { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
// own component
import InterfaceBuilder, { TARIFF_COMPONENT } from './constatnts/InterfaceBuilder';
import CounterField from "../../components/counterField/CounterField";
import CommonButton from "../../components/buttons/CommonButton";
// styles
import styles from './AddCounterNewStyles';
import {createCounter, createCounterTariff, updateCounter, updateCounterTariff} from "./actions/AddCounterActions";
import {cloneObject} from "../../constants/FunctionConst";

class AddCounterNew extends Component {
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
        this.state = {
            // при добавлении тарифа нужно к названию добавляемых полей добавить индекс fieldName_index,
            // т.к. название это уникальный ключ поля
            fields: InterfaceBuilder.counter.fields, // {}
            fieldsValues: {}, // { fieldName: value }
            errors: [], // [fieldName]
        }
    }

    handleAddTariffFields = () => {
        const { fields } = this.state;
        let index = Object.keys(fields).length;
        const newFields = {};

        Object.keys(TARIFF_COMPONENT).forEach(fieldName => {
            newFields[`${fieldName}_${index}`] = TARIFF_COMPONENT[fieldName];
        });
        this.setState((state) => {
            return {
                fields: {
                    ...state.fields,
                    newFields
                }
            }
        });
    };

    focusNextInput = (index) => {
        if (this.inputsRefs[index] && this.inputsRefs[index].current) {
            this.inputsRefs[index].current.focus();
        }
    };

    handleFieldChange = (fieldName, value) => {
        const errors = [...this.state.errors];
        if (errors.includes(fieldName) && !!value) {
            errors.splice(errors.indexOf(fieldName), 1);
        }
        this.setState((state) => {
            return {
                fieldsValues: {
                    ...state.fieldsValues,
                    [fieldName]: value,
                },
                errors: errors,
            }
        })
    };

    getFields = () => {
        const { fields, fieldsValues } = this.state;
        const { editData = {} } = this.props.counters;
        const { counterId } = editData;
        return Object.keys(fields).map((fieldName, index) => {
            this.inputsRefs[index] = React.createRef();
            return (
                <CounterField key={`${fieldName}_${index}`}
                              type={fieldName}
                              field={fields[fieldName]}
                              autoFocus={!counterId && fields[fieldName].autoFocus}
                              index={index}
                              value={fieldsValues[fieldName]}
                              ref={this.inputsRefs[index]}
                              onSubmitEditing={this.focusNextInput}
                              // isError={!!errorsDefault.length && errorsDefault.includes(key)}
                              onChange={this.handleFieldChange}
                              hasDelButton={fieldName.includes('tariffName_')}
                              onDelPress={this.handleRemoveTariffField} />
            )
        });
    };

    handleRemoveTariffField = (index) => {
        const fields = cloneObject(this.state.fields);
        const fieldsValues = cloneObject(this.state.fieldsValues);
        const errors = [...this.state.errors];

        Object.keys(TARIFF_COMPONENT).forEach(fieldName => {
            const removedFieldName = `${fieldName}_${index}`;
            delete fields[removedFieldName];
            delete fieldsValues[removedFieldName];
            errors.splice(errors.indexOf(removedFieldName), 1);
        });
    };

    render() {
        // console.log('this.state.fields', this.state.fields)
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}
                                         ref={this.scrollView}
                                         getTextInputRefs={() => { return this.inputsRefs }}
                >
                    {this.getFields()}
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
    // tariffs: state.tariffs,
    // tariffsValues: state.tariffsData,
});
const dispatchers = dispatch => ({
    // createCounter: (counterData, id) => {
    //     dispatch(createCounter(counterData, id));
    // },
    // updateCounter: (counterData, id) => {
    //     dispatch(updateCounter(counterData, id));
    // },
    // createCounterTariff: (counterId, tariffsData) => {
    //     dispatch(createCounterTariff(counterId, tariffsData));
    // },
    // updateCounterTariff: (counterId, tariffsData) => {
    //     dispatch(updateCounterTariff(counterId, tariffsData));
    // },
});
export default connect(mapStateToProps, dispatchers)(AddCounterNew);