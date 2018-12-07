// react
import React, { Component } from 'react';
// libraries
import {View, TouchableOpacity, Text, FlatList} from 'react-native';
// own component

// styles
import styles from './CounterDataInputStyles';

class CounterDataInput extends Component {
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
export default CounterDataInput;