import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from '../screens/Home/Home';
import AddCounter from '../screens/AddCounter/AddCounter';
import CounterDataInput from '../screens/TariffDataInput/TariffDataInput';
import { colors } from '../constants/Colors';

const MainNavigator = createStackNavigator(
    {
        Home: Home,
        AddCounter: AddCounter,
        CounterDataInput: CounterDataInput
    }, {
        initialRouteName: 'Home',
        defaultNavigationOptions: {
            headerTintColor: colors.wetAsphalt,
            headerTitleStyle: {
                color: colors.wetAsphalt,
            },
        }
    }
);

export default createAppContainer(MainNavigator);