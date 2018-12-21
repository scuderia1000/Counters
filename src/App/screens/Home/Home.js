import React, { Component } from 'react';
import {View, FlatList} from 'react-native';
import {connect} from "react-redux";

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
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    handleAddCounterData = (id) => {
        this.props.navigation.navigate(
            'CounterDataInput',
            {
                counterId: id,
            }
        );
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

    render() {
        const { list = {} } = this.props.counters;
        const countersKeys = Object.keys(list);
        let countersArray = [];
        if (countersKeys.length) {
            countersArray = countersKeys.map(key => list[key]);
        }

        const countersList = Object.keys(list).map(key => list[key]);

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
                    <CommonButton style={{borderRadius: 5, flex: 0.48}}
                                  onPress={this.handleAddCounter}
                                  caption={'Создать счетчик'}
                                  icon={{name: 'counter', type: 'material-community', color: 'white'}}/>
                    <CommonButton style={{borderRadius: 5, flex: 0.48}}
                                  onPress={() => this.setModalVisible(!this.state.modalVisible)}
                                  caption={'Внести данные'}
                                  icon={{name: 'plus', type: 'material-community', color: 'white'}}/>
                </View>
                <CountersModal visible={this.state.modalVisible}
                               setModalVisible={this.setModalVisible}
                               countersList={countersList}
                               addCounterData={this.handleAddCounterData}
                />
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