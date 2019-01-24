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

    renderItem = ({item}) => {

    };

    render() {
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
    counters: state.counters,
    tariffs: state.tariffs && state.tariffs.list,
    tariffsValues: state.tariffsData && state.tariffsData.list,
});
const dispatchers = dispatch => ({

});

export default connect(mapStateToProps, dispatchers)(TariffData)