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
        padding: 5,
        backgroundColor: colors.backgroundCommon,
    },
    tariffsContainer: {
        flex: 1,
        ...common.center,
    },
    tariffRowContainer: {
        // padding: 10,
        flexDirection: 'row'
    },
    total: {
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});