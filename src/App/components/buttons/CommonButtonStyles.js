// react
import { StyleSheet } from 'react-native';
// libraries

// own component

// styles
import { colors } from '../../constants/Colors';
import common from '../../constants/Styles';

export default StyleSheet.create({
    button: {
        // borderRadius: 10,
        backgroundColor: colors.main,
        ...common.center,
        padding: 10,
        height: 48,
    },
    buttonCaption: {
        color: 'white',
        fontSize: 18,
    },
    captionContainer: {
        flexDirection: 'row',
        ...common.center,
        width: '100%',
    }
});