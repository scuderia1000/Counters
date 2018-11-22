// react
import { StyleSheet } from 'react-native';
import colors from '../../../constants/Colors';
import common from '../../../constants/Styles';

export default StyleSheet.create({
    container: {
        height: 46,
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15,
    },
    titleText: {
        ...common.text
    },
});