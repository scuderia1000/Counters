// react
import { StyleSheet } from 'react-native';
// libraries

// own component

// styles
import colors from '../../constants/Colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    torchComponent: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: 10,
        marginRight: 10,
    },
    torch: {
        width: 80,
        borderRadius: 5
    },
    torchCaption: {
        fontSize: 14,
    }

})