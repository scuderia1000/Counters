// react
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
// own component

// styles
import styles from './styles/CountersListItemStyles';

class CountersListItem extends React.PureComponent {
    render() {
        const { onPressItem, onLongPress, id } = this.props;
        return (
            <TouchableOpacity style={styles.container}
                              onPress={() => onPressItem(id)}
                              onLongPress={() => onLongPress(id)}>
                <Text style={styles.titleText}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}
export default CountersListItem;