// react
import React, { Component } from 'react';
// libraries
import { View, Text } from 'react-native';
import { Overlay } from 'react-native-elements';
import { getStatusBarHeight } from 'react-native-status-bar-height';
// own component
import CommonButton from '../../components/buttons/CommonButton';
// styles
import styles from './AlertStyles';

export default function Alert({message, title, okAction, cancelPress, ids = [], okCaption = 'Удалить'}) {

    const handleOkPress = () => {
        if (ids.length) {
            ids.forEach(id => {
                okAction(id);
            });
        } else {
            okAction();
        }
        cancelPress();
    };

    return (
        <Overlay
            isVisible={true}
            width="65%"
            height="auto"
            overlayStyle={{marginBottom: getStatusBarHeight()}}
        >
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                <View style={styles.modalButtonContainer}>
                    <CommonButton
                        style={[styles.button, styles.modalButtonOk]}
                        captionStyle={styles.okCaption}
                        onPress={handleOkPress}
                        caption={okCaption}
                    />
                    <CommonButton
                        style={[styles.button]}
                        captionStyle={styles.cancelCaption}
                        onPress={cancelPress}
                        caption={'Отмена'}
                    />
                </View>
            </View>
        </Overlay>
    );
}