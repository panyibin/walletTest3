import { createStackNavigator } from 'react-navigation';
import WelcomeView from './WelcomeView';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';

export default WelcomeProcess = createStackNavigator(
    {
        Home: WelcomeView,
        NameWalletView:NameWalletView,
        SeedView:SeedView
    },
    {
        headerMode:'none'
    }
);