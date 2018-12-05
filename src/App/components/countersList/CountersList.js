// react
import React from 'react';
import { View, FlatList } from 'react-native';
import { Divider } from 'react-native-elements';
// own component
import CountersListItem from './CountersListItem';
import fakeData from '../../constants/FakeData';
// styles
import styles from './styles/CountersListStyles';

const CountersList = (props) => {
    const onPressItem = (id) => {

    };

    const renderItem = ({item}) => (
        <CountersListItem
            id={item.id}
            onPressItem={onPressItem}
            title={item.title}
        />
    );

    const keyExtractor = (item, index) => item.id;

    const renderDivider = () => {
        return (
            <Divider/>
        )
    };

    return (
        <View>
            <FlatList renderItem={renderItem}
                      data={fakeData}
                      keyExtractor={item => item.id.toString()}
                      ItemSeparatorComponent={renderDivider}
            />
        </View>
    )
};
export default CountersList;