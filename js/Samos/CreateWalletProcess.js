import React, { Component } from 'react';
import { NativeModules } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';
import SeedConfirmView from './SeedConfirmView';

const { NavigationHelper } = NativeModules;

const Navigator = createStackNavigator(
    {
        NameWalletView: NameWalletView,
        SeedView: SeedView,
        SeedConfirmView: SeedConfirmView
    },
    {
        // headerMode:'none'
        navigationOptions: {
            headerBackTitle: null,
            headerTintColor: 'black',
            headerStyle: {
                backgroundColor: '#efeedb'
            }
        }
    }
);

export default class CreateWalletProcess extends Component {
    render() {
        return (
            <Navigator onNavigationStateChange={
                (prevState, newState) => {
                    if(newState.routes.length >= 2) {
                        NavigationHelper.setSwipeBackGestureEnabled(false);
                    } else {
                        NavigationHelper.setSwipeBackGestureEnabled(true);
                    }
                }
            } />
        );
    }
}