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
  Image,
  ActionSheetIOS,
  RefreshControl
} from 'react-native';

import CustomNavigator from './CustomNavigator';
 
import {
  isiPhoneX,
  getStatusBarHeight,
  getScreenWidth
} from './utils';

var walletManager = NativeModules.WalletManager;
var navigationHelper = NativeModules.NavigationHelper;

const {WalletEventEmitter} = NativeModules;
const wallManagerEmitter = new NativeEventEmitter(WalletEventEmitter);
var subscription;

type Props = {};
export default class Wallet extends Component<Props> {

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

  componentDidUpdate () {
    // this.setState({refreshing:false});
    console.log('componentDidUpdate wallet');
  }

  componentWillReceiveProps () {
    console.log('componentDidUpdate wallet');
    this.setState({refreshing:false});
  }

async tapNewWallet() {
    navigationHelper.showWalletGeneratorViewControllerWithGenerateSeedButton(true,true);
  }

  async tapLoadWallet() {
    navigationHelper.showWalletGeneratorViewControllerWithGenerateSeedButton(false,true);
  }

  tapWalletItem(item) {
      Alert.alert(item.walletName);
  }

  showActionSheet() {
    var buttons = ['send sky','cancel'];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options:buttons,
        cancelButtonIndex:buttons.length - 1,
      },
      (buttonIndex)=>{
        if(buttonIndex == 0) {
          // navigationHelper.showPayCoinViewControllerWithWalletModelDict({'abc':'def'}, true);
          Alert.alert('TO BE IMPLEMENTED');
        }
      }
    );
  }

  async _onRefresh() {
    this.setState({refreshing:true});
    walletManager.refreshWalletList();
  }

  render() {
    return (
        <View style={styles.container}>
        <CustomNavigator title='Wallets' />
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
                 <Text style={{marginLeft:10,width:100, backgroundColor:'transparent',fontSize:15, fontWeight:'bold', color:'#C3C4C6'}}>Wallet</Text>
                 <Text style={{marginRight:0, width:80, backgroundColor:'transparent',fontSize:15, fontWeight:'bold', color:'#C3C4C6'}}>Balance</Text>
                </View>
                <View style={{height:0.5, backgroundColor:'#EFF0F0'}} />
                <FlatList
                data={this.props.data}

                renderItem={({item})=>{
                    return (
                        <TouchableOpacity onPress={
                            // Alert.alert('hello');
                            ()=>{                                
                                navigationHelper.showWalletDetailViewControllerWithWalletModelDict(item, true);
                            }
                        }>
                        <View>
                        <View style={{ flexDirection: 'row', marginBottom:10,marginTop:10, justifyContent:'space-between' }}>
                        <View style={{marginLeft:10,width:100}}>
                        <Text style={{backgroundColor: 'transparent', fontSize: 15, color:'#0B8DFC',fontWeight:'bold' }}>{item.walletName}</Text>
                        </View>
                        <View style={{marginRight:0, width:80}}>
                        <Text style={{backgroundColor: 'transparent', fontSize: 15, textAlign:'left',fontWeight:'bold' }}>{item.balance}</Text>
                        </View>                                                        
                        </View>
                        <View 
                        style={{height:0.5, backgroundColor:'#EFF0F0'}}
                        />
                        </View>
                        </TouchableOpacity>
                    );
                }}

                keyExtractor = { item => item.walletId}

                >
                </FlatList>
            </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor:'white' }}>
                <TouchableOpacity style={styles.newWalletButton} onPress={this.tapNewWallet.bind(this)}>
                    <Text style={styles.createButtonText}>New Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loadWalletButton} onPress={this.tapLoadWallet.bind(this)}>
                    <Text style={styles.createButtonText}>Load Wallet</Text>
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
    backgroundColor: '#1A9BFC',
  },
  topView: {
      height:(getStatusBarHeight() + 44),
  },
  pageTitle: {
    fontSize: 20,
    fontWeight:'bold',
    textAlign: 'center',
    marginTop: (isiPhoneX() ? 54 : 30),
    color:'white'
  },
  instructions: {
    textAlign: 'left',
    color: 'white',
    marginTop: 15,
    marginBottom: 5,
    marginLeft:35,
    marginRight:35,
  },
  pinCodeTitle: {
    textAlign: 'left',
    fontSize:15,
    color: 'white',
    marginTop:50,
    marginLeft:35
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
  subTitleSeed: {
    textAlign: 'left',
    fontSize:15,
    color: 'white',
    marginTop:50,
    marginLeft:35
  },
  newWalletButton:{
    marginTop:20,
    marginRight:15,
    marginBottom:40,
    height:30,
    width:120,
    backgroundColor:'#EFF0F0',
    alignItems:'center',
    borderRadius:15
  },
  loadWalletButton:{
    marginTop:20,
    marginLeft:15,
    marginBottom:40,
    height:30,
    width:120,
    backgroundColor:'#EFF0F0',
    alignItems:'center',
    borderRadius:15
  },
  createButtonText:{
    textAlign:'center',
    fontSize:15,
    color:'black',
    marginTop:6,
    fontWeight:'bold'
  }

});
