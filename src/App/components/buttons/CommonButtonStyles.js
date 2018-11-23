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
        flexDirection: 'row',
        padding: 10,
        height: 50,
    },
    buttonCaption: {
        color: 'white',
        fontSize: 18,
    }
});