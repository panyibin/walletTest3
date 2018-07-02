import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    FlatList,
    NativeEventEmitter
} from 'react-native';

const { WalletManager, NavigationHelper, WalletEventEmitter } = NativeModules;
const WalletManagerEmitter = new NativeEventEmitter(WalletEventEmitter);
var subscription;

export default class GeneralWalletManagerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletArray: [],
        };
    }

    static navigationOptions = ({ navigation }) => {
        return (
            {
                title: 'Wallets Management',
                headerLeft: (
                    <TouchableOpacity
                        onPress={
                            () => {
                                NavigationHelper.popViewControllerAnimated(true);
                            }
                        }>
                        <Image
                            style={{ width: 15, height: 20, marginLeft: 10 }}
                            source={require('./images/返回.png')}
                        /></TouchableOpacity>
                ),                
            }
        );
    };
    
    componentDidMount() {
        this.refreshWalletList();

        subscription = WalletManagerEmitter.addListener(WalletEventEmitter.generalWalletListDidChangedNotification, (remider)=>{
            this.refreshWalletList();
        });
    }

    async refreshWalletList() {
        var localWalletArray = await WalletManager.getLocalWalletDictArray();
        this.setState({ walletArray: localWalletArray });
    }

    render() {
        const {navigation} = this.props;
        return (
            <View style={style.container}>
            <View style={style.walletListContainer}>       
                <FlatList
                    data={this.state.walletArray}
                    renderItem={
                        ({ item }) => {
                            return (
                                <View>
                                <TouchableOpacity onPress={
                                    () => {
                                        navigation.push('GeneralWalletManagerDetailView',{
                                            walletModel:item,
                                            refreshWalletList:this.refreshWalletList.bind(this)
                                        });
                                    }
                                }>
                                    <View style={style.walletItem}>
                                        <Image
                                            source={require('./images/侧导航-钱包.png')}
                                            style={style.walletImage}
                                        />
                                        <Text style={style.walletName}>{item.walletName}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={style.walletSeperator}/>
                                </View>
                            );
                        }
                    }

                    keyExtractor={item => item.walletId}
                />
                </View>
                <View style={style.bottomButtonsContainer}>
                <TouchableOpacity 
                style={style.button}
                onPress={
                    () => {
                        // Alert.alert('New wallet');
                        navigation.push('NameWalletView',{
                            previousView:'GeneralWalletManagerView',
                            action:'create'
                        });
                    }
                }>
                    <Text style={style.buttonText}>
                        New Wallet
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={style.button}
                onPress={
                    () => {
                        navigation.push('NameWalletView',{
                            previousView:'GeneralWalletManagerView',
                            action:'import'
                        });
                    }
                }>
                    <Text style={style.buttonText}>
                        Import Wallet
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
            justifyContent: 'space-between',
            backgroundColor: '#fcfbf0'
        },
        //walletList
        walletListTopSpace: {
            marginTop: 30
        },
        walletListContainer:{
            height:'70%'
        },
        walletItem: {
            flexDirection: 'row',
            marginTop: 15,
            alignItems: 'center'
        },
        walletImage: {
            marginLeft: 25,
            width: 35,
            height: 35
        },
        walletName: {
            marginLeft: 20,
            fontSize: 15,
            color:'#414042'
            // backgroundColor:'red'
        },
        walletSeperator: {
            marginTop:10,
            marginLeft: 25,
            marginRight: 25,
            height: 0.5,
            backgroundColor: '#6d6f71'
        },
        //bottom buttons
        bottomButtonsContainer:{
            marginBottom:20
        },
        button: {
            marginTop: 22,
            marginLeft: 25,
            marginRight: 25,
            height: 40,
            borderWidth: 0.5,
            borderColor: '#414042',
            justifyContent: 'center'
        },
        buttonText: {
            fontSize: 17,
            // fontWeight: 'bold',
            color: '#414042',
            textAlign: 'center'
        },
    }
);