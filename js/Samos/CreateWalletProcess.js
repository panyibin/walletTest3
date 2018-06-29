import { createStackNavigator } from 'react-navigation';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';

export default CreateWalletProcess = createStackNavigator(
    {
        NameWalletView:NameWalletView,
        SeedView:SeedView
    },
    {
        // headerMode:'none'
        navigationOptions:{
            headerBackTitle:null,
            headerTintColor:'black'
        }
    }
);