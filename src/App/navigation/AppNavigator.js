import React from 'react';
import { createStackNavigator } from 'react-navigation';

import Home from '../screens/Home/Home';
import AddCounter from '../screens/AddCounter/AddCounter';

export default createStackNavigator(
    {
        Home: Home,
        AddCounter: AddCounter
    }, {
        initialRouteName: 'Home'
    }
);