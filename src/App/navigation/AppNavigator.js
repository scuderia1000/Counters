import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from '../screens/Home/Home';
import AddCounter from '../screens/AddCounter/AddCounter';

const MainNavigator = createStackNavigator(
    {
        Home: Home,
        AddCounter: AddCounter
    }, {
        initialRouteName: 'Home'
    }
);

export default createAppContainer(MainNavigator);