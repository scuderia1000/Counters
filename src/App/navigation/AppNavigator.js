import React from 'react';
import { createStackNavigator } from 'react-navigation';

import Home from '../screens/Home/Home';

export default createStackNavigator(
    {
        Home: Home
    }, {
        initialRouteName: 'Home'
    }
);