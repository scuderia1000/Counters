// react
import React from 'react';
import { View, FlatList } from 'react-native';
import { Divider } from 'react-native-elements';
// own component
import CountersListItem from './CountersListItem';
import fakeData from '../../constants/FakeData';
// styles
import styles from './styles/CountersListStyles';

export default function CountersList (props) {
    const { countersList, addCounterData, closeModal, setModalVisible } = props;



    const onPressItem = (id) => {
        setModalVisible(false);
        addCounterData(id);
    };

    const renderItem = ({item}) => (
        <CountersListItem
            id={item.id}
            onPressItem={() => onPressItem(item.id)}
            title={item.counterName}
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
                      data={countersList}
                      keyExtractor={item => item.id.toString()}
                      ItemSeparatorComponent={renderDivider}
            />
        </View>
    )
};