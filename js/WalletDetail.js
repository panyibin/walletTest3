/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  ScrollView,
  Clipboard,
  Image,
  ActionSheetIOS,
  RefreshControl
} from 'react-native';

import {
    isiPhoneX,
    getStatusBarHeight,
    getScreenWidth
} from './utils';

import CustomNavigator from './CustomNavigator';

var walletManager = NativeModules.WalletManager;
var navigationHelper = NativeModules.NavigationHelper;

const {WalletEventEmitter} = NativeModules;
const wallManagerEmitter = new NativeEventEmitter(WalletEventEmitter);
var subscription;

type Props = {};
export default class WalletDetail extends Component<Props> {

  constructor(props){
    super(props);
    this.state = {
        pinCode:"", 
        pinCodeConfirm:"",
        refreshing:false
    };
    // Alert.alert(props.data);
  }

  componentDidMount () {
    subscription = wallManagerEmitter.addListener(WalletEventEmitter.stopLoadingAnimationNotification, (reminder)=>{
      // Alert.alert('stop animation');
      this.setState({refreshing:false});
    })
    ;
  }

  componentWillUnmount () {
    subscription.remove();
  }

async tapNewAddress() {
    // Alert.alert('new address');
    // walletManager.createNewAddressWithWalletId(this.props.walletModelDict.walletId, 1);
    Alert.alert(
        'A new address will be created in this wallet.',
        '',
        [
            {text:'OK', onPress:()=>{
                walletManager.createNewAddressWithWalletId(this.props.walletModelDict.walletId, 1);
            }},
            {text:'Cancel', onPress:()=>{

            }, style:'cancel'}            
        ]
    );
  }

  async tapSendSky() {
      //Alert.alert('send sky');
      navigationHelper.showPayCoinViewControllerWithWalletModelDict(this.props.walletModelDict, true);
  }

  longPressWalletTitle() {
    Clipboard.setString(this.props.walletModelDict.seed);
    Alert.alert('seed copied',this.props.walletModelDict.seed);
  }

  async tapBackupWallet() {
      var pinCodeVerified = await navigationHelper.showPinCodeInputCheckViewControllerWithCloseButton(true);
      if(pinCodeVerified) {          
          navigationHelper.showWalletSeedViewControllerWithWalletModelDict(this.props.walletModelDict, true);
      }
  }

  async tapDeleteWallet() {
    var pinCodeVerified = await navigationHelper.showPinCodeInputCheckViewControllerWithCloseButton(true);
    if(pinCodeVerified) {          
        this._tryToRemoveWallet();
    }
}

  showActionSheet() {
    var buttons = ['back up wallet','delete wallet','cancel'];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options:buttons,
        cancelButtonIndex:buttons.length - 1,
      },
      (buttonIndex)=>{
        // if(buttonIndex == 0) {
        //   navigationHelper.showPayCoinViewControllerWithWalletModelDict(this.props.walletModelDict, true);
        // } else
         if(buttonIndex == 0) {
            this.tapBackupWallet();
          } else if (buttonIndex == 1) {
            Alert.alert(
                'Do you want to delete the wallet?',
                '',
                [
                    {text:'OK', onPress:()=>{
                        this.tapDeleteWallet();
                    }},
                    {text:'Cancel', onPress:()=>{
        
                    }, style:'cancel'}            
                ]
            );
        }
      }
    );
  }

  async _tryToRemoveWallet() {
    var result = await walletManager.removeWallet(this.props.walletModelDict.walletId);

    if(result == 'success') {
        navigationHelper.popViewControllerAnimated(true);
    } else {
        Alert.alert('fail to remove wallet', result);
    }
  }

  async _onRefresh() {
      this.setState({refreshing:true});
      walletManager.refreshAddressList();
    // var complete = await 
    // if(complete = 'complete') {
    //     // this.setState({refreshing:false});
    // }
  }

  render() {
    return (
        <View style={styles.container}>
            {/* <View style={styles.topView}>
                    <Text style={styles.pageTitle}>
                        {this.props.walletModelDict.walletName}
                    </Text>
                <TouchableOpacity 
                style={{ position: 'absolute', marginLeft: 10, marginTop: (getStatusBarHeight() + 10) }} 
                onPress={() => {
                    navigationHelper.popViewControllerAnimated(true);
                }} >
                    <Image source={require('./images/arrow-left.png')} style={{ width: 27, height: 27 }} />
                </TouchableOpacity>
                <TouchableOpacity 
                style={{ position: 'absolute', marginLeft: (getScreenWidth() - 40), marginTop: (getStatusBarHeight() + 10) }} 
                onPress={() => {
                    this.showActionSheet();
                }} >
                    <Image source={require('./images/more-horizontal.png')} style={{ width: 27, height: 27 }} />
                </TouchableOpacity>
            </View> */}
            <CustomNavigator title={this.props.walletModelDict.walletName} hasBackButton={true}  onPressMore={()=>{
                this.showActionSheet();
            }} />
        <ScrollView style={{backgroundColor:'white'}}
                refreshControl={<RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh = {this._onRefresh.bind(this)}
                    />}
        >
            <View style={{backgroundColor:'#1A9BFC'}}>
                <Text style={styles.skyCoinBalance}>
                    {(this.props.totalCoinBalance != undefined ? this.props.totalCoinBalance : '0')   + ' SKY'}
                </Text>
                <Text style={styles.skyHourBalance}>
                    {(this.props.totalHourBalance != undefined ? this.props.totalHourBalance : '0') + ' SKY Coin Hours'}
                </Text>
            </View>
            <View style={{marginTop:0, backgroundColor:'white'}}>
                <View style={{flexDirection:'row',marginTop:10,marginBottom:10,justifyContent:'space-between'}}>
                 <Text style={{marginLeft:10,width:200, backgroundColor:'transparent',fontSize:15, fontWeight:'bold', color:'#C3C4C6'}}>Address</Text>
                 <Text style={{marginRight:0,width:80, backgroundColor:'transparent',fontSize:15, fontWeight:'bold', color:'#C3C4C6'}}>Balance</Text>
                </View>
                <View style={{height:0.5, backgroundColor:'#EFF0F0'}} />
                <FlatList
                data={this.props.data}

                renderItem={({item})=>{
                    return (
                        <TouchableOpacity onPress={
                            // Alert.alert('hello');
                            ()=>{
                                // Clipboard.setString(item.address);
                                // Alert.alert('Address copied',item.address);
                                navigationHelper.showAddressQRCodeViewControllerWithAddress(item.address, true);
                            }
                        }>
                        <View>
                        <View style={{ flexDirection: 'row', marginBottom:10,marginTop:10, justifyContent:'space-between' }}>
                        <View style={{marginLeft:10,width:200}}>
                        <Text 
                        style={{backgroundColor: 'transparent', fontSize: 15 ,fontWeight:'bold', color:'#919497'}}
                        numberOfLines={1}
                        >
                        {item.address}
                        </Text>
                        </View>
                        <View style={{marginRight:0, width:80}}>
                        <Text style={{backgroundColor: 'transparent', fontSize: 15, textAlign:'left', fontWeight:'bold'}}>{item.balance}</Text>
                        </View>                                                        
                        </View>
                        <View 
                        style={{height:0.5, backgroundColor:'#EFF0F0'}}
                        />
                        </View>
                        </TouchableOpacity>
                    );
                }}

                keyExtractor = { item => item.address}

                >
                </FlatList>
            </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'center',backgroundColor:'white' }}>
                <TouchableOpacity style={styles.newAddressButton} onPress={this.tapSendSky.bind(this)}>
                    <Text style={styles.newAddressButtonText}>Send Sky</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.newAddressButton} onPress={this.tapNewAddress.bind(this)}>
                    <Text style={styles.newAddressButtonText}>New Address</Text>
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
    backgroundColor: '#1A9BFC',
  },
    topView: {
        height: (isiPhoneX() ? 88 : 64),
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: (isiPhoneX() ? 54 : 30),
        color: 'white'
    },
  instructions: {
    textAlign: 'left',
    color: 'white',
    marginTop: 15,
    marginBottom: 5,
    marginLeft:35,
    marginRight:35,
  },
  skyCoinBalance: {
    textAlign: 'center',
    fontSize:35,
    fontWeight:'bold',
    color: 'white',
    marginTop:50,
  },
  skyHourBalance: {
    textAlign: 'center',
    fontSize:17,
    fontWeight:'bold',
    color: 'white',
    marginTop:20,
    marginBottom:30
  },
  newAddressButton:{
    marginTop:20,
    marginRight:15,
    marginBottom:40,
    height:30,
    width:140,
    backgroundColor:'#EFF0F0',
    alignItems:'center',
    borderRadius:15
  },
  newAddressButtonText:{
    textAlign:'center',
    fontSize:15,
    color:'black',
    marginTop:6,
    fontWeight:'bold'
  }

});
