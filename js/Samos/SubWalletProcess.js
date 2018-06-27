import { createStackNavigator } from 'react-navigation';
import WalletDetailView from './SubWalletView';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';

export default SubWalletProcess = createStackNavigator(
    {
        Home: WalletDetailView,
        NameWalletView:NameWalletView,
        SeedView:SeedView
    },
    {
        headerMode:'none'
    }
);