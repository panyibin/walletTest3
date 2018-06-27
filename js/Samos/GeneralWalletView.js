import React, { Component } from 'react';
import {
    NativeEventEmitter,
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    FlatList
} from 'react-native';
import { getStatusBarHeight, getScreenWidth } from '../utils';

const { WalletManager, NavigationHelper, WalletEventEmitter} = NativeModules;
const wallManagerEmitter = new NativeEventEmitter(WalletEventEmitter);
var subscription;

type Props = {};
export default class GeneralWalletView extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            wallet: { subWalletArray: [{}] },
        };
    }

    componentDidMount() {
        this.getCurrentWallet();

        subscription = wallManagerEmitter.addListener(WalletEventEmitter.currentWalletDidChangedNotification, (reminder)=>{
            // Alert.alert('stop animation');
            // this.setState({refreshing:false});
            this.getCurrentWallet();
          })
          ;
    }

    async getCurrentWallet() {
        var currentWallet = await WalletManager.getCurrentWalletDict();
        if (currentWallet != 'undefined') {
            this.setState({ wallet: currentWallet });
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={style.container}>
                <View style={style.topBar}>
                    <View style={style.topBarPlaceholder}>
                        <TouchableOpacity onPress={
                            () => {                                NavigationHelper.rn_showSideMenu();                           
                            }
                        }>
                            <Image style={style.menuIcon} source={require('./images/menu.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={style.topBarPlaceholder}>
                        <Text style={style.generalWalletTitle}>{this.state.wallet.walletName}</Text>
                    </View>
                    <View style={style.topBarPlaceholder} />
                </View>
                <View style={style.generalWalletImageContainer} >
                <Image style={style.generalWalletImage} source={require('./images/侧导航-管理钱包.png')} />
                <Text>Total Assets</Text>
                </View>
                <View>
                <FlatList style={{ backgroundColor: 'green' }}
                    data={this.state.wallet.subWalletArray}
                    renderItem={
                        ({ item }) => {
                            console.log(item);
                            let walletTypeName = 'samos';
                            let walletIcon = require('./images/samos-logo.png');
                            if(item.walletType == 'samos') {
                                walletTypeName = 'samos'
                                walletIcon = require('./images/samos-logo.png');
                            } else if(item.walletType == 'skycoin') {
                                walletTypeName = 'sky'
                                walletIcon = require('./images/sky-logo.png');
                            }
                            return (
                                <View >
                                    <TouchableOpacity onPress={
                                        ()=>{
                                            // Alert.alert(item.walletId);
                                            NavigationHelper.showSubWalletViewControllerAnimated(true);
                                        }
                                    }                                    
                                    >
                                    <View style={style.subWalletItem}>
                                    <Image source={walletIcon} style={style.subWalletImage}/>
                                    <Text style={style.subWalletTitle}>{walletTypeName}</Text>
                                    <Text style={style.subWalletBalance}>10</Text>
                                    </View>
                                    </TouchableOpacity>
                                    
                                </View>
                            );
                        }
                    }
                    keyExtractor={item => item.walletId}
                />
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
            backgroundColor: 'yellow',
        },
        //top bar
        topBar: {
            flexDirection: 'row',
            height: 50,
            marginTop: getStatusBarHeight(),
            backgroundColor: 'red',
            // justifyContent:'space-between'
        },
        topBarPlaceholder: {
            flex: 1
        },
        menuIcon: {
            width: 30,
            height: 30,
            marginLeft: 20,
            marginTop: 10,
            backgroundColor: 'green'
        },
        generalWalletTitle: {
            backgroundColor: 'purple',
            fontSize: 20,
            marginTop: 10,
            textAlign: 'center'
        },
        generalWalletImageContainer:{
        alignItems:'center'
        },
        generalWalletImage: {
            width: 50,
            height: 50
        },
        totalBalance: {

        },
        totalAssets: {

        },
        //wallet item
        subWalletItem:{
            flexDirection:'row',
            justifyContent:'space-between',
            height:50
        },
        subWalletImage:{
            width:30,
            height:30
        },
        subWalletTitle:{
            // marginLeft:100,
             width:100,
            backgroundColor:'blue'
        },
        subWalletBalance:{
            backgroundColor:'red'
        }

    }
);