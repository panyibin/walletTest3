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

var {requireNativeComponent} = require('react-native');
var QRCodeView = requireNativeComponent('QRCodeView', null);

var walletManager = NativeModules.WalletManager;
var navigationHelper = NativeModules.NavigationHelper;

type Props = {};
export default class AddressQRCodeView extends Component<Props> {

  constructor(props){
    super(props);
    this.state = {targetAddress:"", amount:""};
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <View style={styles.topView}>
        <Text style={styles.pageTitle}>
               Generate QR code
        </Text>
        <TouchableOpacity style={{ position: 'absolute', marginLeft: 10, marginTop:((isiPhoneX()?44:20) + 10) }} onPress={() => {
              navigationHelper.popViewControllerAnimated(true);
            }} >
              <Image source={require('./images/arrow-left.png')} style={{ width: 27, height: 27 }} />
            </TouchableOpacity>
        </View> */}
        <CustomNavigator hasBackButton={true} title='Generate QR code' backgroundColor='#1A9BFC' />
        <View style={{backgroundColor:'#F7F7F7',alignItems:'center'}}>
        <QRCodeView style={styles.qrCodeView}
         qrCodeString={this.props.address}></QRCodeView>

        <View>
        <TouchableOpacity style={{flexDirection:'row'}}
        onPress={()=>{
            Clipboard.setString(this.props.address);
            Alert.alert('address copied',this.props.address);
        }}
        >
        <Text style={styles.address} numberOfLines={1} >
        {this.props.address}
        </Text>
        <Image source={require('./images/copy.png')} 
        style={styles.copyImage}/>
        </TouchableOpacity>
        </View>

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
  qrCodeView:{
      width:250,
      height:250,
      marginTop:30,
      alignItems:'center',
      backgroundColor:'red'
  },
  address:{
      marginTop:20,
      fontSize:12,
      // width:270,
      alignSelf:'center'
  },
  copyImage:{
      width:20,
      height:20,
      marginLeft:10,
      marginTop:20
  }
});
