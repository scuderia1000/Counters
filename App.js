/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    View,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './src/App/reducers/rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import AppNavigator from './src/App/navigation/AppNavigator';
import { tariffDataMiddleware } from './src/App/middlewares/tariffDataMiddleware';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import { colors } from './src/App/constants/Colors';

type Props = {};

const persistConfig = {
    key: 'root',
    storage: FilesystemStorage,
    debug: __DEV__,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    composeWithDevTools(
        applyMiddleware(
            thunk,
            tariffDataMiddleware
        )
    )
);
const persistor = persistStore(store);

const loadingIndicator = (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator
            size={Platform.OS === "ios" ? 1 : 25}
            color={colors.main}/>
    </View>
);

export default class App extends Component<Props> {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={loadingIndicator} persistor={persistor}>
                    <AppNavigator />
                </PersistGate>
            </Provider>
        );
    }
}