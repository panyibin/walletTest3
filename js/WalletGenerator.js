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
  Image
} from 'react-native';
import {isiPhoneX} from './utils';

import CustomNavigator from './CustomNavigator';

var walletManager = NativeModules.WalletManager;
var navigationHelper = NativeModules.NavigationHelper;

const onButtonPress = () => {
   Alert.alert('generate seed');
};

type Props = {};
export default class WalletGenerator extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      seed: props.defaultSeed,
      seedConfirm: "",
      walletName: ""
    };
  }

  async getSeed() {
    var seedGenerated = await walletManager.getSeed();
    // Alert.alert(seedGenerated);
    this.setState(
      {seed:seedGenerated}
    );
  }

  async tapNext() {
    var walletName = this.state.walletName;
    var seed = this.state.seed;
    var seedConfirm = this.state.seedConfirm;

    if(walletName == undefined || walletName.length == 0) {
      Alert.alert('wallet name is invalid');
    } else if (seed == undefined || seed.length == 0) {
      Alert.alert('seed is invalid');
    } else if (this.props.showGenerateSeedButton && (seedConfirm == undefined || seedConfirm.length == 0) ) {
      Alert.alert('Please confirm the seed');
    } else if (this.props.showGenerateSeedButton && seed != seedConfirm) {
      Alert.alert("The seeds aren't the same");
    } else {
      if(this.props.needPinCode) {
        navigationHelper.showPinCodeViewControllerWithWalletName(this.state.walletName, this.state.seed,true);
      } else {
        var pinCode = await walletManager.getPinCode();
        var success = await walletManager.createNewWallet(walletName, seed, pinCode);
        if(success) {
          navigationHelper.popToRootViewControllerAnimated(true);
        } else {
          Alert.alert('fail to create wallet');
        }
      }
      
    }
  }

  render() {
    var pageTitle;
    var bottomButtonText;
    var instructionText;
    var generateSeedButtonText;
    if(this.props.needPinCode) {
      pageTitle = 'Create a wallet';
      bottomButtonText = 'Next';
      instructionText = "It's your first time using our mobile wallet, so you'll need to either create a new wallet or load an existing one from a seed.";
      generateSeedButtonText = 'Generate seed';
    } else {
      // Alert.alert({this.props.showGenerateSeedButton});
      if(this.props.showGenerateSeedButton) {
        pageTitle = 'Create a wallet';
        bottomButtonText = 'Create';
        instructionText = "You can create a new wallet by generating a seed.";
        generateSeedButtonText = 'Generate seed';
      } else {
        pageTitle = 'Load a wallet';
        bottomButtonText = 'Load';
        instructionText = "You can load an existing wallet from a seed.";
        generateSeedButtonText  = '';
      }
      
    }

    return (
      <View style={styles.container}>
        {/* <View style={styles.topView}>
        <Text style={styles.pageTitle}>
        {pageTitle}
        </Text>
          {!this.props.needPinCode &&
            <TouchableOpacity style={{ position: 'absolute', marginLeft: 10, marginTop:((isiPhoneX()?44:20) + 10) }} onPress={() => {
              navigationHelper.popViewControllerAnimated(true);
            }} >
              <Image source={require('./images/arrow-left.png')} style={{ width: 27, height: 27 }} />
            </TouchableOpacity>
          }
        </View> */}
        <CustomNavigator hasBackButton={!this.props.needPinCode} title={pageTitle}/>
        <Text style={styles.instructions}>
        {instructionText}
        </Text>
        <Text style={styles.subTitleWallet}>
        Name your wallet
        </Text>
        <TextInput 
          style={styles.textInputWallet}
          onChangeText={(text) => {
            this.setState({ walletName: text });
          }
          } 
        >
        </TextInput>
        <Text style={styles.subTitleSeed}>
        Seed
        </Text>
        <TextInput 
        style={styles.textInputSeed} 
        multiline={true} 
        onChangeText={(text)=>{this.setState({seed:text})}}
        >
        {this.state.seed}
        </TextInput>
        { this.props.showGenerateSeedButton &&
        <Text style={styles.subTitleSeed}>
        Confirm Seed
        </Text>}
        { this.props.showGenerateSeedButton &&
        <TextInput 
        style={styles.textInputSeed} 
        multiline={true} 
        onChangeText={(text)=>{this.setState({seedConfirm:text})}}
        >
        </TextInput>}
        <TouchableOpacity style={styles.seedGenerateButton} onPress={this.getSeed.bind(this)}>
        <Text style={styles.seedGenerateButtonText}>{generateSeedButtonText}</Text>
        </TouchableOpacity>
        <View style={{alignItems:'center'}}>
        <TouchableOpacity style={styles.nextButton} onPress={this.tapNext.bind(this)}>
        <Text style={styles.nextButtonText}>{bottomButtonText}</Text>
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
    backgroundColor: '#1478FB',
  },
  topView: {
    height:(isiPhoneX() ? 88 : 64),
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
    color:'white',
    fontWeight:'bold'
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
    fontWeight:'bold'
  },
  subTitleWallet: {
    textAlign: 'left',
    fontSize:15,
    color: 'white',
    marginTop:50,
    marginLeft:35,
    fontWeight:'bold'
  },
  subTitleSeed: {
    textAlign: 'left',
    fontSize:15,
    color: 'white',
    marginTop:30,
    marginLeft:35,
    fontWeight:'bold'
  },
  textInputWallet: {
    fontSize:15,
    backgroundColor:'white',
    marginLeft:35,
    marginRight:35,
    marginTop:10,
    height:23,
    borderRadius:5,
    fontWeight:'bold'
  },
  textInputSeed: {
    fontSize:15,
    backgroundColor:'white',
    marginLeft:35,
    marginRight:35,
    marginTop:10,
    height:60,
    borderRadius:5,
    fontWeight:'bold'
    // textAlign:'left'
  },
  seedGenerateButton: {
    // backgroundColor:'green',
    marginLeft:35,
    marginRight:35,
    marginTop:10,
  },
  seedGenerateButtonText: {
    color:'white',
    // marginRight:35,
    textAlign:'right',
    fontWeight:'bold'
    // backgroundColor:'red'
  },
  nextButton:{
    marginTop:100,
    height:30,
    width:80,
    backgroundColor:'black',
    alignItems:'center',
    borderRadius:15
  },
  nextButtonText:{
    textAlign:'center',
    fontSize:15,
    color:'white',
    marginTop:6,
    fontWeight:'bold'
  }

});
