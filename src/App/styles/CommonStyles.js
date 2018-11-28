import { StyleSheet } from 'react-native';
import colors from '../constants/Colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'white'
    }
})