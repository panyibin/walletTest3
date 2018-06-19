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
  Image
} from 'react-native';
import {isiPhoneX} from './utils';
import CustomNavigator from './CustomNavigator';

var walletManager = NativeModules.WalletManager;
var navigationHelper = NativeModules.NavigationHelper;

type Props = {};
export default class PayView extends Component<Props> {

  constructor(props){
    super(props);
    this.state = {targetAddress:"", amount:""};
  }

  componentWillReceiveProps (nextProps) {
    // Alert.alert('will receive:'+ nextProps.targetAddress);
    // if(nextProps.targetAddress) {
      this.setState({targetAddress:nextProps.targetAddress});
    // }
  }

async tapSend() {
      var targetAddress = this.state.targetAddress;
      var amount = this.state.amount;
      var walletId = this.props.walletModelDict.walletId;

      // Alert.alert(targetAddress);
      
      if(targetAddress.length == 0) {
          Alert.alert("address is invalid");
      } else if (amount.length == 0) {
          Alert.alert("amount is invalid");
      } else {
          Keyboard.dismiss();
          console.log('send sky');
          var pinCodeVerified = await navigationHelper.showPinCodeInputCheckViewControllerWithCloseButton(true);

        if (pinCodeVerified) {
          var ret = await walletManager.sendSkyCoinWithWalletId(walletId, targetAddress, amount);

          if (ret == 'success') {
            Alert.alert('send sky success',
              '',
              [{
                text: 'OK', onPress: () => {
                  navigationHelper.popToRootViewControllerAnimated(true);
                }
              }
              ]);
            //navigationHelper.popToRootViewControllerAnimated(true);
          } else {
            Alert.alert('fail to send sky', ret);
            // navigationHelper.popToRootViewControllerAnimated(true);
          }
        }
      }
  }

  async tapCancel() {
      navigationHelper.popViewControllerAnimated(true);
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <View style={styles.topView}>
        <Text style={styles.pageTitle}>
               Send Sky
        </Text>
        <TouchableOpacity style={{ position: 'absolute', marginLeft: 10, marginTop:((isiPhoneX()?44:20) + 10) }} onPress={() => {
              navigationHelper.popViewControllerAnimated(true);
            }} >
              <Image source={require('./images/arrow-left.png')} style={{ width: 27, height: 27 }} />
            </TouchableOpacity>
        </View> */}
        <CustomNavigator hasBackButton={true} title='Send Sky' backgroundColor='#1A9BFC' />
        <View style={{backgroundColor:'#F7F7F7'}}>
        <Text style={styles.subTitle}>
        Wallet
        </Text>
        <Text style={styles.subTitleWallet}>
            {this.props.walletModelDict.walletName + ' - ' + this.props.balance + ' SKY'}
        </Text>
        <Text style={styles.subTitle}>
        Send to
        </Text>
        <View style={{flexDirection:'row'}}>
        <TextInput
                style={styles.textInputAddress}
                onChangeText={
                    (text) => {
                        this.setState({ targetAddress: text });
                    }
                }
            >
            {this.props.targetAddress}
        </TextInput>
        <TouchableOpacity onPress={()=>{
          navigationHelper.showQRReaderViewControllerAnimated(true);
        }} >
          <Image source={require('./images/qrcode.png')} style={styles.qrCode} />
        </TouchableOpacity>
        </View>
        <Text style={styles.subTitle}>
            Amount
        </Text>
        <TextInput
                style={styles.textInput}
                onChangeText={
                    (text) => {
                        this.setState({ amount: text });
                    }
                }
            >
        </TextInput>
        <Text style={styles.subTitle}>
            Notes
        </Text>
        <TextInput
                style={styles.textInput}
                placeholder='Short description of transaction'
            >
        </TextInput>
        <View style={{flexDirection:'row', justifyContent: 'center'}}>
        <TouchableOpacity style={styles.cancelButton} onPress={this.tapCancel.bind(this)}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={this.tapSend.bind(this)}>
        <Text style={styles.sendButtonText}>Send</Text>
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
    marginTop:15,
    marginLeft:35,
    fontWeight:'bold'
  },
  subTitleWallet: {
    textAlign: 'left',
    fontSize:15,
    color: 'black',
    marginTop:10,
    marginLeft:35,
    fontWeight:'bold'
  },
  textInputAddress: {
    fontSize:15,
    backgroundColor:'white',
    marginLeft:35,
    marginTop:10,
    height:30,
    width:290,
    borderRadius:5,
    fontWeight:'bold'
  },
  qrCode:{
    marginLeft:10,
    marginTop:15,
    width:20,
    height:20
  },
  textInput: {
    fontSize:15,
    backgroundColor:'white',
    marginLeft:35,
    marginTop:10,
    height:30,
    width:290,
    borderRadius:5,
    fontWeight:'bold'
  },
  sendButton:{
    marginTop:50,
    marginLeft:10,
    marginRight:10,
    height:30,
    width:120,
    backgroundColor:'#1E2227',
    alignItems:'center',
    borderRadius:15
  },
  cancelButton:{
    marginTop:50,
    marginLeft:10,
    marginRight:10,
    height:30,
    width:120,
    backgroundColor:'#EFF0F0',
    alignItems:'center',
    borderRadius:15
  },
  sendButtonText:{
    textAlign:'center',
    fontSize:15,
    color:'white',
    marginTop:6,
    fontWeight:'bold',
  },
  cancelButtonText:{
    textAlign:'center',
    fontSize:15,
    color:'black',
    marginTop:6,
    fontWeight:'bold',
  }

});
