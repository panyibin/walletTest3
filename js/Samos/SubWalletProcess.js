import React, { Component } from 'react'
import { createStackNavigator } from 'react-navigation';
import WalletDetailView from './SubWalletView';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';
import SendCoinView from './SendCoinView';
import ReceiveCoinView from './ReceiveCoinView';

const SubWalletNavigator = (props) => {
    let Navigator = createStackNavigator(
        {
            Home: WalletDetailView,
            NameWalletView: NameWalletView,
            SeedView: SeedView,
            SendCoinView:SendCoinView,
            ReceiveCoinView:ReceiveCoinView
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
    return <Navigator />;
};

export default class SubWalletProcess extends Component {
    render() {
        let walletModel = this.props.walletModel;
        return (
            <SubWalletNavigator initialWalletModel={walletModel} />            
        );
    }
}