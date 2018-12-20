// react
import React from 'react';
// libraries
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import {colors} from "../../constants/Colors";

// own component

// styles
import styles from "./styles/RemoveButtonStyles";

export default function RemoveButton ({ onPress = () => {}, containerStyle = {} }) {
    return (
        <TouchableOpacity style={[styles.buttonContainer, containerStyle]}
                          onPress={onPress}>
            <Icon name={'close'}
                  size={22}
                  color={colors.gray}
            />
        </TouchableOpacity>
    )
}