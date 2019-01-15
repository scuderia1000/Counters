// react
import React, { Component } from 'react';
import {connect} from "react-redux";
// libraries
import {View, TouchableOpacity, Text, FlatList} from 'react-native';
// own component
import CounterField from '../../components/counterField/CounterField';
// styles
import styles from './TariffDataInputStyles';

class TariffDataInput extends Component {
    static navigationOptions = {
        title: 'Заполнение данных'
    };

    render() {
        return (
            <View style={styles.container}>

            </View>
        )
    }
}
const mapStateToProps = state => ({
    counters: state.counters,
});
const dispatchers = dispatch => ({
});
export default connect(mapStateToProps, dispatchers)(TariffDataInput);