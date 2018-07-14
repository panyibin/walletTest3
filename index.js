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
import GeneralWalletView from './js/Samos/GeneralWalletView';
import MeView from './js/Samos/MeView';
import GeneralWalletManagerProcess from './js/Samos/GeneralWalletManagerProcess';
import SubWalletProcess from './js/Samos/SubWalletProcess';
import SendCoinProcess from './js/Samos/SendCoinProcess';
import SupportedWalletTypeManagerProcess from './js/Samos/SupportedWalletTypeManagerProcess'

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
AppRegistry.registerComponent('GeneralWalletView', () => GeneralWalletView);
AppRegistry.registerComponent('MeView', () => MeView);
AppRegistry.registerComponent('GeneralWalletManagerProcess', () => GeneralWalletManagerProcess);
AppRegistry.registerComponent('SubWalletProcess', () => SubWalletProcess);
AppRegistry.registerComponent('SendCoinProcess', () => SendCoinProcess);
AppRegistry.registerComponent('SupportedWalletTypeManagerProcess', () => SupportedWalletTypeManagerProcess);
