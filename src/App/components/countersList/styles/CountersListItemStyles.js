// react
import { StyleSheet } from 'react-native';
import colors from '../../../constants/Colors';
import common from '../../../constants/Styles';

export default StyleSheet.create({
    container: {
        height: 46,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 15,
        flexDirection: 'row',
    },
    titleText: {
        ...common.text
    },
});