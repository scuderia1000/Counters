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
});