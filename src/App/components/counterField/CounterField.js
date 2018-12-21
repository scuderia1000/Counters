// react
import React from 'react';
import { View } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
// own component
import RemoveButton from '../../components/buttons/RemoveButton';
// styles
import styles from './CounterFieldStyles';
import { colors } from '../../constants/Colors';

const CounterField = React.forwardRef(({ field = {}, type, index, onChange, isError = false, value,
                                           hasDelButton = false, onDelPress = () => {}, autoFocus = false }, ref) => {
    const { label = '', keyboardType = 'default', placeholder = '', style = {}, required = false, errorText = '' } = field;
    return(
        <View key={`${type}_${index}`} style={[styles.container, style]}>
            {!!label && <FormLabel>{label}</FormLabel>}
            <View style={styles.inputContainer}>
                <FormInput inputStyle={[styles.input, hasDelButton && {width: '110%'}]}
                           placeholderTextColor={colors.gray}
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
                    <RemoveButton containerStyle={{justifyContent: 'flex-start'}}
                                  onPress={() => onDelPress(index)}/>
                }
            </View>
            {isError && <FormValidationMessage labelStyle={styles.errorContainer}>{errorText}</FormValidationMessage>}
        </View>
    )
});
export default CounterField;