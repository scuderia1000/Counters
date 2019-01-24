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
        console.log('tarissData', this.state)
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
                {/*<KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}
                                         // ref={this.scrollView}
                                         getTextInputRefs={() => { return this.inputs }}
                >
                    <View style={styles.torchComponent}>
                        <CommonButton style={styles.torch}
                                      onPress={this.handleTorchClick}
                                      caption={'Фонарик'}
                                      captionStyle={styles.torchCaption}
                            // icon={{name: 'plus', type: 'material-community', color: 'white'}}
                        />
                    </View>
                    {this.getTariffsComponents()}
                </KeyboardAwareScrollView>
                <CommonButton onPress={this.handleAddData}
                              caption={'Сохранить'}
                              // icon={{name: 'plus', type: 'material-community', color: 'white'}}
                />*/}
            </View>
        )
    }
}

const mapStateToProps = state => ({
    counters: state.counters,
    tariffsList: state.tariffs.list,
});
const dispatchers = dispatch => ({
    saveData: (data) => {
        dispatch(createTariffData(data));
    }
});
export default connect(mapStateToProps, dispatchers)(TariffDataInput);