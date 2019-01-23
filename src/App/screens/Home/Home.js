import React, { Component } from 'react';
import {View, FlatList, InteractionManager} from 'react-native';
import {connect} from "react-redux";
import ActionSheet from 'react-native-actionsheet';
// own components
import CountersModal from '../CountersModal/CountersModal';
import CommonButton from '../../components/buttons/CommonButton';
import CountersListItem from '../../components/countersList/CountersListItem';
import { editCounter, removeCounter, removeCounterTariffs } from './actions/HomeActions';
// const
import { ADD_COUNTER } from '../../constants/ProjectConst';
//style
import styles from './HomeStyles';
import {createCounter} from "../AddCounter/actions/AddCounterActions";

const iconStyle = {
    type: 'material-community',
    color: 'white',
    size: 20
};

const buttonStyle = {
    borderRadius: 5,
    flex: 0.48,
};

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
        };
        this.actionSheet = React.createRef();
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
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
                'CounterDataInput',
                {
                    counterId: id,
                }
            );
        }, 0);
    };

    handleAddCounter = () => {
        this.props.editCounter('');
        this.props.navigation.navigate('AddCounter', {title: ADD_COUNTER.TITLE.CREATE});
    };

    openCounterData = (id) => {

    };

    editCounter = (id) => {
        this.props.editCounter(id);
        this.props.navigation.navigate('AddCounter', {title: ADD_COUNTER.TITLE.EDIT});
    };

    renderItem = ({item}) => (
        <CountersListItem
            id={item.id}
            onPressItem={this.openCounterData}
            onLongPress={this.editCounter}
            title={item.counterName}
            onDelPress={() => {
                this.props.removeCounter(item.id);
                this.props.removeCounterTariffs(item.id);
            }}
        />
    );

    showActionSheet = () => {
        this.actionSheet.current.show()
    };

    actionSheetOptions = (counters) => {
        let options = [];
        if (counters.length) {
            options = counters.slice();
            options.push({counterName: 'Отмена'});
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

        const countersList = Object.keys(list).map(key => list[key]);

        const options = countersArray.length && this.actionSheetOptions(countersArray) || [];
        const isCounterSelectionComponentModal = countersArray.length > 10;

        return(
            <View style={styles.container}>
                <View style={styles.countersListContainer}>
                    <FlatList renderItem={this.renderItem}
                              data={countersArray}
                              keyExtractor={item => item.id.toString()}
                              style={{width: '100%'}}
                    />
                </View>
                <View style={styles.buttonsContainer}>
                    <CommonButton style={buttonStyle}
                                  onPress={this.handleAddCounter}
                                  caption={'Создать счетчик'}
                                  captionStyle={captionStyle}
                                  icon={{...iconStyle, name: 'counter'}}/>
                    <CommonButton style={buttonStyle}
                                  onPress={() => {
                                      if (isCounterSelectionComponentModal) {
                                          this.setModalVisible(!this.state.modalVisible)
                                      } else {
                                          this.showActionSheet();
                                      }
                                  }}
                                  caption={'Внести данные'}
                                  captionStyle={captionStyle}
                                  icon={{...iconStyle, name: 'plus'}}/>
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
                            if (index !== options.length - 1){
                                this.handleAddCounterData(options[index].id);
                            }
                        }}
                    />
                }
            </View>
        )
    }
}
const mapStateToProps = state => ({
    counters: state.counters,
});
const dispatchers = dispatch => ({
    editCounter: (counterId) => {
        dispatch(editCounter(counterId))
    },
    removeCounter: (counterId) => {
        dispatch(removeCounter(counterId))
    },
    removeCounterTariffs: (counterId) => {
        dispatch(removeCounterTariffs(counterId))
    },
});
export default connect(mapStateToProps, dispatchers)(Home);