import { createStackNavigator } from 'react-navigation';
import GeneralWalletManagerView from './GeneralWalletManagerView';
import NameWalletView from './NameWalletView';
import SeedView from './SeedView';
import SeedConfirmView from './SeedConfirmView';
import GeneralWalletManagerDetailView from './GeneralWalletManagerDetailView'
import BackupSeedView from './BackupSeedView'

export default GeneralWalletManagerProcess = createStackNavigator(
    {
        Home: GeneralWalletManagerView,
        NameWalletView:NameWalletView,
        SeedView:SeedView,
        SeedConfirmView:SeedConfirmView,
        GeneralWalletManagerDetailView:GeneralWalletManagerDetailView,
        BackupSeedView,BackupSeedView
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