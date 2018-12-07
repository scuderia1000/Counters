import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Alert, Modal, TouchableHighlight } from 'react-native';
// own component
import CountersList from '../../components/countersList/CountersList';
// styles
import styles from './CountersModalStyles';
import { colors } from '../../constants/Colors';
import common from '../../styles/CommonStyles';

export default function CountersModal(props) {
    const { countersList, setModalVisible, visible, addCounterData } = props;

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={closeModal}>
            <View style={styles.container}>
                <CountersList countersList={countersList}
                              addCounterData={addCounterData}
                              setModalVisible={setModalVisible}/>
            </View>
            <View style={styles.closeButtonContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={common.buttonCaption}>Закрыть</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
};