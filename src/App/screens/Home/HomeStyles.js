import { StyleSheet } from 'react-native';
import { colors } from '../../constants/Colors';
import common from '../../constants/Styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.backgroundCommon,
    },
    buttonsContainer: {
        padding: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
    },
    countersListContainer: {
        alignItems: 'flex-start',
        width: '100%',
        flex: 0.9,
    },
    buttonStyle: {
        borderRadius: 5,
        flex: 0.48,
    },
    modalButtonContainer: {
        flexDirection: 'row'
    },
    modalButton: {
        borderRadius: 5,
        flex: 0.5,
        // width: 60,
    }
});