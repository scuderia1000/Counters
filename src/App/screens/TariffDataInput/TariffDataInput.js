// react
import React, {Component} from 'react';
import {connect} from "react-redux";
// libraries
import {
    View,
    TouchableOpacity,
    Text,
    FlatList,
    ToastAndroid,
    Platform,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import Torch from 'react-native-torch';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
// own component
import CounterField from '../../components/counterField/CounterField';
import CommonButton from "../../components/buttons/CommonButton";
import { createTariffData } from "./actions/TariffDataInputActions";
// styles
import styles from './TariffDataInputStyles';
import {COUNTERS_VALUES, TARIFF_DATA} from "../../constants/ActionConst";
import {calculateCounterValues, getCounterTariffsData} from "../../constants/FunctionConst";

class TariffDataInput extends Component {
    static navigationOptions = {
        title: 'Заполнение данных'
    };

    constructor(props) {
        super(props);
        this.state = {
            values: {}, // {tariffId_1: {value: , dataId: }, tariffId_2: {value: , dataId: }}
            errorsTariff: [], // ids
            isTorchOn: false,
        };
        this.inputs = [];
        this.handleFieldChange = this.handleFieldChange.bind(this);
    }

    componentDidMount() {
        const { tariffsValues = {} } = this.props;
        const { list, editData  } = tariffsValues;
        if (list && editData) {
            const values = {};
            editData.dataIds.forEach(dataId => {
                Object.keys(list).forEach(tariffId => {
                    const dataIds = Object.keys(list[tariffId]);
                    if (dataIds.includes(dataId)) {
                        values[tariffId] = {
                            value: list[tariffId][dataId].value,
                            dataId: dataId
                        }
                    }
                })
            });
            this.setState({
                values: values
            })
        }
        // при таком варианте установки фокуса, чтобы открылась клавиатура, приложение зависает,
        // если этот экран вызывается через setTimeout в Home.handleAddCounterData
        /*if (this.inputs.length && this.inputs[0] && this.inputs[0].current) {
            console.log('this.inputsRefs[index]', this.inputs[0])
            this.inputs[0].current.focus();
        }*/
    }

    componentWillUnmount() {
        const { isTorchOn } = this.state;
        if (isTorchOn) {
            Torch.switchState(false);
        }
        const { tariffsValues = {}, tariffs = {} } = this.props;
        const { list, editData = {} } = tariffsValues;

        const counterId = editData.counterId;
        if (list && editData && counterId) {
            const tariffsData = getCounterTariffsData(counterId, tariffs, tariffsValues);
            if (Object.keys(tariffsData).length !== 0) {
                const counterValues = calculateCounterValues(counterId, tariffs, tariffsData);
                if (counterValues.length) {
                    this.props.updateCounterData(counterId, counterValues);
                }
            }
            this.props.resetEditData();
        }
    }

    handleFieldChange = (id, value) => {
        this.setState((state, props) => {
            return {
                values: {
                    ...state.values,
                    [id]: {
                        ...state.values[id],
                        value: value
                    }
                },
                errorsTariff: [],
            }
        })
    };

    checkFields = () => {
        const {tariffsList, navigation} = this.props;
        const {values, errorsTariff} = this.state;
        const counterId = navigation.getParam('counterId', '');
        const valuesIds = Object.keys(values);
        if (counterId) {
            const tariff = tariffsList[counterId];
            const tariffIds = Object.keys(tariff);
            const errorIds = tariffIds.filter(id => !values[id] || !values[id].value);

            if (errorIds.length) {
                this.setState({errorsTariff: errorIds});
                return false;
            }

            return true;
        }
        return false;
    };

    getTariffsComponents = () => {
        const {tariffsList, navigation} = this.props;
        const {values, errorsTariff} = this.state;
        const counterId = navigation.getParam('counterId', '');
        if (counterId) {
            const tariff = tariffsList[counterId];
            return Object.keys(tariff).map((id, index) => {
                const field = {
                    label: tariff[id].name,
                    style: {height: 90},
                    keyboardType: 'numeric',
                    errorText: 'Введите значение',
                    errorStyle: {
                        bottom: -2,
                    }
                };
                this.inputs[index] = React.createRef();
                return (
                    <CounterField key={`${id}_${index}`}
                                  type={id}
                                  field={field}
                                  index={index}
                                  value={values && values[id] && values[id].value}
                                  ref={this.inputs[index]}
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
            this.props.saveData(this.state.values);
            this.props.navigation.goBack();
        }
    };

    handleTorchClick = async () => {
        const {isTorchOn} = this.state;
        const newTorchState = !isTorchOn;
        try {
            if (Platform.OS === 'ios') {
                Torch.switchState(newTorchState);
            } else {
                const cameraAllowed = await Torch.requestCameraPermission(
                    'Разрешить доступ к камере', // dialog title
                    'Необходимо разрешение на доступ к камере, чтобы воспользоваться фонариком.' // dialog body
                );

                if (cameraAllowed) {
                    Torch.switchState(newTorchState);
                    this.setState({isTorchOn: newTorchState});
                }
            }
        } catch (e) {
            ToastAndroid.show(
                'Проблема с доступом к вашей камере',
                ToastAndroid.SHORT
            );
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps={'always'}>
                    <KeyboardAvoidingView>
                        <View style={styles.torchComponent}>
                            <CommonButton style={styles.torch}
                                          onPress={this.handleTorchClick}
                                          caption={'Фонарик'}
                                          captionStyle={styles.torchCaption}
                                // icon={{name: 'plus', type: 'material-community', color: 'white'}}
                            />
                        </View>
                        {this.getTariffsComponents()}
                    </KeyboardAvoidingView>
                </ScrollView>
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
    tariffs: state.tariffs,
    tariffsValues: state.tariffsData,
});
const dispatchers = dispatch => ({
    saveData: (data) => {
        dispatch(createTariffData(data));
    },
    resetEditData: () => {
        dispatch({type: TARIFF_DATA.RESET_EDIT})
    },
    updateCounterData: (counterId, counterData) => {
        dispatch({
            type: COUNTERS_VALUES.UPDATE,
            payload: {
                counterId: counterId,
                counterData: counterData
            }
        });
    },
});
export default connect(mapStateToProps, dispatchers)(TariffDataInput);