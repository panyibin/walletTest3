/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Keyboard,
  Image,
  Clipboard
} from 'react-native';
import {isiPhoneX} from './utils';
import CustomNavigator from './CustomNavigator';

var walletManager = NativeModules.WalletManager;
var navigationHelper = NativeModules.NavigationHelper;

type Props = {};
export default class WalletSeedView extends Component<Props> {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <View style={styles.topView}>
        <Text style={styles.pageTitle}>
               back up wallet
        </Text>
        <TouchableOpacity style={{ position: 'absolute', marginLeft: 10, marginTop:((isiPhoneX()?44:20) + 10) }} onPress={() => {
              navigationHelper.popViewControllerAnimated(true);
            }} >
              <Image source={require('./images/arrow-left.png')} style={{ width: 27, height: 27 }} />
            </TouchableOpacity>
        </View> */}

        <CustomNavigator title='back up wallet' hasBackButton={true} backgroundColor='#1A9BFC' />

        <View style={{backgroundColor:'#F7F7F7'}}>        
        <Text style={styles.subTitle} >Long press to copy the seed, make sure to keep a copy of it, you'll lose your wallet if you forget it.</Text>
        <TouchableOpacity onLongPress={
            ()=>{
                Clipboard.setString(this.props.walletModelDict.seed);
                Alert.alert('The seed has been copied.');
            }
        } >
        <Text style={styles.seedText} >{this.props.walletModelDict.seed}</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const commonLeftMargin = 35;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    //alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  topView: {
    height: (isiPhoneX() ? 88 : 64),
    backgroundColor: '#1A9BFC',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: (isiPhoneX() ? 54 : 30),
    color: 'white'
  },
  subTitle: {
    textAlign: 'left',
    fontSize:15,
    color: 'black',
    marginTop:30,
    marginLeft:10,
    marginRight:10,
    // fontWeight:'bold'
  },
  seedText: {
    textAlign: 'left',
    fontSize:20,
    color: 'black',
    marginTop:30,
    marginLeft:10,
    marginRight:10,
    fontWeight:'bold'
  }
});
