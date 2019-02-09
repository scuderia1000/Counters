// react
import React, {Component} from 'react';
import {connect} from "react-redux";
// libraries
import {
    View,
    ToastAndroid,
    Platform,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import Torch from 'react-native-torch';
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
        const { list, editData = {} } = tariffsValues;
        if (list && editData.counterId) {
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
        const { tariffsValues = {} } = this.props;
        const { editData = {} } = tariffsValues;

        const counterId = editData.counterId;
        if (counterId) {
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
        const {values} = this.state;
        const counterId = navigation.getParam('counterId', '');
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

    focusNextInput = (index) => {
        if (this.inputs[index] && this.inputs[index].current) {
            this.inputs[index].current.focus();
        }
    };

    handleAddData = () => {
        const { navigation, countersValues = {}, counters = {}, tariffsValues = {} } = this.props;
        const { list = {}} = countersValues;
        const { editData = {} } = tariffsValues;

        if (this.checkFields()) {
            const counterId = editData.counterId;
            this.props.saveData(counterId, this.state.values);

            const countersIds = Object.keys(list);
            // пока сделал так, в голову не приходит как по нормальному перейти к экранну с данными после обновления стора
            if (countersIds.length && countersIds.includes(counterId)) {
                const counterData = counters.list[counterId];
                this.props.setCounterId(counterId);
                navigation.navigate('TariffData', {title: counterData.counterName});
            } else {
                navigation.goBack();
            }
        }
    };

    getTariffsComponents = () => {
        const {tariffsList, navigation} = this.props;
        const {values, errorsTariff} = this.state;
        const counterId = navigation.getParam('counterId', '');
        if (counterId) {
            const tariff = tariffsList[counterId];
            const tariffIds = Object.keys(tariff);
            return tariffIds.map((id, index) => {
                const field = {
                    label: tariff[id].name,
                    style: {height: 90},
                    keyboardType: 'numeric',
                    errorText: 'Введите значение',
                    errorStyle: {
                        bottom: -2,
                    },
                    returnKeyType: index === tariffIds.length - 1 ? 'done' : 'next',
                };
                const onSubmitEditing = index !== tariffIds.length - 1 ? this.focusNextInput : () => {};
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
                                  onSubmitEditing={onSubmitEditing}
                    />
                );
            })
        }

        return [];
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
    countersValues: state.countersValues,
});
const dispatchers = dispatch => ({
    saveData: (counterId, data) => {
        dispatch(createTariffData(counterId, data));
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
    setCounterId: (counterId) => {
        dispatch({
            type: COUNTERS_VALUES.OPEN,
            payload: {
                counterId: counterId
            }
        })
    }
});
export default connect(mapStateToProps, dispatchers)(TariffDataInput);