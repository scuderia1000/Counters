// react
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, KeyboardAvoidingView  } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
// own component
import CounterField from '../../components/counterField/CounterField';
// styles
import styles from './AddCounterStyles';

class AddCounter extends Component {
    static navigationOptions = {
        title: 'Создать счетчик'
    };

    state = {
        defaultFieldsType: {
            counterName: {
                label: 'Название'
            },
            personalAccount: {
                label: '№ счета/договора',
            },
            fio: {
                label: 'ФИО'
            },
            address: {
                label: 'Адрес',
            },
            tariffName: {
                label: 'Название тарифа',
            },
            tariff: {
                label: 'Ставка тарифа',
                keyboardType: 'numeric'
            }
        },
        isRequiredFieldsFilled: false,
        fieldsValues: {}
    };

    handleOnChange = (type, value) => {
        this.setState({[type]: value});
    };


    renderDefaultsFields = () => {
        const { defaultFieldsType } = this.state;
        return Object.keys(defaultFieldsType).map((key, index) => {
            const label = defaultFieldsType[key].label,
                keyboardType = defaultFieldsType[key].keyboardType;
            return (
                <CounterField type={key} label={label} keyboardType={keyboardType} key={`${key}_${index}`}/>
            )
        });
    };

    render() {
        return (
            <KeyboardAvoidingView style={styles.container}
                                  behavior="padding">
                {this.renderDefaultsFields()}
            </KeyboardAvoidingView>
        )
    }
}
export default AddCounter;