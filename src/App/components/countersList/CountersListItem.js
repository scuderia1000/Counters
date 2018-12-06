// react
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import {Divider} from "react-native-elements";
// own component

// styles
import styles from './styles/CountersListItemStyles';


class CountersListItem extends React.PureComponent {
    render() {
        const { onPressItem, onLongPress, id } = this.props;
        return [
            <TouchableOpacity style={styles.container}
                              key={`item_${id}`}
                              onPress={() => onPressItem(id)}
                              onLongPress={() => onLongPress(id)}>
                <Text style={styles.titleText}>{this.props.title}</Text>
            </TouchableOpacity>,
                <Divider key={`Divider_${id}`}/>
        ]
    }
}
export default CountersListItem;