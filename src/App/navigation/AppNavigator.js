import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from '../screens/Home/Home';
import AddCounter from '../screens/AddCounter/AddCounter';
import CounterDataInput from '../screens/CounterDataInput/CounterDataInput';

const MainNavigator = createStackNavigator(
    {
        Home: Home,
        AddCounter: AddCounter,
        CounterDataInput: CounterDataInput
    }, {
        initialRouteName: 'Home'
    }
);

export default createAppContainer(MainNavigator);