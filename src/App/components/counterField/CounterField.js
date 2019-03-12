// react
import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
// own component
import RemoveButton from '../../components/buttons/RemoveButton';
// styles
import styles from './CounterFieldStyles';
import { colors } from '../../constants/Colors';

const CounterField = React.forwardRef(({ field = {}, type, index, onChange, isError = false, value,
                                           hasDelButton = false, onDelPress = () => {}, autoFocus = false,
                                           onFocus = () => {}, onSubmitEditing = () => {} }, ref) => {
    const { label = '', keyboardType = 'default', placeholder = '', style = {}, errorText = '', errorStyle,
        returnKeyType = 'next' } = field;
    return(
        <View key={`${type}_${index}`} style={[styles.container, style]}>
            {!!label && <Text>{label}</Text>}
            <View style={styles.inputContainer}>
                <TextInput style={[styles.input, hasDelButton && {width: '110%'}]}
                           placeholderTextColor={colors.gray}
                           // containerStyle={{flex: 1}}
                           placeholder={placeholder}
                           keyboardType={keyboardType}
                           autoFocus={autoFocus}
                           ref={ref}
                           // textInputRef={ref}
                           underlineColorAndroid={colors.gray}
                           value={value}
                           returnKeyType={returnKeyType}
                           blurOnSubmit={false}
                           onSubmitEditing={() => {
                               onSubmitEditing(index + 1);
                           }}
                           onChangeText={value => {
                               onChange(type, value, index);
                           }}
                           /*onFocus={() => {
                               onFocus(index, autoFocus);
                           }}*/
                />
                {hasDelButton &&
                    <RemoveButton containerStyle={{justifyContent: 'flex-start'}}
                                  onPress={() => onDelPress(index, type)}/>
                }
            </View>
            {isError && <Text style={[styles.errorText, errorStyle]}>{errorText}</Text>}
        </View>
    )
});
export default CounterField;