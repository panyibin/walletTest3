import { AppRegistry } from 'react-native';

import WalletGenerator from './js/WalletGenerator';
import PinView from './js/pin';
import Wallet from './js/Wallet';
import WalletDetail from './js/WalletDetail';
import PayView from './js/pay';
import AddressQRCodeView from './js/AddressQRCode';
import WalletSeedView from './js/WalletSeedView';

import WelcomeProcess from './js/Samos/WelcomeProcess';
import SideMenuView from './js/Samos/SideMenuView';
import CreateWalletProcess from './js/Samos/CreateWalletProcess';

AppRegistry.registerComponent('WalletGenerator', () => WalletGenerator);
AppRegistry.registerComponent('PinView', () => PinView);
AppRegistry.registerComponent('Wallet', () => Wallet);
AppRegistry.registerComponent('WalletDetail', () => WalletDetail);
AppRegistry.registerComponent('PayView', () => PayView);
AppRegistry.registerComponent('AddressQRCodeView', () => AddressQRCodeView);
AppRegistry.registerComponent('WalletSeedView', () => WalletSeedView);

AppRegistry.registerComponent('WelcomeProcess', () => WelcomeProcess);
AppRegistry.registerComponent('SideMenuView', () => SideMenuView);
AppRegistry.registerComponent('CreateWalletProcess', () => CreateWalletProcess);
