// react
import React, { Component } from 'react';
import {connect} from "react-redux";
// libraries
import ReactNative, { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import uuid from "uuid";

// own component
import InterfaceBuilder, { TARIFF_COMPONENT } from './constatnts/InterfaceBuilder';
import CounterField from "../../components/counterField/CounterField";
import CommonButton from "../../components/buttons/CommonButton";
import {createCounter, createCounterTariff, updateCounter, updateCounterTariff} from "./actions/AddCounterActions";
import {cloneObject, validateEmail} from "../../constants/FunctionConst";

// styles
import styles from './AddCounterNewStyles';

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
            fields: {},
            fieldsValues: {}, // { fieldName: value }
            errors: [], // [fieldName]
            // используется при редактировании счетчика
            // связка полей тарифа с id тарифа
            editedTariffsFields: {} // { tariffId: ['tariffName_index', 'tariffAmount_index', 'tariffCurrentValue_index']}
        }
    }

    componentDidMount(): void {
        const { navigation, counters = {} } = this.props;
        const { editData = {} } = counters;
        const { counterId, tariffs } = editData;
        navigation.setParams({ createCounter: this.handleCreateCounter});

        if (counterId) {
            let newFields = {...InterfaceBuilder.counter.fields};
            const editedTariffsFields = {};
            let fieldsValues = cloneObject(counters.list[counterId]);

            let fieldsCount = Object.keys(newFields).length;
            Object.keys(tariffs).forEach(tariffId => {
                editedTariffsFields[tariffId] = [];

                Object.keys(TARIFF_COMPONENT).forEach(fieldName => {
                    const name = `${fieldName}_${fieldsCount}`;
                    newFields[name] = TARIFF_COMPONENT[fieldName];

                    Object.keys(tariffs[tariffId])
                        .filter(field => fieldName.toLowerCase().includes(field.toLowerCase()))
                        .map(field => fieldsValues[name] = tariffs[tariffId][field]);

                    editedTariffsFields[tariffId].push(name);
                });
                fieldsCount++;
            });
            this.setState({
                fields: newFields,
                fieldsValues: fieldsValues,
                editedTariffsFields: editedTariffsFields,
            })
        } else {
            this.setState({
                fields: {...InterfaceBuilder.counter.fields, ...InterfaceBuilder.tariff.fields}
            });
        }
    }

    handleCreateCounter = () => {
        const values = cloneObject(this.state.fieldsValues);
        const { editedTariffsFields } = this.state;
        const editedTariffIds = Object.keys(editedTariffsFields);
        const { counters } = this.props;
        const { editData = {} } = counters;
        const { counterId } = editData;

        if (this.checkRequiredFilled()) {
            // разделяю поля счетчика и поля тарифа
            const counterValues = {};
            let tariffsValues = [];

            Object.keys(InterfaceBuilder.counter.fields).forEach(fieldName => {
                 counterValues[fieldName] = values[fieldName];
                 // delete values[fieldName];
            });

            Object.keys(InterfaceBuilder.tariff.fields).forEach(fieldName => {
                const valuesFieldNames = Object.keys(values).filter(name => name.includes(fieldName));
                valuesFieldNames.forEach((name, index) => {
                    if (tariffsValues[index]) {
                        tariffsValues[index] = {
                            ...tariffsValues[index],
                            [name]: values[name]
                        };
                    } else {
                        tariffsValues[index] = {
                            [name]: values[name]
                        };
                        if (editedTariffIds.length && !tariffsValues[index].hasOwnProperty('id')) {
                            editedTariffIds
                                .filter(id => editedTariffsFields[id].includes(name))
                                .map(id => {
                                    tariffsValues[index]['id'] = id;
                                });

                        }
                    }
                });
            });



            let id;
            if (counterId) {
                id = counterId;
                this.props.updateCounter(counterValues, id);
                this.props.updateCounterTariff(id, tariffsValues);
            } else {
                id = uuid.v4();
                this.props.createCounter(counterValues, id);
                this.props.createCounterTariff(id, tariffsValues);
            }



            this.props.navigation.goBack();
        }
    };

    checkRequiredFilled() {
        const { fields, fieldsValues } = this.state;

        const valuesNames = Object.keys(fieldsValues);

        const errorFieldNames = Object.keys(fields)
            .filter(fieldName =>
                fields[fieldName].required &&
                (!valuesNames.includes(fieldName) || !fieldsValues[fieldName]));
        // e-mail не обязательное поле, но если оно заполнено у него нужно проверить формат
        if (!fields['emailAddress'].required && valuesNames.includes('emailAddress') &&
            fieldsValues['emailAddress'] && !validateEmail(fieldsValues['emailAddress'])) {
            errorFieldNames.push('emailAddress');
        }

        if (errorFieldNames.length) {
            this.setState({errors: errorFieldNames});
            setTimeout(() => {
                this.scrollToError();
            }, 0);
            return false;
        }
        return true;
    }

    scrollToError() {
        const { errors, fields } = this.state;

        if (errors.length) {
            const fieldsNames = Object.keys(fields);
            const firstErrorIndex = fieldsNames.indexOf(errors[0]);

            this.inputsRefs[firstErrorIndex].current.focus();
            this.inputsRefs[firstErrorIndex].current.measureLayout(ReactNative.findNodeHandle(this.scrollView.current), ( xPos, yPos, Width, Height ) =>
            {
                this.scrollView.current.scrollTo({x: 0, y: yPos});
            });
        }
    }

    scrollToBottom = () => {
        if (this.scrollView && this.scrollView.current) {
            this.scrollView.current.scrollTo({x: 0, y: 100000});
        }
    };

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
                    ...newFields
                }
            }
        });
        setTimeout(() => {
            this.scrollToBottom();
        }, 0);
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
        const { fields, fieldsValues, errors } = this.state;
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
                              isError={!!errors.length && errors.includes(fieldName)}
                              onChange={this.handleFieldChange}
                              hasDelButton={fieldName.includes('tariffName_')}
                              onDelPress={this.handleRemoveTariffField} />
            )
        });
    };

    handleRemoveTariffField = (index) => {
        const editedTariffsFields = cloneObject(this.state.editedTariffsFields);

        const fields = cloneObject(this.state.fields);
        const fieldsValues = cloneObject(this.state.fieldsValues);
        const errors = [...this.state.errors];

        const removedFields = [];

        Object.keys(TARIFF_COMPONENT).forEach(fieldName => {
            const removedFieldName = `${fieldName}_${index}`;
            delete fields[removedFieldName];
            delete fieldsValues[removedFieldName];
            errors.splice(errors.indexOf(removedFieldName), 1);
            removedFields.push(removedFieldName);
        });

        const newState = {
            fields: fields,
            fieldsValues: fieldsValues,
            errors: errors,
        };

        const editedTariffIds = Object.keys(editedTariffsFields);
        if (editedTariffIds.length) {
            editedTariffIds
                .filter(id => editedTariffsFields[id].includes(removedFields[0]))
                .map(id => {
                    delete editedTariffsFields[id];
                });

        }

        this.setState(newState);
    };

    render() {
        // console.log('this.state.fieldsValues', this.state.fieldsValues)
        // console.log('this.state.fields', this.state.fields)
        // console.log('this.state.errors', this.state.errors)
        console.log('this.state.editedTariffsFields', this.state.editedTariffsFields)
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
    createCounter: (counterData, id) => {
        dispatch(createCounter(counterData, id));
    },
    updateCounter: (counterData, id) => {
        dispatch(updateCounter(counterData, id));
    },
    createCounterTariff: (counterId, tariffsData) => {
        dispatch(createCounterTariff(counterId, tariffsData));
    },
    updateCounterTariff: (counterId, tariffsData) => {
        dispatch(updateCounterTariff(counterId, tariffsData));
    },
});
export default connect(mapStateToProps, dispatchers)(AddCounterNew);