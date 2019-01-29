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
        backgroundColor: colors.backgroundCommon,
    },
    itemContainer: {
        flex: 1,
        ...common.center,
        padding: 5,
        // backgroundColor: colors.backgroundCommon,
    },
    tariffsContainer: {
        flex: 1,
        ...common.center,
    },
    tariffRowContainer: {
        // padding: 10,
        flexDirection: 'row',
    },
    total: {
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    tariffName: {
        flex: 1.9,
    },
    previousValue: {
        flex: 1.9,
    },
    currentValue: {
        flex: 1.9,
    },
    difference: {
        flex: 1.3
    },
    tariffAmount: {
        flex: 1.4,
    },
    totalNumber: {
        flex: 1.7,
    },
    listContainer: {
        width: '100%',
    },
    headerContainer: {
        flexDirection: 'row',
        ...common.center,
        padding: 5,
        // paddingLeft: 10,
        // paddingRight: 10,
    },
    date: {
        marginBottom: 5,
    }
});