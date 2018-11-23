// react
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, KeyboardAvoidingView, ScrollView  } from 'react-native';
// libraries
import { FormLabel, FormInput, FormValidationMessage, Divider } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
// own component
import CounterField from '../../components/counterField/CounterField';
import CommonButton from '../../components/buttons/CommonButton';
// styles
import styles from './AddCounterStyles';

const TARIFF_COMPONENT = {
    name: {
        // label: 'Название тарифа',
        placeholder: 'Название тарифа...',
    },
    amount: {
        // label: 'Ставка тарифа',
        keyboardType: 'numeric',
        placeholder: 'Ставка тарифа...',
        style: {
            marginBottom: 15
        }
    }
};

class AddCounter extends Component {
    static navigationOptions = {
        title: 'Создать счетчик'
    };

    constructor(props) {
        super(props);
        this._nodes = new Map();
        this.getFieldsComponents = this.getFieldsComponents.bind(this);
        this.renderDefaultsFields = this.renderDefaultsFields.bind(this);
        this.state = {
            defaultFields: {
                counterName: {
                    // label: 'Название',
                    placeholder: 'Название счетчика...',
                    autoFocus: true,
                },
                personalAccount: {
                    // label: '№ счета/договора',
                    placeholder: '№ счета/договора...',
                },
                fio: {
                    // label: 'ФИО',
                    placeholder: 'ФИО, с кем заключен договор...',
                },
                address: {
                    // label: 'Адрес',
                    placeholder: 'Адрес...',
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



    handleOnChange = (type, value) => {
        this.setState({[type]: value});
    };


    renderDefaultsFields = () => {
        const { defaultFields, customFields } = this.state;
        const defaultFieldsComponents = this.getFieldsComponents(defaultFields);
        const customFieldsComponents = this.getFieldsComponents(customFields, true);
        return defaultFieldsComponents.concat(customFieldsComponents);
    };

    getFieldsComponents = (fields = {}, isContainsDeleteButton = false) => {
        const { defaultFields } = this.state;
        const defaultFieldsLength = Object.keys(defaultFields).length;
        // const self = this;
        /*Object.keys(fields).map((key, i) => {
            if (isContainsDeleteButton) {
                this.refs[i + defaultFieldsLength] = React.createRef();
            } else {
                this.refs[i] = React.createRef();
            }
        });*/
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
            return [
                <CounterField key={`${key}_${i}`}
                              style={style}
                              type={key}
                              label={label}
                              keyboardType={keyboardType}
                              placeholder={placeholder}
                              ref={c => this._nodes.set(index, c)}
                              autoFocus={autoFocus} />,
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

    render() {
        console.log(this._nodes);
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView getTextInputRefs={() => { return this.refs}}
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
export default AddCounter;