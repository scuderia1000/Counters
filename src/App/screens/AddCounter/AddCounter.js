// react
import React, { Component } from 'react';
import {connect} from "react-redux";
import { View, TouchableOpacity, Text, KeyboardAvoidingView, ScrollView, Button } from 'react-native';
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
        errorText: 'Введите название',
    },
    amount: {
        keyboardType: 'numeric',
        placeholder: 'Ставка тарифа...',
        errorText: 'Введите ставку тарифа',
        style: {
            marginBottom: 15
        }
    }
};

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
        this.getFieldsComponents = this.getFieldsComponents.bind(this);
        this.renderDefaultsFields = this.renderDefaultsFields.bind(this);
        this.state = {
            defaultFields: {
                counterName: {
                    placeholder: 'Название счетчика...',
                    autoFocus: true,
                    required: true,
                    errorText: 'Введите название',
                },
                personalAccount: {
                    placeholder: '№ счета/договора...',
                    errorText: 'Введите №',
                },
                fio: {
                    placeholder: 'ФИО, с кем заключен договор...',
                    errorText: 'Введите ФИО',

                },
                address: {
                    placeholder: 'Адрес...',
                    errorText: 'Введите адрес',
                },
                emailAddress: {
                    placeholder: 'E-mail, куда отправлять данные...',
                    errorText: 'Введите e-mail',
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
            refs: [],
            errors: []
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ createCounter: this.handleCreateCounter})
    }

    renderDefaultsFields = () => {
        const { defaultFields, customFields } = this.state;
        const defaultFieldsComponents = this.getFieldsComponents(defaultFields);
        const customFieldsComponents = this.getFieldsComponents(customFields, true);
        return defaultFieldsComponents.concat(customFieldsComponents);
    };

    getFieldsComponents = (fields = {}, isContainsDeleteButton = false) => {
        const { defaultFields, errors } = this.state;
        const defaultFieldsLength = Object.keys(defaultFields).length;

        return Object.keys(fields).map((key, i) => {
            const fieldStyle = fields[key].style || '';

            let index = i;
            if (isContainsDeleteButton) {
                index = index + defaultFieldsLength;
            }

            this.inputsRefs[index] = React.createRef();
            return [
                <CounterField key={`${key}_${i}`}
                              type={key}
                              field={fields[key]}
                              index={index}
                              ref={this.inputsRefs[index]}
                              errors={errors}
                              onChange={this.handleFieldChange} />
            ]
        });
    };

    // !!fieldStyle && <Divider key={`divider_${index}`}/>
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

    handleFieldChange = (field, value) => {
        this.setState((state, props) => {
            return {
                fieldsValues: {
                    ...state.fieldsValues,
                    [field]: value
                },
                errors: []
            };
        });
    };

    handleCreateCounter = () => {
        const { fieldsValues } = this.state;
        const requiredFields = this.getRequiredFields();
        const filledFieldsNames = Object.keys(fieldsValues);

        if (requiredFields.length && !requiredFields.every(name => filledFieldsNames.includes(name))) {
            const errorFieldsNames = requiredFields.filter(name => !filledFieldsNames.includes(name));
            this.setState({
                errors: errorFieldsNames
            });
            return false;
        }
        this.props.createCounter(fieldsValues);
    };

    getRequiredFields() {
        const { defaultFields, customFields } = this.state;
        const allFields = {...defaultFields, ...customFields};
        const requiredFields = [];
        Object.keys(allFields).forEach(fieldName => {
            if (allFields[fieldName].hasOwnProperty('required') && allFields[fieldName].required) {
                requiredFields.push(fieldName);
            }
        });
        return requiredFields;
    }

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