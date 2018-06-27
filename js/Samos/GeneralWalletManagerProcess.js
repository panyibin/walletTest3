import { createStackNavigator } from 'react-navigation';
import GeneralWalletManagerView from './GeneralWalletManagerView';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';

export default GeneralWalletManagerProcess = createStackNavigator(
    {
        Home: GeneralWalletManagerView,
        NameWalletView:NameWalletView,
        SeedView:SeedView
    },
    {
        headerMode:'none'
    }
);