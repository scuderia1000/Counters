// react
import React from 'react';
import { View, TouchableOpacity, Text, KeyboardAvoidingView  } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
// own component

// styles
import styles from './CounterFieldStyles';

const CounterField = ({ type, label, keyboardType, index }) => {
    return (
        <View style={styles.container} key={`${type}_${index}`}>
            <FormLabel>{label}</FormLabel>
            <FormInput inputStyle={styles.input}
                       keyboardType={keyboardType && keyboardType || 'default'}
                       onChangeText={value => {
                           this.handleOnChange(type, value);
                       }}/>
        </View>
    )
};
export default CounterField;