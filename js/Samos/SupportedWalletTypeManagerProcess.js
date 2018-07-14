import React,{Component} from 'react';
import { createStackNavigator } from 'react-navigation';
import WelcomeView from './WelcomeView';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';
import SeedConfirmView from './SeedConfirmView'
import SupportedWalletTypeManagerView from './SupportedWalletTypeManagerView'

class CustomNavigator extends Component {
    
    render(){
        let Navigator = createStackNavigator(
            {
                Home: SupportedWalletTypeManagerView,
            },
            {
                navigationOptions:{            
                    headerTintColor:'black',
                    headerStyle:{
                        backgroundColor:'#efeedb'
                    }
                },
                initialRouteParams:{
                    generalWalletModel:this.props.generalWalletModel,
                }
            }
        );

        return(<Navigator />);
    }
}

 

export default class SupportedWalletTypeManagerProcess extends Component {
    render(){
        return(
            <CustomNavigator generalWalletModel={this.props.generalWalletModel}/>
        );
    }
        
}