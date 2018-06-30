import { createStackNavigator } from 'react-navigation';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';
import SeedConfirmView from './SeedConfirmView';

export default CreateWalletProcess = createStackNavigator(
    {
        NameWalletView:NameWalletView,
        SeedView:SeedView,
        SeedConfirmView:SeedConfirmView
    },
    {
        // headerMode:'none'
        navigationOptions:{
            headerBackTitle:null,
            headerTintColor:'black',
            headerStyle:{
                backgroundColor:'#efeedb'
            }
        }
    }
);