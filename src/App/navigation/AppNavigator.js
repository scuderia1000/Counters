import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from '../screens/Home/Home';
// import AddCounter from '../screens/AddCounter/AddCounter';
import AddCounterNew from '../screens/AddCounter/AddCounterNew';
import TariffDataInput from '../screens/TariffDataInput/TariffDataInput';
import TariffData from '../screens/TariffData/TariffData';
import { colors } from '../constants/Colors';

const MainNavigator = createStackNavigator(
    {
        Home: Home,
        AddCounter: AddCounterNew,
        TariffDataInput: TariffDataInput,
        TariffData: TariffData,
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