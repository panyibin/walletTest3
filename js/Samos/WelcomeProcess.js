import { createStackNavigator } from 'react-navigation';
import WelcomeView from './WelcomeView';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';
import SeedConfirmView from './SeedConfirmView'

export default WelcomeProcess = createStackNavigator(
    {
        Home: WelcomeView,
        NameWalletView:NameWalletView,
        SeedView:SeedView,
        SeedConfirmView:SeedConfirmView
    },
    {
        navigationOptions:{            
            headerTintColor:'black',
            headerStyle:{
                backgroundColor:'#efeedb'
            }
        }
    }
);