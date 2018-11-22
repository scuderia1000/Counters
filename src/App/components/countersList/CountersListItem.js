// react
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
// own component

// styles
import styles from './styles/CountersListItemStyles';

class CountersListItem extends React.PureComponent {
    render() {
        return (
            <TouchableOpacity style={styles.container}>
                <Text style={styles.titleText}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}
export default CountersListItem;