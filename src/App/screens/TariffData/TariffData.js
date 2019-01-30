// react
import React, {Component} from 'react';
import {connect} from "react-redux";
// libraries
import {
    View,
    TouchableOpacity,
    Text,
    FlatList,
    ToastAndroid,
    Platform,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import {Divider} from "react-native-elements";
import ActionSheet from "react-native-actionsheet";
// own component
import NumberText from '../../components/text/NumberText';
import { TARIFF_DATA } from '../../constants/ActionConst';
// styles
import styles from './TariffDataStyles';
import CommonButton from "../../components/buttons/CommonButton";

const header = (
    <View key={'headerRow'} style={styles.headerContainer}>
        <Text style={[styles.text, styles.tariffName]}>{'Название'}</Text>
        <NumberText containerStyle={styles.previousValue}>{'Пред.'}</NumberText>
        <NumberText containerStyle={styles.currentValue}>{'Текущее'}</NumberText>
        <NumberText containerStyle={styles.difference}>{'Расход'}</NumberText>
        <NumberText containerStyle={styles.tariffAmount}>{'Тариф'}</NumberText>
        <NumberText containerStyle={styles.totalNumber}>{'Сумма'}</NumberText>
    </View>
);

class TariffData extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', ''),
        }
    };

    constructor(props) {
        super(props);
        this.actionSheet = React.createRef();
        this.state = {
            sortedData: [],
            activeData: '',
        }
    }

    componentWillUnmount() {
        this.props.resetEditData();
    }

    tariffRow = (tariffName, tariff) => {
        return (
            <View key={tariff.dataId} style={styles.tariffRowContainer}>
                <Text style={[styles.text, styles.tariffName]}>{tariffName}</Text>
                <NumberText containerStyle={styles.previousValue}>{tariff.previousValue}</NumberText>
                <NumberText containerStyle={styles.currentValue}>{tariff.currentValue}</NumberText>
                <NumberText containerStyle={styles.difference}>{tariff.difference}</NumberText>
                <NumberText containerStyle={styles.tariffAmount}>{tariff.tariffAmount}</NumberText>
                <NumberText containerStyle={styles.totalNumber}>{tariff.total}</NumberText>
            </View>
        )
    };

    getTariffsRows = (tariffs) => {
        return Object.keys(tariffs).map(tariffName => this.tariffRow(tariffName, tariffs[tariffName]));
    };

    renderItem = ({item, index}) => {
        const dates = Object.keys(item);
        return dates.map(date => {
            const localDate = new Date(Number(date));
            const options = {day: 'numeric', month: 'long', year: 'numeric'};
            return (
                <TouchableOpacity key={date}
                                  style={styles.itemContainer}
                                  onPress={() => this.showActionSheet(item[date].tariffs)}>
                    <Text style={styles.date}>{localDate.toLocaleString('ru-RU', options)}</Text>
                    <View style={styles.tariffsContainer}>
                        {this.getTariffsRows(item[date].tariffs)}
                    </View>
                    <View style={styles.total}>
                        <Text>{item[date].total}</Text>
                    </View>
                </TouchableOpacity>
            )
        });
    };

    renderDivider = () => <Divider />;

    showActionSheet = (tariffs) => {
        this.actionSheet.current.show();
        this.setState({
            activeData: tariffs
        })
    };

    actionSheetOptions = () => {
        const { counters = {}, currentCounterId } = this.props;
        const { list } = counters;
        let options = [
            {
                title: 'Редактировать',
                action: () => {
                    this.handleEditCounterData();
                    this.props.navigation.navigate('TariffDataInput', {counterId: currentCounterId});
                }
            },
            {
                title: 'Удалить',
                action: () => {

                }
            },
            {
                title: 'Отмена',
            }
        ];

        if (list && list[currentCounterId] && list[currentCounterId].emailAddress) {
            options.unshift({
                title: 'Передать показания',
                action: () => {

                }
            })
        }

        return options;
    };

    handleEditCounterData = () => {
        const { currentCounterId } = this.props;
        const { activeData } = this.state;
        const editData = {
            counterId: currentCounterId,
            dataIds: []
        };

        editData.dataIds = Object.keys(activeData).map(tariffName => activeData[tariffName].dataId);

        this.props.editData(editData);
    };

    render() {
        const { countersValues, currentCounterId } = this.props;
        const countersArray = countersValues[currentCounterId];

        const options = this.actionSheetOptions();

        return (
            <View style={styles.container}>
                <FlatList style={styles.listContainer}
                          renderItem={this.renderItem}
                          data={countersArray}
                          keyExtractor={item => Object.keys(item)[0].toString()}
                          ListHeaderComponent={header}
                          ItemSeparatorComponent={this.renderDivider}
                />
                <ActionSheet
                    ref={this.actionSheet}
                    // title={'Which one do you like ?'}
                    options={options.map(item => item.title)}
                    cancelButtonIndex={options.length - 1}
                    onPress={(index) => {
                        if (index !== options.length - 1) {
                            options[index].action();
                        }
                    }}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    countersValues: state.countersValues && state.countersValues.list,
    currentCounterId: state.countersValues && state.countersValues.currentCounterId,
    counters: state.counters,
});
const dispatchers = dispatch => ({
    editData: (data) => {
        dispatch({
            type: TARIFF_DATA.EDIT,
            payload: data
        })
    },
    resetEditData: () => {
        dispatch({type: TARIFF_DATA.RESET_EDIT})
    },
});

export default connect(mapStateToProps, dispatchers)(TariffData)