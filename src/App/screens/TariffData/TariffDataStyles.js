// react
import { StyleSheet } from 'react-native';
// own component

// styles
import { colors } from '../../constants/Colors';
import common from '../../constants/Styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'space-between',
        backgroundColor: colors.gray,
    },
    itemContainer: {
        flex: 1,
        ...common.center,
    },
    tariffsContainer: {
        flex: 1,
        ...common.center,
    },
    tariffRowContainer: {
        flexDirection: 'row'
    },
});