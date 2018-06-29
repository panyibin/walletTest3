import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    FlatList
} from 'react-native';
import Wallet from '../Wallet';

const { WalletManager, NavigationHelper } = NativeModules;

export default class SideMenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletArray: []
        };
    }

    componentDidMount() {
        // this.showPasswordViewIfNeeded();
        this.getLocalWalletArray();
    }

    async getLocalWalletArray() {
        var localWalletArray = await WalletManager.getLocalWalletDictArray();
        this.setState({ walletArray: localWalletArray });
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
                            return (
                                <TouchableOpacity onPress={
                                    () => {
                                        // Alert.alert(item.walletId);
                                        NavigationHelper.rn_hideSideMenu();
                                        WalletManager.resetCurrentWalletId(item.walletId);
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
            backgroundColor: 'white'
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
            marginLeft: 20
        },
        itemSeperator: {
            marginTop: 10,
            marginLeft: 30,
            marginRight: 50,
            height: 0.5,
            backgroundColor: 'black',
        },
        //walletList
        walletListTopSpace: {
            marginTop: 30
        },
        walletItem: {
            flexDirection: 'row',
            marginTop: 15,
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
            // backgroundColor:'red'
        }
    }
);