import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation';
import WelcomeView from './WelcomeView';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';
import SeedConfirmView from './SeedConfirmView';
import SendCoinView from './SendCoinView';

const CustomNavigator = (props) => {
    let Navigator = createStackNavigator(
        {
            Home: SendCoinView,
        },
        {
            navigationOptions:{            
                headerTintColor:'black',
                headerStyle:{
                    backgroundColor:'#efeedb'
                }
            },
            initialRouteParams:{
                transactionDict:props.transactionDict,
                walletModel:props.walletModel
            }
        }
    );

    return <Navigator/>
};

export default class SendCoinProcess extends Component {
    render(){
        return <CustomNavigator transactionDict={this.props.transactionDict} walletModel={this.props.walletModel}/>
    }
}