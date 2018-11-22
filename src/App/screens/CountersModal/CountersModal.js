import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Alert, Modal, TouchableHighlight } from 'react-native';
// own component
import CountersList from '../../components/countersList/CountersList';
// styles
import styles from './CountersModalStyles';
import { colors } from '../../constants/Colors';
import common from '../../styles/CommonStyles';

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
            <View style={styles.container}>
                <CountersList/>
            </View>
            <View style={styles.closeButtonContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={common.text}>Закрыть</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
};
export default CountersModal;