import React, { Component } from 'react';
import { NativeModules } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import SubWalletView from './SubWalletView';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';
import SendCoinView from './SendCoinView';
import ReceiveCoinView from './ReceiveCoinView';
import ReceiveCoinDetailView from './ReceiveCoinDetailView'

const { NavigationHelper } = NativeModules;

const SubWalletNavigator = (props) => {
    let Navigator = createStackNavigator(
        {
            Home: SubWalletView,
            NameWalletView: NameWalletView,
            SeedView: SeedView,
            SendCoinView: SendCoinView,
            ReceiveCoinView: ReceiveCoinView,
            ReceiveCoinDetailView: ReceiveCoinDetailView
        },
        {
            // headerMode:'none'
            navigationOptions: {
                headerTintColor: 'black',
                headerStyle: {
                    backgroundColor: '#efeedb'
                }
            },
            initialRouteParams: {
                walletModel: props.initialWalletModel,
            }
        }
    );
    return <Navigator onNavigationStateChange={props.onNavigationStateChange} />;
};

export default class SubWalletProcess extends Component {
    render() {
        let walletModel = this.props.walletModel;
        return (
            <SubWalletNavigator initialWalletModel={walletModel}
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