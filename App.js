/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { createStore, applyMiddleware } from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './src/App/reducers/rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

import {Platform, Text, View} from 'react-native';

import AppNavigator from './src/App/navigation/AppNavigator';
import styles from './src/App/styles/CommonStyles'

type Props = {};

const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);

export default class App extends Component<Props> {
    render() {
        return (
            <Provider store={store}>
                <AppNavigator />
            {/*<View style={styles.container}>
                <AppNavigator />
            </View>*/}
            </Provider>
        );
    }
}