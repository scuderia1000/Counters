// react
import React, { Component } from 'react';
import {connect} from "react-redux";
// libraries
import ReactNative, { View, KeyboardAvoidingView, ScrollView } from 'react-native';

// own component
import InterfaceBuilder, { TARIFF_COMPONENT } from './constatnts/InterfaceBuilder';
import CounterField from "../../components/counterField/CounterField";
// styles
import styles from './AddCounterNewStyles';
import {createCounter, createCounterTariff, updateCounter, updateCounterTariff} from "./actions/AddCounterActions";

class AddCounterNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // при добавлении тарифа нужно к названию добавляемых полей добавить индекс fieldName_index,
            // т.к. название это уникальный ключ поля
            fields: InterfaceBuilder.counter.fields, // {}
            fieldsValues: {} // { fieldName: value }
        }
    }

    handleAddTariffFields = () => {
        const { fields } = this.state;
        let index = Object.keys(fields).length;
        const newFields = {};

        Object.keys(TARIFF_COMPONENT).forEach(fieldName => {
            newFields[`${fieldName}_${++index}`] = TARIFF_COMPONENT[fieldName];
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

    getFields = () => {
        const { fields, fieldsValues } = this.state;
        const { editData = {} } = this.props.counters;
        const { counterId } = editData;
        Object.keys(fields).map((fieldName, index) => {
            return (
                <CounterField key={`${fieldName}_${index}`}
                              type={key}
                              field={fields[key]}
                              autoFocus={!counterId && fields[key].autoFocus}
                              index={index}
                              value={fieldsValues[key]}
                              ref={this.inputsRefs[i]}
                              onSubmitEditing={onSubmitEditing}
                              isError={!!errorsDefault.length && errorsDefault.includes(key)}
                              onChange={this.handleFieldChange} />
            )
        });
    };
    render() {
        return (
            <View style={styles.container}>
                {this.getFields()}
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