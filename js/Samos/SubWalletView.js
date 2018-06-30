import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';

const { WalletManager, NavigationHelper } = NativeModules;

export default class SubWalletView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletModel: {},
            balance: '0'
        };
    }

    static navigationOptions = ({ navigation }) => {
        console.log('navigationOptions----');
        let walletModel = navigation.getParam('walletModel', {});
        let walletType = walletModel.walletType
        let barTitle = 'SAMO';
        if (walletType == 'samos') {
            barTitle = 'SAMO';
        } else if (walletType == 'skycoin') {
            barTitle = 'SKY';
        } else {}

        return ({
            title: barTitle,
            headerLeft: (
                <TouchableOpacity style={{ height: 20, width: 50 }}
                    onPress={
                        () => {
                            NavigationHelper.popViewControllerAnimated(true);
                        }
                    }>
                    <Image
                        style={{ width: 15, height: 20, marginLeft: 10 }}
                        source={require('./images/返回.png')}
                    /></TouchableOpacity>)
        });
    };

    componentDidMount() {
        console.log('componentDidMount-----');
        const { navigation } = this.props;
        let currentWalletModel = navigation.getParam('walletModel',{});
         this.setState({
             walletModel:currentWalletModel,
             balance:currentWalletModel.balance
         });
         console.log(currentWalletModel);
    }

    async showPasswordViewIfNeeded() {
        var bExist = await WalletManager.hasPinCode();
        if (!bExist) {
            this.setState({ passwordViewVisible: true });
        }
    }

    render() {
        console.log('render----');
        const { navigation } = this.props;

        let walletModel = navigation.getParam('walletModel', {});
        let walletType = walletModel.walletType;
        let walletLogo;
        let balance = this.state.balance;

        if (walletType == 'samos') {
            walletLogo = require('./images/samos-logo.png');
            balance = balance + ' SAMO'
        }
        else if (walletType == 'skycoin') {
            walletLogo = require('./images/sky-logo.png');
            balance = balance + ' SKY'
        }
        else {
            walletLogo = require('./images/samos-logo.png');
        }

        return (
            <View style={style.container}>
                <View >
                    <View style={style.topContainer}>
                        <Image
                        style={style.logo}
                         source={walletLogo} />
                        <View>
                            <Text style={style.balance}>{balance}</Text>
                            <Text style={style.walletType}>{walletType}</Text>
                        </View>
                    </View>
                    <View style={style.transactionTitleContainer}>
                    <Text style={style.transactionTitle}>Recent transaction records</Text>
                    </View>
                </View>
                <View style={style.bottomButtonsContainer}>
                <TouchableOpacity 
                style={style.button}
                onPress={
                    () => {
                        console.log(navigation.getParam('walletModel', {}));
                        let walletModel = navigation.getParam('walletModel', {});

                        // Alert.alert('roll out');
                        navigation.push('SendCoinView', {
                            walletModel:walletModel
                        });
                    }
                }>
                    <Text style={style.buttonText}>
                        Roll out
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                 style={style.button}
                 onPress={
                    () => {
                        // Alert.alert('Into');
                        let walletModel = navigation.getParam('walletModel', {});

                        navigation.push('ReceiveCoinView',{
                            walletModel:walletModel
                        });
                    }
                }>
                    <Text style={style.buttonText}>
                        Into
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            backgroundColor: '#fcfbf0'
        },
        topContainer:{
            flexDirection:'row',
            backgroundColor:'#303540'
        },
        logo:{
            marginLeft:40,
            marginTop:42,
            marginBottom:44,
            width:47,
            height:47
        },
        balance:{
            marginLeft:26,
            fontSize:17,
            color:'#efeeda',
            marginTop:45
        },
        walletType:{
            marginLeft:26,
            marginTop:6,
            fontSize:13,            
            color:'#aaaaaa'
        },
        transactionTitleContainer:{
            justifyContent:'center',
            height:41,
            backgroundColor:'#efeeda'
        },
        transactionTitle:{
            marginLeft:25,
            fontSize:13,
            color:'#414042'
        },
        //bottom buttons
        bottomButtonsContainer:{
            marginLeft:25,
            marginRight:25,
            flex:1,
            flexDirection:'row',
            alignItems:'flex-end',
            justifyContent:'space-between',
            // backgroundColor:'blue'
        },
        button:{
            width:150,
            height:42,
            borderColor:'#414042',
            borderWidth:0.5,
            justifyContent:'center',
            marginBottom:26
        },
        buttonText:{
            textAlign:'center',
            fontSize:17,
            color:'#414042'
        }
    }
);