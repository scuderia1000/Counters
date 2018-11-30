// react
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
// libraries
import { Button, Icon } from 'react-native-elements';
// own component

// styles
import styles from './CommonButtonStyles';
import common from '../../constants/Styles';

const CommonButton = ({ caption = '', style = {}, captionStyle = {}, onPress = () => {}, icon = {}, disabled = false }) => {
    return (
        <TouchableOpacity style={[styles.button, disabled && common.disabled, style]}
                          onPress={onPress}>
            {!!Object.keys(icon).length &&
                <Icon name={icon.name}
                      type={icon.type}
                      color={icon.color} />
            }
            <Text style={[styles.buttonCaption, captionStyle]}>{caption}</Text>
        </TouchableOpacity>
    )
};
export default CommonButton;