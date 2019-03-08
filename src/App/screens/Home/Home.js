import React, { Component } from 'react';
import { View, FlatList, Modal, Text, TouchableHighlight, Alert } from 'react-native';
import { Overlay } from 'react-native-elements';
import { connect } from 'react-redux';
import ActionSheet from 'react-native-actionsheet';
// own components
import CountersModal from '../CountersModal/CountersModal';
import CommonButton from '../../components/buttons/CommonButton';
import CountersListItem from '../../components/countersList/CountersListItem';
import { editCounter, removeCounter, removeCounterTariffs } from './actions/HomeActions';
import { removeAllTariffsData } from '../TariffData/actions/TariffDataActions';
// const
import { ADD_COUNTER, REMOVE_COUNTER } from '../../constants/ProjectConst';
import { calculateCounterValues, cloneObject, getCounterTariffsData } from '../../constants/FunctionConst';
import { COUNTER, COUNTERS_VALUES, TARIFF_DATA } from '../../constants/ActionConst';
import { createCounter } from '../AddCounter/actions/AddCounterActions';
import { showAlert } from '../../actions/AlertActions';
//style
import styles from './HomeStyles';

const iconStyle = {
    type: 'material-community',
    color: 'white',
    size: 20
};

// const buttonStyle = {
//     borderRadius: 5,
//     flex: 0.48,
// };

const captionStyle = {
    fontSize: 15
};

class Home extends Component {
    static navigationOptions = {
        title: 'Показания счетчиков'
    };

    constructor(props) {
        super(props);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.handleAddCounterData = this.handleAddCounterData.bind(this);
        this.state = {
            modalVisible: false,
            isVisibleModalRemoveCounter: false,
        };
        this.actionSheet = React.createRef();
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    setVisibleModalRemove(visible) {
        this.setState({ isVisibleModalRemoveCounter: visible });
    }

    handleAddCounterData = (id) => {
        /*InteractionManager.runAfterInteractions(() => {
            // ...long-running synchronous task...
            console.log('timer')
            this.props.navigation.navigate(
                'CounterDataInput',
                {
                    counterId: id,
                }
            );
        });*/
        // если вызывать напрямую, клавиатура не появляется при фокусе на первое поле
        setTimeout(() => {
            this.props.navigation.navigate(
                'TariffDataInput',
                {
                    counterId: id,
                }
            );
        }, 0);
    };

    handleAddCounter = () => {
        this.props.resetEditData();
        this.props.navigation.navigate('AddCounter', { title: ADD_COUNTER.TITLE.CREATE });
    };

    openCounterData = (counterId) => {
        const { counters = {}, tariffs = {}, tariffsValues = {} } = this.props;

        const tariffsIds = Object.values(tariffs.list)
            .filter(tariff => tariff.counterId === counterId)
            .map(tariff => tariff.id);

        let isDataExists = Object.values(tariffsValues.list)
            .filter(data => tariffsIds.includes(data.tariffId))
            .sort((dataA, dataB) => dataB.createTime - dataA.createTime)
            .some(data => data.prevValue !== null);

        if (isDataExists) {
            this.props.navigation.navigate(
                'TariffData',
                {
                    counterId: counterId,
                    title: counters.list[counterId].counterName
                }
            );
        }
    };

    editCounter = (id) => {
        this.props.editCounter(id);
        this.props.navigation.navigate('AddCounter', { title: ADD_COUNTER.TITLE.EDIT });
    };

    removeCounter = (counterId) => {
        this.props.removeCounter(counterId);
        this.props.removeAllTariffsData(counterId);
        this.props.removeCounterTariffs(counterId);
    };

    alertShow = (counterId) => {
        const { showAlert } = this.props;
        showAlert(REMOVE_COUNTER.MESSAGE, REMOVE_COUNTER.TITLE, this.removeCounter, [counterId]);
    };

    renderItem = ({ item }) => {
        return (
            <CountersListItem
                id={item.id}
                onPressItem={this.openCounterData}
                // onLongPress={this.openCounterData}
                onLongPress={this.editCounter}
                title={item.counterName}
                onDelPress={() => this.alertShow(item.id)}
            />
        );
    };

    showActionSheet = () => {
        this.actionSheet.current.show();
    };

    actionSheetOptions = (counters) => {
        let options = [];
        if (counters.length) {
            options = counters.slice();
            options.push({ counterName: 'Отмена' });
        }

        return options;
    };

    render() {
        const { list = {} } = this.props.counters;
        const countersIds = Object.keys(list);
        let countersArray = [];
        if (countersIds.length) {
            countersArray = countersIds.map(id => list[id]);
        }

        const countersList = Object.values(list);
        // console.log('countersList', countersList)
        // const countersList = Object.keys(list).map(key => list[key]);

        const options = countersList.length && this.actionSheetOptions(countersList) || [];
        // const options = countersArray.length && this.actionSheetOptions(countersArray) || [];
        const isCounterSelectionComponentModal = countersList.length > 10;
        // const isCounterSelectionComponentModal = countersArray.length > 10;

        return (
            <View style={styles.container}>
                <View style={styles.countersListContainer}>
                    <FlatList renderItem={this.renderItem}
                              data={countersList}
                              keyExtractor={item => item.id.toString()}
                              style={{ width: '100%' }}
                    />
                </View>
                <View style={styles.buttonsContainer}>
                    <CommonButton style={styles.buttonStyle}
                                  onPress={this.handleAddCounter}
                                  caption={'Создать счетчик'}
                                  captionStyle={captionStyle}
                                  icon={{ ...iconStyle, name: 'counter' }}/>
                    <CommonButton style={styles.buttonStyle}
                                  onPress={() => {
                                      if (isCounterSelectionComponentModal) {
                                          this.setModalVisible(!this.state.modalVisible);
                                      } else {
                                          this.showActionSheet();
                                      }
                                  }}
                                  caption={'Внести данные'}
                                  captionStyle={captionStyle}
                                  icon={{ ...iconStyle, name: 'plus' }}/>
                </View>
                {isCounterSelectionComponentModal ?
                    <CountersModal visible={this.state.modalVisible}
                                   setModalVisible={this.setModalVisible}
                                   countersList={countersList}
                                   addCounterData={this.handleAddCounterData}
                    />
                    :
                    <ActionSheet
                        ref={this.actionSheet}
                        // title={'Which one do you like ?'}
                        options={options.map(counter => counter.counterName)}
                        cancelButtonIndex={options.length - 1}
                        onPress={(index) => {
                            if (index !== options.length - 1) {
                                this.handleAddCounterData(options[index].id);
                            }
                        }}
                    />
                }
                {/*<Overlay
                    isVisible={this.state.isVisibleModalRemoveCounter}
                    width="50%"
                    height="auto"
                >
                    <View>
                        <Text>Hello from Overlay!</Text>
                        <View style={styles.modalButtonContainer}>
                            <CommonButton
                                style={styles.modalButton}
                                onPress={() => {
                                    this.setVisibleModalRemove(!this.state.isVisibleModalRemoveCounter);
                                }}
                                caption={'Удалить'}
                                // captionStyle={captionStyle}
                            />
                            <CommonButton
                                style={styles.modalButton}
                                onPress={() => {
                                    this.setVisibleModalRemove(!this.state.isVisibleModalRemoveCounter);
                                }}
                                caption={'Отмена'}
                                // captionStyle={captionStyle}
                            />
                        </View>
                    </View>
                </Overlay>*/}
                {/*<Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.isVisibleModalRemoveCounter}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{marginTop: 22}}>
                        <View>
                            <Text>Hello World!</Text>

                            <TouchableHighlight
                                onPress={() => {
                                    this.setVisibleModalRemove(!this.state.isVisibleModalRemoveCounter);
                                }}>
                                <Text>Hide Modal</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>*/}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    counters: state.counters,
    tariffs: state.tariffs,
    tariffsValues: state.tariffsData,
});
const dispatchers = dispatch => ({
    editCounter: (counterId) => {
        dispatch(editCounter(counterId));
    },
    removeCounter: (counterId) => {
        dispatch(removeCounter(counterId));
    },
    removeCounterTariffs: (counterId) => {
        dispatch(removeCounterTariffs(counterId));
    },
    removeAllTariffsData: (counterId) => {
        dispatch(removeAllTariffsData(counterId));
    },
    setCounterId: (counterId) => {
        dispatch({
            type: TARIFF_DATA.SET_COUNTER_ID,
            payload: {
                counterId: counterId
            }
        });
    },
    resetEditData: () => {
        dispatch({
            type: COUNTER.RESET_COUNTER_EDIT_DATA
        });
    },
    showAlert: (message, title, okAction, ids) => {
        dispatch(showAlert({ message: message, title: title, okAction: okAction, ids: ids }));
    }
});
export default connect(mapStateToProps, dispatchers)(Home);