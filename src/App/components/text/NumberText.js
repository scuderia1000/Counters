// react
import React, {Component} from 'react';
// libraries
import {
    View,
    Text,
} from 'react-native';
// styles
import styles from './NumberTextStyles';

export default class NumberText extends Component {
    render() {
        return (
            <View style={[styles.numberContainer, this.props.containerStyle]}>
                <Text style={[styles.text, this.props.textStyle]}>{this.props.children}</Text>
            </View>
        )
    }
}