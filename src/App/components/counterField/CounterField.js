// react
import React from 'react';
import { View, TouchableOpacity, Text, KeyboardAvoidingView, Button  } from 'react-native';
import {FormLabel, FormInput, FormValidationMessage, Divider} from 'react-native-elements';
// own component

// styles
import styles from './CounterFieldStyles';
import { colors } from '../../constants/Colors';

const CounterField = React.forwardRef(({ field = {}, type, index, onChange, errors = [], value }, ref) => {
    const { label = '', keyboardType = 'default', placeholder = '', style = {}, autoFocus = false, required = false, errorText = '' } = field;
    return(
        <View key={`${type}_${index}`} style={[styles.container, style]}>
            {!!label && <FormLabel>{label}</FormLabel>}
            <FormInput inputStyle={styles.input}
                       // containerStyle={{paddingVertical: 0}}
                       placeholder={placeholder}
                       keyboardType={keyboardType}
                       autoFocus={autoFocus}
                       ref={ref}
                       underlineColorAndroid={colors.gray}
                       value={value}
                       onChangeText={value => {
                           onChange(type, value);
                       }}/>
            {!!errors.length && errors.includes(type) && <FormValidationMessage labelStyle={styles.errorContainer}>{errorText}</FormValidationMessage>}
        </View>
    )
});
export default CounterField;