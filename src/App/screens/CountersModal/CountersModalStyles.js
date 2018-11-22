// react
import { StyleSheet } from 'react-native';
// own component

// styles
import { colors } from '../../constants/Colors';
import common from '../../constants/Styles';

export default StyleSheet.create({
    container: {
        flex: 0.93,
    },
    closeButtonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    closeButton: {
        backgroundColor: colors.main,
        height: 48,
        ...common.center
    }
})