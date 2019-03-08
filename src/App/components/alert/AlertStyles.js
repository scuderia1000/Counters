// react
import { StyleSheet } from 'react-native';

// libraries

// own component

// styles
import { colors } from '../../constants/Colors';

export default StyleSheet.create({
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalButton: {
        borderRadius: 5,
        flex: 0.5,
        // width: 60,
    },
    modalButtonOk: {
        backgroundColor: 'white',
        // borderWidth: 1,
        // borderRadius: 5,
        // borderColor: colors.main,
        marginRight: 10,
        // flex: 0.5,
    },
    button: {
        borderRadius: 5,
        width: 100,
        height: 36,
    },
    okCaption: {
        color: colors.gray,
        fontWeight: '100',
        fontSize: 16,
    },
    cancelCaption: {
        fontSize: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    message: {
        fontSize: 14,
        marginBottom: 10,
    }
});