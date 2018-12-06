import React, { Component } from 'react';
import {View, TouchableOpacity, Text, FlatList} from 'react-native';
import {connect} from "react-redux";
import {Button, Divider, Icon} from 'react-native-elements';

// own components
import CountersModal from '../CountersModal/CountersModal';
import CommonButton from '../../components/buttons/CommonButton';
import fakeData from '../../constants/FakeData';
import CountersListItem from '../../components/countersList/CountersListItem';
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
        this.state = {
            modalVisible: false,
        };
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    handleAddCounterData = () => {

    };

    handleAddCounter = (id) => {
        this.props.navigation.navigate(
            'AddCounter',
            {
                counterId: id,
            }
        );
    };

    openCounterData = (id) => {

    };

    editCounter = (id) => {
        this.handleAddCounter(id);
    };

    renderItem = ({item}) => (
        <CountersListItem
            id={item.id}
            onPressItem={this.openCounterData}
            onLongPress={this.editCounter}
            title={item.counterName}
        />
    );

    renderDivider = () => {
        return (
            <Divider/>
        )
    };

    render() {
        const { list = {} } = this.props.counters;
        const countersKeys = Object.keys(list);
        let countersArray = [];
        if (countersKeys.length) {
            countersArray = countersKeys.map(key => list[key]);
        }

        return(
            <View style={styles.container}>
                <View style={styles.countersListContainer}>
                    <FlatList renderItem={this.renderItem}
                              data={countersArray}
                              // data={fakeData}
                              keyExtractor={item => item.id.toString()}
                              // ItemSeparatorComponent={this.renderDivider}
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
                               setModalVisible={this.setModalVisible} />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    counters: state.counters,
});
const dispatchers = dispatch => ({
});
export default connect(mapStateToProps, dispatchers)(Home);