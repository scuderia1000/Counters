// react
import React, { Component } from 'react';
import {connect} from "react-redux";
// libraries
import {View, TouchableOpacity, Text, FlatList} from 'react-native';
// own component
import CounterField from '../../components/counterField/CounterField';
// styles
import styles from './TariffDataInputStyles';
import KeyboardAwareScrollView from "react-native-keyboard-aware-scrollview/src/KeyboardAwareScrollView";
import CommonButton from "../../components/buttons/CommonButton";

class TariffDataInput extends Component {
    static navigationOptions = {
        title: 'Заполнение данных'
    };

    constructor(props) {
        super(props);
        this.state = {
            values: {}, // {id_1: value1, id_2: value2}
            errorsTariff: [], // ids
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
    }

    handleFieldChange = (id, value) => {
        this.setState((state, props) => {
            return {
                values: {
                    ...state.values,
                    [id]: value
                },
                errorsTariff: [],
            }
        })
    };

    checkFields = () => {
        const { tariffsList, navigation } = this.props;
        const { values, errorsTariff } = this.state;
        const counterId = navigation.getParam('counterId', '');
        const valuesIds = Object.keys(values);
        if (counterId) {
            const tariff = tariffsList[counterId];
            const tariffIds = Object.keys(tariff);
            const errorIds = tariffIds.filter(id => !values[id]);

            if (errorIds.length) {
                this.setState({errorsTariff: errorIds});
                return false;
            }

            return true;
        }
        return false;
    };

    getTariffsComponents = () => {
        const { tariffsList, navigation } = this.props;
        const { values, errorsTariff } = this.state;
        const counterId = navigation.getParam('counterId', '');
        if (counterId) {
            const tariff = tariffsList[counterId];
            return Object.keys(tariff).map((id, index) => {
                const field = {
                    label: tariff[id].name,
                    style: {height: 90},
                    keyboardType: 'numeric',
                    errorText: 'Введите значение',
                    /*errorStyle: {
                        bottom: -3,
                    }*/
                };
                return (
                    <CounterField key={`${id}_${index}`}
                                  type={id}
                                  field={field}
                                  index={index}
                                  value={values && values[id]}
                                  // ref={key === 'name' && this.inputsRefs[index] || ''}
                                  isError={!!errorsTariff.length && errorsTariff.includes(id)}
                                  onChange={this.handleFieldChange}
                                  autoFocus={index === 0}
                    />
                );
            })
        }

        return [];
    };

    handleAddData = () => {
        if (this.checkFields()) {

        }
    };

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}
                                         // ref={this.scrollView}
                                         // getTextInputRefs={() => { return this.inputsRefs }}
                >
                    {this.getTariffsComponents()}
                </KeyboardAwareScrollView>
                <CommonButton onPress={this.handleAddData}
                              caption={'Сохранить'}
                              // icon={{name: 'plus', type: 'material-community', color: 'white'}}
                />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    counters: state.counters,
    tariffsList: state.tariffs.list,
});
const dispatchers = dispatch => ({
});
export default connect(mapStateToProps, dispatchers)(TariffDataInput);