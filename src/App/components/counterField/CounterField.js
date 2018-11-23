// react
import React from 'react';
import { View, TouchableOpacity, Text, KeyboardAvoidingView  } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
// own component

// styles
import styles from './CounterFieldStyles';

const CounterField = React.forwardRef(({ type, label, keyboardType, index, placeholder, style, autoFocus }, ref) => (
        <View key={`${type}_${index}`} style={[styles.container, style]}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormInput inputStyle={styles.input}
                       placeholder={placeholder}
                       keyboardType={keyboardType && keyboardType || 'default'}
                       autoFocus={autoFocus}
                       ref={ref}
                       onChangeText={value => {
                           this.handleOnChange(type, value);
                       }}/>
        </View>
));
export default CounterField;