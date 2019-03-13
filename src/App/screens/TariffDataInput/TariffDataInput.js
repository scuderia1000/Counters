// react
import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import CommonButton from '../../components/buttons/CommonButton';
import { createTariffData, updateTariffData } from './actions/TariffDataInputActions';
// styles
import styles from './TariffDataInputStyles';
import { COUNTERS_VALUES, TARIFF_DATA } from '../../constants/ActionConst';
import { calculateCounterValues, getCounterTariffsData } from '../../constants/FunctionConst';

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
        const { tariffsData = {} } = this.props;
        const { editData = {} } = tariffsData;
        if (Object.keys(editData).length) {
            this.setState({
                values: {...editData}
            });
        }
        // if (list && editData.counterId) {
        //     const values = {};
        //     editData.dataIds.forEach(dataId => {
        //         const tariffId = list[dataId].tariffId;
        //         values[tariffId] = {
        //             currentValue: list[dataId].currentValue,
        //             id: dataId
        //         };
        //     });
        //     this.setState({
        //         values: values
        //     });
        // }
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
        const { tariffsData = {} } = this.props;
        const { editData = {} } = tariffsData;

        const counterId = editData.counterId;
        if (counterId) {
            this.props.resetEditData();
        }
    }

    handleFieldChange = (tariffId, value) => {
        this.setState((state, props) => {
            return {
                values: {
                    ...state.values,
                    [tariffId]: {
                        ...state.values[tariffId],
                        currentValue: value
                    }
                },
                errorsTariff: [],
            };
        });
    };

    checkFields = () => {
        const { tariffsList, navigation, tariffsData = {} } = this.props;
        const { editData = {} } = tariffsData;
        const { values } = this.state;
        const counterId = navigation.getParam('counterId', '');

        let errorIds = [];
        const editTariffsIds = Object.keys(editData);
        if (editTariffsIds.length) {
            errorIds = editTariffsIds
                .filter(tariffId => !values[tariffId] || !values[tariffId].currentValue)
        } else {
            errorIds = Object.values(tariffsList)
                .filter(tariff => tariff.counterId === counterId && !tariff.deleteTime)
                .filter(tariff => !values[tariff.id] || !values[tariff.id].currentValue)
                .map(tariff => tariff.id);
        }

        if (errorIds.length) {
            this.setState({ errorsTariff: errorIds });
            return false;
        }

        return true;
    };

    focusNextInput = (index) => {
        if (this.inputs[index] && this.inputs[index].current) {
            this.inputs[index].current.focus();
        }
    };

    handleAddData = () => {
        const { navigation, countersValues = {}, counters = {}, tariffsData = {}, resetEditData } = this.props;
        // const { list = {}} = countersValues;
        const { editData = {} } = tariffsData;

        if (this.checkFields()) {
            // const counterId = navigation.getParam('counterId', '');
            // const counterId = editData.counterId;
            if (Object.keys(editData).length) {
                this.props.updateData(this.state.values);
                resetEditData();
            } else {
                this.props.saveData(this.state.values);
            }
            navigation.goBack();
            /*const countersIds = Object.keys(list);
            // пока сделал так, в голову не приходит как по нормальному перейти к экранну с данными после обновления стора
            if (countersIds.length && countersIds.includes(counterId)) {
                const counterData = counters.list[counterId];
                this.props.setCounterId(counterId);
                navigation.navigate('TariffData', {title: counterData.counterName});
            } else {
                navigation.goBack();
            }*/
        }
    };

    getTariffsComponents = () => {
        const { tariffsList, navigation, tariffsData = {} } = this.props;
        const { editData = {} } = tariffsData;

        const { values, errorsTariff } = this.state;
        const counterId = navigation.getParam('counterId', '');
        if (counterId) {
            let tariffIds = [];
            const editTariffsIds = Object.keys(editData);
            if (editTariffsIds.length) {
                tariffIds = editTariffsIds;
            } else {
                tariffIds = Object.values(tariffsList)
                    .filter(tariff => tariff.counterId === counterId && !tariff.deleteTime)
                    .map(tariff => tariff.id);
            }

            return tariffIds.map((id, index) => {
                const field = {
                    label: tariffsList[id].name,
                    style: { height: 90 },
                    keyboardType: 'numeric',
                    errorText: 'Введите значение',
                    errorStyle: {
                        bottom: 8,
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
                                  value={values && values[id] && String(values[id].currentValue)}
                                  ref={this.inputs[index]}
                                  isError={!!errorsTariff.length && errorsTariff.includes(id)}
                                  onChange={this.handleFieldChange}
                                  autoFocus={index === 0}
                                  onSubmitEditing={onSubmitEditing}
                    />
                );
            });
        }

        return [];
    };

    handleTorchClick = async () => {
        const { isTorchOn } = this.state;
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
                    this.setState({ isTorchOn: newTorchState });
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
        );
    }
}

const mapStateToProps = state => ({
    counters: state.counters,
    tariffsList: state.tariffs.list,
    tariffsData: state.tariffsData,
});
const dispatchers = dispatch => ({
    saveData: (data) => {
        dispatch(createTariffData(data));
    },
    updateData: (data) => {
        dispatch(updateTariffData(data));
    },
    resetEditData: () => {
        dispatch({ type: TARIFF_DATA.RESET_EDIT });
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
        });
    }
});
export default connect(mapStateToProps, dispatchers)(TariffDataInput);