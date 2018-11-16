// react
import React from 'react';
import { View, FlatList } from 'react-native';
import { Divider } from 'react-native-elements';
// own component
import CountersListItem from './CountersListItem';
// styles
import styles from './CountersListStyles';

const fakeData = [
    {
        id: 1,
        title: 'Счетчик воды'
    },
    {
        id: 2,
        title: 'Счетчик электроэнергии'
    },
    {
        id: 3,
        title: 'Счетчик воды'
    },
    {
        id: 4,
        title: 'Счетчик электроэнергии'
    },
    {
        id: 5,
        title: 'Счетчик воды'
    },
    {
        id: 6,
        title: 'Счетчик электроэнергии'
    },
    {
        id: 7,
        title: 'Счетчик воды'
    },
    {
        id: 8,
        title: 'Счетчик электроэнергии'
    },
    {
        id: 9,
        title: 'Счетчик воды'
    },
    {
        id: 10,
        title: 'Счетчик электроэнергии'
    },

];

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


    return (
        <View>
            <FlatList renderItem={renderItem}
                      data={fakeData}
                      keyExtractor={item => item.id.toString()}
                      ItemSeparatorComponent={<Divider/>}
            />
        </View>
    )
};
export default CountersList;