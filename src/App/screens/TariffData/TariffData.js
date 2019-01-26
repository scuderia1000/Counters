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

    tariffRow = () => {
        return (
            <View style={styles.tariffRowContainer}>


            </View>
        )
    };

    renderItem = ({item}) => {
        const dates = Object.keys(item);
        return dates.map(date => {
            return (
                <View style={styles.itemContainer}>
                    <Text>{new Date(date)}</Text>
                    <View style={styles.tariffsContainer}>

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
                          keyExtractor={item => item.id.toString()}
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