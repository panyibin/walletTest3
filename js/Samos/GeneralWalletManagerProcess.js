import { createStackNavigator } from 'react-navigation';
import GeneralWalletManagerView from './GeneralWalletManagerView';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';
import SeedConfirmView from './SeedConfirmView';

export default GeneralWalletManagerProcess = createStackNavigator(
    {
        Home: GeneralWalletManagerView,
        NameWalletView:NameWalletView,
        SeedView:SeedView,
        SeedConfirmView:SeedConfirmView
    },
    {
        // headerMode:'none'
        navigationOptions:{            
            headerTintColor:'black',
            headerStyle:{
                backgroundColor:'#efeedb'
            }
        }
    }
);