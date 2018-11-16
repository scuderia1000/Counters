import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Alert, Modal, TouchableHighlight } from 'react-native';
// own component
import CountersList from '../../components/countersList/CountersList';

const CountersModal = (props) => {

    const closeModal = () => {
        props.setModalVisible(false);
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.visible}
            onRequestClose={closeModal}>
            <View style={{marginTop: 22}}>
                <View>
                    <Text>Hello World!</Text>
                    <CountersList/>
                    <TouchableHighlight
                        onPress={closeModal}>
                        <Text>Hide Modal</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    )
};
export default CountersModal;