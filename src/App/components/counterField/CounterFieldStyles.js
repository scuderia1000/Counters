// react
import { StyleSheet } from 'react-native';
// own component

// styles
import { colors } from '../../constants/Colors';
import common from '../../constants/Styles';

export default StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundCommon,
        height: 55,
        minHeight: 55,
        position: 'relative',
        paddingLeft: 5,
        paddingRight: 5,
    },
    input: {
        flex: 1,
        // height: 35,
        // minHeight: 35,
        paddingVertical: 0,
        color: colors.wetAsphalt,
        fontSize: 16,
        height: 46,

    },
    errorText: {
        position: 'absolute',
        bottom: 0,
        marginTop: 0,
        color: 'red',
        paddingLeft: 8,
        paddingRight: 8,
    },
    divider: {
        position: 'absolute',
        bottom: 0,
        zIndex: 10,
        backgroundColor: 'red',
        height: 10,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})