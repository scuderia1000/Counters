// react
import React from 'react';
import { View, TouchableOpacity, Text, KeyboardAvoidingView, Button  } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
// own component

// styles
import styles from './CounterFieldStyles';
import { colors } from '../../constants/Colors';

const CounterField = React.forwardRef(({ field = {}, type, index, onChange, isError = false, value,
                                           hasDelButton = false, onDelPress = () => {} }, ref) => {
    const { label = '', keyboardType = 'default', placeholder = '', style = {}, autoFocus = false, required = false, errorText = '' } = field;
    return(
        <View key={`${type}_${index}`} style={[styles.container, style]}>
            {!!label && <FormLabel>{label}</FormLabel>}
            <View style={styles.inputContainer}>
                <FormInput inputStyle={[styles.input, hasDelButton && {width: '110%'}]}
                           containerStyle={{flex: 1}}
                           placeholder={placeholder}
                           keyboardType={keyboardType}
                           autoFocus={autoFocus}
                           textInputRef={ref}
                           underlineColorAndroid={colors.gray}
                           value={value}
                           returnKeyType={'next'}
                           onChangeText={value => {
                               onChange(type, value, index);
                           }}/>
                {hasDelButton &&
                    <TouchableOpacity style={styles.buttonContainer}
                                      onPress={() => onDelPress(index)}>
                        <Icon name={'close'}
                              size={22}
                              color={colors.gray}
                        />
                    </TouchableOpacity>
                }
            </View>
            {isError && <FormValidationMessage labelStyle={styles.errorContainer}>{errorText}</FormValidationMessage>}
        </View>
    )
});
export default CounterField;