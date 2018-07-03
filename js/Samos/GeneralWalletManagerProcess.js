import React, { Component } from 'react';
import { NativeModules } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import GeneralWalletManagerView from './GeneralWalletManagerView';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';
import SeedConfirmView from './SeedConfirmView';
import GeneralWalletManagerDetailView from './GeneralWalletManagerDetailView'
import BackupSeedView from './BackupSeedView'

const { NavigationHelper } = NativeModules;

const Navigator = GeneralWalletManagerProcess = createStackNavigator(
    {
        Home: GeneralWalletManagerView,
        NameWalletView: NameWalletView,
        SeedView: SeedView,
        SeedConfirmView: SeedConfirmView,
        GeneralWalletManagerDetailView: GeneralWalletManagerDetailView,
        BackupSeedView, BackupSeedView
    },
    {
        // headerMode:'none'
        navigationOptions: {
            headerTintColor: 'black',
            headerStyle: {
                backgroundColor: '#efeedb'
            }
        }
    }
);

export default class GeneralWalletManagerProcess extends Component {
    render() {
        return (
            <Navigator
                onNavigationStateChange={
                    (prevState, newState) => {
                        if (newState.routes.length >= 2) {
                            NavigationHelper.setSwipeBackGestureEnabled(false);
                        } else {
                            NavigationHelper.setSwipeBackGestureEnabled(true);
                        }
                    }
                }
            />
        );
    }
}