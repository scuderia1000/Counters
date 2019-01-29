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
// own component
import NumberText from '../../components/text/NumberText';
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
        this.state = {
            sortedData: []
        }
    }

    componentDidMount() {

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

    renderItem = ({item}) => {
        const dates = Object.keys(item);
        return dates.map(date => {
            const localDate = new Date(Number(date));
            const options = {day: 'numeric', month: 'long', year: 'numeric'};
            return (
                <View key={date} style={styles.itemContainer}>
                    <Text style={styles.date}>{localDate.toLocaleString('ru-RU', options)}</Text>
                    <View style={styles.tariffsContainer}>
                        {this.getTariffsRows(item[date].tariffs)}
                    </View>
                    <View style={styles.total}>
                        <Text>{item[date].total}</Text>
                    </View>
                </View>
            )
        });
    };

    renderDivider = () => <Divider />;

    render() {
        const { countersValues, currentCounterId } = this.props;
        const countersArray = countersValues[currentCounterId];
        return (
            <View style={styles.container}>
                <FlatList style={styles.listContainer}
                          renderItem={this.renderItem}
                          data={countersArray}
                          keyExtractor={item => Object.keys(item)[0].toString()}
                          ListHeaderComponent={header}
                          ItemSeparatorComponent={this.renderDivider}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    countersValues: state.countersValues && state.countersValues.list,
    currentCounterId: state.countersValues && state.countersValues.currentCounterId
});
const dispatchers = dispatch => ({

});

export default connect(mapStateToProps, dispatchers)(TariffData)