import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';

// own components
import CountersModal from '../CountersModal/CountersModal';
import CommonButton from '../../components/buttons/CommonButton';

//style
import styles from './HomeStyles';

class Home extends Component {
    static navigationOptions = {
        title: 'Показания счетчиков'
    };

    constructor(props) {
        super(props);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.state = {
            modalVisible: false,
        };
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    handleAddCounterData = () => {

    };

    handleAddCounter = () => {
        this.props.navigation.navigate('AddCounter');
    };

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.buttonsContainer}>
                    <CommonButton style={{borderRadius: 10}}
                                  onPress={this.handleAddCounter}
                                  caption={'Добавить счетчик'}
                                  icon={{name: 'counter', type: 'material-community', color: 'white'}}/>
                    <CommonButton style={{borderRadius: 10}}
                                  onPress={() => this.setModalVisible(!this.state.modalVisible)}
                                  caption={'Внести данные'}
                                  icon={{name: 'plus', type: 'material-community', color: 'white'}}/>
                </View>
                <CountersModal visible={this.state.modalVisible}
                               setModalVisible={this.setModalVisible} />
            </View>
        )
    }
}

export default Home;