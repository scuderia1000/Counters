import { StyleSheet } from 'react-native';
import colors from '../../constants/Colors';
import common from '../../constants/Styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.backgroundColor,
    },
    buttonAdd: {
        borderRadius: 10,
        backgroundColor: '#5E8EFF',
        ...common.center,
        flexDirection: 'row',
        padding: 10,
        height: 50,
    },
    buttonAddCaption: {
        color: 'white',
        fontSize: 18,
    }
});