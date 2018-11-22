import { StyleSheet } from 'react-native';
import { colors } from '../../constants/Colors';
import common from '../../constants/Styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.backgroundCommon,
    },
    buttonsContainer: {
        flex: 0.2,
        justifyContent: 'space-between'
    },
    buttonAdd: {
        borderRadius: 10,
        backgroundColor: colors.main,
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