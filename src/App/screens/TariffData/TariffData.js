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
            <View key={tariff.id} style={styles.tariffRowContainer}>
                <NumberText containerStyle={[styles.text, styles.tariffName]}>{tariffName}</NumberText>
                <NumberText containerStyle={styles.previousValue}>{tariff.prevValue}</NumberText>
                <NumberText containerStyle={styles.currentValue}>{tariff.currentValue}</NumberText>
                <NumberText containerStyle={styles.difference}>{tariff.difference}</NumberText>
                <NumberText containerStyle={styles.tariffAmount}>{tariff.amount}</NumberText>
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
        });
    };

    actionSheetOptions = () => {
        const { counters = {}, navigation } = this.props;
        const counterId = navigation.getParam('counterId', '');
        const { list } = counters;
        let options = [
            {
                title: 'Редактировать',
                action: () => {
                    this.handleEditCounterData();
                    navigation.navigate('TariffDataInput', {counterId: counterId});
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

        if (list && list[counterId] && list[counterId].emailAddress) {
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
        const { navigation } = this.props;
        const { activeData } = this.state;
        const counterId = navigation.getParam('counterId', '');
        const editData = {
            counterId: counterId,
            dataIds: []
        };

        editData.dataIds = Object.values(activeData).map(data => data.id);
        return editData;
    };

    handleEditCounterData = () => {
        const { navigation } = this.props;
        const { activeData } = this.state;
        const counterId = navigation.getParam('counterId', '');

        const editDataIds = Object.values(activeData).map(data => data.id);
        // const editDataIds = Object.keys(activeData).map(name => activeData[name].id);
        // const editData = this.getEditData();

        this.props.editData(editDataIds);
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
        const { countersValues = {} } = this.props;
        const options = this.actionSheetOptions();
        return (
            <View style={styles.container}>
                <FlatList style={styles.listContainer}
                          renderItem={this.renderItem}
                          data={countersValues}
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

const getCounterTariffData = (state, ownProps) => {
    const { tariffsData = {}, tariffs = {}, counters = {} } = state;
    const { list = {} } = counters;

    const { list: tariffsList = {} } = tariffs;
    const { navigation } = ownProps;
    const counterId = navigation.getParam('counterId', '');

    const dataIds = list[counterId].dataIds;
    let countersValues = {/*
        {
            date1: {
                tariffs: {
                    name1: {data1}
                    name2: {data2}
                },
                total:
            },
        }
    */};

    Object.values(tariffsData.list)
        .filter(data => dataIds.includes(data.id))
        // .filter(data => tariffsIds.includes(data.tariffId))
        .sort((dataA, dataB) => dataB.createTime - dataA.createTime)
        .map(data => {
            if (data.prevValue !== null) {
                if (countersValues[data.createTime]) {
                    countersValues[data.createTime] = {
                        tariffs: {
                            ...countersValues[data.createTime].tariffs,
                            [tariffsList[data.tariffId].name]: data
                        },
                        total: countersValues[data.createTime].total + data.total,
                    };
                } else {
                    countersValues[data.createTime] = {
                        tariffs: {
                            [tariffsList[data.tariffId].name]: data
                        },
                        total: data.total
                    };
                }
            }
        });

    return Object.keys(countersValues).map(date => {
        return {
            [date]: countersValues[date]
        }
    });
    // return Object.values(tariffsData.list)
    //     .filter(data => tariffsIds.includes(data.tariffId))
    //     .sort((dataA, dataB) => dataB.createTime - dataA.createTime)
    //     .map(data => data);
};

const mapStateToProps = (state, ownProps) => ({
    // countersValues: state.countersValues && state.countersValues.list,
    // currentCounterId: state.countersValues && state.countersValues.currentCounterId,
    counters: state.counters,
    countersValues: getCounterTariffData(state, ownProps),
});
const dispatchers = dispatch => ({
    editData: (dataIds) => {
        dispatch({
            type: TARIFF_DATA.EDIT,
            payload: dataIds
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