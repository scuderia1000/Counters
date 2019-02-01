// react
import React, {Component} from 'react';
import {connect} from "react-redux";
// libraries
import {
    View,
    TouchableOpacity,
    Text,
    FlatList,
    Linking
} from 'react-native';
import {Divider} from "react-native-elements";
import ActionSheet from "react-native-actionsheet";
// own component
import NumberText from '../../components/text/NumberText';
import { TARIFF_DATA } from '../../constants/ActionConst';
import { removeTariffData } from './actions/TariffDataActions';
import { getEmailBody } from '../../constants/FunctionConst';
import { EMAIL_SUBJECT } from '../../constants/ProjectConst';
import { colors } from "../../constants/Colors";
// styles
import styles from './TariffDataStyles';

const header = (
    <View key={'headerRow'} style={styles.headerContainer}>
        <NumberText containerStyle={[styles.text, styles.tariffName]}>{'Название'}</NumberText>
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
                <NumberText containerStyle={[styles.text, styles.tariffName]}>{tariffName}</NumberText>
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
            const formattedDate = localDate.toLocaleString('ru-RU', options);
            console.log('formattedDate', formattedDate)
            return (
                <TouchableOpacity key={date}
                                  style={styles.itemContainer}
                                  onPress={() => this.showActionSheet(item[date].tariffs)}>
                    <NumberText containerStyle={styles.date}>{formattedDate}</NumberText>
                    <View style={styles.tariffsContainer}>
                        {this.getTariffsRows(item[date].tariffs)}
                    </View>
                    <NumberText containerStyle={styles.total}>{item[date].total}</NumberText>
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
                action: this.removeData
            },
            {
                title: 'Отмена',
            }
        ];

        if (list && list[currentCounterId] && list[currentCounterId].emailAddress) {
            options.splice(options.length - 1, 0, {
                title: <Text style={{fontSize: 18, color: colors.green}}>Передать показания</Text>,
                // title: 'Передать показания',
                action: this.sendEmail
            });
        }

        return options;
    };

    removeData = () => {
        const editData = this.getEditData();
        const counterId = editData.counterId;
        const dataIds = editData.dataIds;
        if (counterId && dataIds.length) {
            this.props.removeData(counterId, dataIds);
        }
    };

    getEditData = () => {
        const { currentCounterId } = this.props;
        const { activeData } = this.state;
        const editData = {
            counterId: currentCounterId,
            dataIds: []
        };

        editData.dataIds = Object.keys(activeData).map(tariffName => activeData[tariffName].dataId);
        return editData;
    };

    handleEditCounterData = () => {
        const editData = this.getEditData();

        this.props.editData(editData);
    };

    sendEmail = () => {
        const url = this.getUrl();
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    console.log("Can't handle url: " + url);
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    getUrl = () => {
        const { counters = {}, currentCounterId } = this.props;
        const { list = {} } = counters;
        const { activeData } = this.state;
        const currentCounter = list[currentCounterId];

        let url = `mailto:${currentCounter.emailAddress}?subject=${EMAIL_SUBJECT}&body=`;
        let body = getEmailBody(currentCounter.personalAccount, currentCounter.fio, currentCounter.address);

        Object.keys(activeData).forEach(tariffName => {
             body += `${tariffName}: Предыдущие: ${activeData[tariffName].previousValue}, Текущие: ${activeData[tariffName].currentValue}\n`
            // 'Холодная вода: Пред. показания: 710, Текущие: 719\n' +
            // 'Горячая вода: Пред. показания: 672, Текущие: 681'
        });
        url += body;

        return url;
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
    removeData: (counterId, dataIds) => {
        dispatch(removeTariffData(counterId, dataIds));
    }
});

export default connect(mapStateToProps, dispatchers)(TariffData)