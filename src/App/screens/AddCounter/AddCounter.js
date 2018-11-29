// react
import React, { Component } from 'react';
import {connect} from "react-redux";
import { View, TouchableOpacity, Text, KeyboardAvoidingView, ScrollView  } from 'react-native';
// libraries
import { FormLabel, FormInput, FormValidationMessage, Divider } from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
// own component
import CounterField from '../../components/counterField/CounterField';
import CommonButton from '../../components/buttons/CommonButton';
import { createCounter } from './actions/AddCounterActions';
// styles
import styles from './AddCounterStyles';

const TARIFF_COMPONENT = {
    name: {
        placeholder: 'Название тарифа...',
    },
    amount: {
        keyboardType: 'numeric',
        placeholder: 'Ставка тарифа...',
        style: {
            marginBottom: 15
        }
    }
};

class AddCounter extends Component {
    static navigationOptions = {
        title: 'Создать счетчик',
        headerRight: <Text style={{fontSize: 16, fontWeight: "bold", marginRight: 5}} onPress={this.handleCreateCounter}>Готово</Text>
    };

    constructor(props) {
        super(props);
        this.inputsRefs = [];
        this.getFieldsComponents = this.getFieldsComponents.bind(this);
        this.renderDefaultsFields = this.renderDefaultsFields.bind(this);
        this.state = {
            defaultFields: {
                counterName: {
                    placeholder: 'Название счетчика...',
                    autoFocus: true,
                },
                personalAccount: {
                    placeholder: '№ счета/договора...',
                },
                fio: {
                    placeholder: 'ФИО, с кем заключен договор...',
                },
                address: {
                    placeholder: 'Адрес...',
                },
                emailAddress: {
                    placeholder: 'E-mail, куда отправлять данные...',
                    style: {
                        marginBottom: 15
                    }
                },
                tariffName: {...TARIFF_COMPONENT.name},
                tariff: {...TARIFF_COMPONENT.amount}
            },
            customFields: {},
            isRequiredFieldsFilled: false,
            fieldsValues: {},
            refs: []
        };
    }

    renderDefaultsFields = () => {
        const { defaultFields, customFields } = this.state;
        const defaultFieldsComponents = this.getFieldsComponents(defaultFields);
        const customFieldsComponents = this.getFieldsComponents(customFields, true);
        return defaultFieldsComponents.concat(customFieldsComponents);
    };

    getFieldsComponents = (fields = {}, isContainsDeleteButton = false) => {
        const { defaultFields } = this.state;
        const defaultFieldsLength = Object.keys(defaultFields).length;

        return Object.keys(fields).map((key, i) => {
            const label = fields[key].label,
                placeholder = fields[key].placeholder,
                keyboardType = fields[key].keyboardType,
                style = fields[key].style,
                autoFocus = fields[key].autoFocus;
            let index = i;
            if (isContainsDeleteButton) {
                index = index + defaultFieldsLength;
            }

            this.inputsRefs[index] = React.createRef();
            return [
                <CounterField key={`${key}_${i}`}
                              style={style}
                              type={key}
                              label={label}
                              keyboardType={keyboardType}
                              placeholder={placeholder}
                              ref={this.inputsRefs[index]}
                              autoFocus={autoFocus}
                              onChange={this.handleOnChangeField} />,
                !style && <Divider key={`divider_${index}`}/>
            ]
        });
    };

    handleAddTariff = () => {
        const { customFields = {} } = this.state;
        let tariffNumber = 0;
        const customTariffKeys = Object.keys(customFields);
        if (customTariffKeys.length) {
            customTariffKeys.forEach(key => {
                if (key.includes('tariffName')) {
                    tariffNumber++;
                }
            });
        }
        let newCustomFields = {
            [`tariffName${tariffNumber}`]: {...TARIFF_COMPONENT.name, autoFocus: true},
            [`tariff${tariffNumber}`]: {...TARIFF_COMPONENT.amount},
        };
        this.setState({
            customFields: {
            ...customFields,
            ...newCustomFields
            }

        });
    };

    handleOnChangeField = (field, value) => {
        this.setState((state, props) => {
            return {fieldsValues: {...state.fieldsValues, [field]: value}};
        });
    };

    handleCreateCounter = () => {
        const { fieldsValues } = this.state;
        this.props.createCounter(fieldsValues);
    };

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView getTextInputRefs={() => { return this.inputsRefs }}
                    // style={styles.container}
                    // contentContainerStyle={styles.container}
                >
                    {this.renderDefaultsFields()}
                </KeyboardAwareScrollView>
                <CommonButton onPress={this.handleAddTariff}
                              caption={'Добавить тариф'}
                              icon={{name: 'plus', type: 'material-community', color: 'white'}}/>
            </View>
        )
    }
}

const mapStateToProps = state => ({});
const dispatchers = dispatch => ({
    createCounter: (counterData) => {
        dispatch(createCounter(counterData));
    },
});

export default connect(mapStateToProps, dispatchers)(AddCounter);