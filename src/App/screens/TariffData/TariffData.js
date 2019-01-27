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
// own component
import NumberText from '../../components/text/NumberText';
// styles
import styles from './TariffDataStyles';
import CommonButton from "../../components/buttons/CommonButton";

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

    headerRow = () => {

    };

    tariffRow = (tariffName, tariff) => {
        return (
            <View style={styles.tariffRowContainer}>
                <Text style={[styles.text, {flex: 5}]} numberOfLines={1}>{tariffName}</Text>
                <NumberText>{tariff.previousValue}</NumberText>
                <NumberText>{tariff.currentValue}</NumberText>
                <NumberText>{tariff.difference}</NumberText>
                <NumberText containerStyle={{flex: 2}}>{tariff.tariffAmount}</NumberText>
                <NumberText containerStyle={{flex: 2}}>{tariff.total}</NumberText>
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
            return (
                <View style={styles.itemContainer}>
                    <Text>{localDate.toLocaleString()}</Text>
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

    render() {
        const { countersValues, currentCounterId } = this.props;
        const countersArray = countersValues[currentCounterId];
        return (
            <View style={styles.container}>
                <FlatList renderItem={this.renderItem}
                          data={countersArray}
                          keyExtractor={item => Object.keys(item)[0].toString()}
                          // keyExtractor={(item, index) => Object.keys(item)[index].toString()}
                          style={{width: '100%'}}
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