import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';

// own components
import CountersModal from '../CountersModal/CountersModal';

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
                    <TouchableOpacity style={styles.buttonAdd}
                                      onPress={this.handleAddCounter}>
                        <Icon name='counter'
                              type='material-community'
                              color='white' />
                        <Text style={styles.buttonAddCaption}>Добавить счетчик</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonAdd}
                                      onPress={() => {
                                          this.setModalVisible(!this.state.modalVisible);
                                      }}>
                        <Icon name='plus'
                              type='material-community'
                              color='white' />
                        <Text style={styles.buttonAddCaption}>Внести данные</Text>
                    </TouchableOpacity>
                </View>
                <CountersModal visible={this.state.modalVisible}
                               setModalVisible={this.setModalVisible} />
            </View>
        )
    }
}

export default Home;