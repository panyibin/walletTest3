import React, { Component } from 'react';
import { NativeModules } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import MeView from './MeView';
import SystemConfigurationView from './SystemConfigurationView';
import AboutUsView from './AboutUsView';

const { NavigationHelper } = NativeModules;

const Navigator = createStackNavigator(
    {
        NameWalletView: MeView,
        SystemConfigurationView:SystemConfigurationView,
        AboutUsView:AboutUsView
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

export default class MeProcess extends Component {
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