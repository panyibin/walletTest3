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
import Wallet from '../Wallet';

const { WalletManager, NavigationHelper, WalletEventEmitter } = NativeModules;
const walletManagerEmitter = new NativeEventEmitter(WalletEventEmitter);
var subscription;

export default class SideMenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletArray: [],
            currentWalletModel:{}
        };
    }

    componentDidMount() {
        this.refreshLocalWalletArray();

        subscription = walletManagerEmitter.addListener(WalletEventEmitter.generalWalletListDidChangedNotification, (reminder) => {
            this.refreshLocalWalletArray();
        });
    }

    async refreshLocalWalletArray() {
        var localWalletArray = await WalletManager.getLocalWalletDictArray();
        var currentWalletModel = await WalletManager.getCurrentWalletDict();
        this.setState({ 
            walletArray: localWalletArray, 
            currentWalletModel:currentWalletModel });
    }

    async showPasswordViewIfNeeded() {
        var bExist = await WalletManager.hasPinCode();
        if (!bExist) {
            this.setState({ passwordViewVisible: true });
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={style.container}>
                <View style={style.topSpace} />                
                <TouchableOpacity onPress={
                    () => {
                        // Alert.alert('New wallet');
                        // navigation.navigate('NameWalletView');
                        NavigationHelper.showQRReaderViewControllerFromSideMenuAnimated(true);
                    }
                }>
                    <View>
                        <View style={style.item}>
                            <Image source={require('./images/侧导航-扫码.png')} style={style.itemImage}></Image>
                            <Text style={style.itemText}>
                                Scan QR Code
                        </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={style.itemSeperator} />
                <TouchableOpacity onPress={
                    () => {
                        // Alert.alert('New wallet');
                        // navigation.navigate('NameWalletView');
                        NavigationHelper.showGeneralWalletGeneratorViewControllerAnimated(true);
                    }
                }>
                    <View>
                        <View style={style.item}>
                            <Image source={require('./images/侧导航-添加钱包.png')} style={style.itemImage}></Image>
                            <Text style={style.itemText}>
                                Create Wallet
                        </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={style.itemSeperator} />
                <TouchableOpacity onPress={
                    () => {
                        NavigationHelper.showGeneralWalletManagerViewControllerAnimated(true);
                    }
                }>
                    <View>
                        <View style={style.item}>
                            <Image source={require('./images/侧导航-管理钱包.png')} style={style.itemImage}></Image>
                            <Text style={style.itemText}>
                                Manage Wallet
                        </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={style.itemSeperator} />
                <View style={style.walletListTopSpace} />
                <FlatList
                    data={this.state.walletArray}
                    renderItem={
                        ({ item }) => {
                            let itemBackgroundColor;
                            if (item.walletId == this.state.currentWalletModel.walletId) {
                                itemBackgroundColor = '#ecebdb';
                            } else {
                                itemBackgroundColor = 'transparent';
                            }

                            let backgroundStyle = StyleSheet.create(
                                {
                                    background: {
                                        backgroundColor: itemBackgroundColor
                                    }
                                }
                            );

                            return (
                                <TouchableOpacity
                                    style={backgroundStyle.background}
                                    onPress={
                                        () => {
                                            // Alert.alert(item.walletId);
                                            NavigationHelper.rn_hideSideMenu();
                                            WalletManager.resetCurrentWalletId(item.walletId);
                                            this.refreshLocalWalletArray();
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
                            );
                        }
                    }

                    keyExtractor={item => item.walletId}
                />
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
        topSpace: {
            marginTop: 50
        },
        item: {
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center'
        },
        itemImage: {
            marginLeft: 30,
            width: 30,
            height: 30
        },
        itemText: {
            marginLeft: 20,
            color: '#414042'
        },
        itemSeperator: {
            marginTop: 10,
            marginLeft: 30,
            marginRight: 50,
            height: 0.5,
            backgroundColor: '#6d6f71',
        },
        //walletList
        walletListTopSpace: {
            marginTop: 30
        },
        walletItem: {
            flexDirection: 'row',
            marginTop: 7,
            marginBottom:7,
            alignItems: 'center'
        },
        walletImage: {
            marginLeft: 30,
            width: 35,
            height: 35
        },
        walletName: {
            marginLeft: 20,
            fontSize: 15,
            color: '#414042'
            // backgroundColor:'red'
        }
    }
);