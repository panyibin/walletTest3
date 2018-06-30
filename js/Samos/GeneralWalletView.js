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
    FlatList,
    RefreshControl,
    ScrollView
} from 'react-native';
import { getStatusBarHeight, getScreenWidth } from '../utils';
import LoadingView from './loading';

const { WalletManager, NavigationHelper, WalletEventEmitter } = NativeModules;
const wallManagerEmitter = new NativeEventEmitter(WalletEventEmitter);
var subscription;

type Props = {};
export default class GeneralWalletView extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            wallet: { subWalletArray: [{}] },
            subWalletArray: [{}],
            totalBalance: 0,
            refreshControlLoading: false,
            samosPriceUSD: 0.19,
            skyPriceUSD: 5.82,
        };
    }

    componentDidMount() {
        this.refreshCurrentWallet();

        subscription = wallManagerEmitter.addListener(WalletEventEmitter.currentWalletDidChangedNotification, (reminder) => {
            this.refreshCurrentWallet();
        })
            ;
    }

    async refreshCurrentWallet() {
        this.setState({ loading: true });
        let samos_price_usd = 1;
        let sky_price_usd = 1;
        var rateApiUrl = 'http://samos.io/api/price?token=all';

        var dataDict = await fetch(rateApiUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                samos_price_usd = responseJson.data.samos.price_usd;
                sky_price_usd = responseJson.data.skycoin.price_usd;
                console.log('success');
                console.log(samos_price_usd);

                this.setState({
                    samosPriceUSD: samos_price_usd,
                    sky_price_usd: sky_price_usd
                });

                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });

        console.log('dataDict');
        console.log(dataDict);

        var currentWallet = await WalletManager.getCurrentWalletDict();

        this.setState({ wallet: currentWallet });

        var tempSubWalletArray = currentWallet.subWalletArray;
        var total = 0;
        for (let i in tempSubWalletArray) {
            let wallet = tempSubWalletArray[i]
            let balanceDict = await WalletManager.getBalanceDictOfWallet(wallet.walletId, wallet.walletType);

            var balanceNum = parseFloat(balanceDict.balance);

            let balanceUSD = 0;
            let walletRateUSD = 1;
            if (wallet.walletType == 'samos') {
                walletRateUSD = samos_price_usd;
                balanceUSD = balanceNum * samos_price_usd;
                total += balanceUSD;
            } else if (wallet.walletType == 'skycoin') {
                walletRateUSD = sky_price_usd;
                balanceUSD = balanceNum * sky_price_usd;
                total += balanceUSD;
            } else {

            }

            wallet.balance = balanceNum.toFixed(2);
            wallet.balanceUSD = balanceUSD.toFixed(2);
            wallet.walletRateUSD = walletRateUSD;
        }

        total = total.toFixed(2);

        this.setState({
            subWalletArray: tempSubWalletArray,
            loading: false,
            totalBalance: total,
            refreshControlLoading: false
        });

    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={style.container}>
                <LoadingView loading={this.state.loading} />
                <View style={style.topContainer}>
                    <View style={style.topBar}>
                        <View style={style.topBarPlaceholder}>
                            <TouchableOpacity onPress={
                                () => {
                                    NavigationHelper.rn_showSideMenu();
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
                        <Image style={style.generalWalletImage} source={require('./images/钱包0.png')} />
                        <Text style={style.totalBalance}>{this.state.totalBalance}</Text>
                        <Text style={style.totalAssets}>Total Assets($)</Text>
                    </View>
                </View>
                <View>
                    <ScrollView style={style.scrollView}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshControlLoading}
                                onRefresh={
                                    () => {
                                        this.setState({ refreshControlLoading: true });
                                        this.refreshCurrentWallet();
                                    }
                                }
                            />
                        }
                    >
                        <FlatList
                            data={this.state.subWalletArray}
                            renderItem={
                                ({ item }) => {
                                    let walletTypeName = 'samos';
                                    let walletIcon = require('./images/samos-logo.png');
                                    let walletBalance = item.balance;
                                    let walletBalanceUSD = '$' + item.balanceUSD;
                                    let walletRate = '';
                                    if (item.walletType == 'samos') {
                                        walletTypeName = 'samos';
                                        walletRate = '1 SAMO=$' + item.walletRateUSD;
                                        walletIcon = require('./images/samos-logo.png');
                                    } else if (item.walletType == 'skycoin') {
                                        walletTypeName = 'sky';
                                        walletRate = '1 SKY=$' + item.walletRateUSD;
                                        walletIcon = require('./images/sky-logo.png');
                                    }

                                    return (
                                        <View >
                                            <TouchableOpacity onPress={
                                                () => {
                                                    // Alert.alert(item.walletId);
                                                    NavigationHelper.showSubWalletViewController(item, true);
                                                }
                                            }
                                            >
                                                <View style={style.subWalletItem}>
                                                    <View style={style.subWalletImageAndTitleContainer}>
                                                        <Image source={walletIcon} style={style.subWalletImage} />
                                                        <View>
                                                            <Text style={style.subWalletTitle}>{walletTypeName}</Text>
                                                            <Text style={style.subWalletRate}>
                                                                {walletRate}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <Text style={style.subWalletBalance}>{walletBalance}</Text>
                                                        <Text style={style.subWalletBalanceUSD}>
                                                            {walletBalanceUSD}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={style.subWalletSeperator} />
                                        </View>
                                    );
                                }
                            }
                            keyExtractor={item => item.walletId}
                        />
                    </ScrollView>
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
            backgroundColor: '#fcfbf0',
        },
        //top bar
        topContainer: {
            backgroundColor: '#393e3f',
        },
        topBar: {
            flexDirection: 'row',
            height: 50,
            marginTop: getStatusBarHeight(),
            // backgroundColor: 'red',
            // justifyContent:'space-between'
        },
        //topBarPlaceholder:used to center the title
        topBarPlaceholder: {
            flex: 1
        },
        menuIcon: {
            width: 24,
            height: 24,
            marginLeft: 25,
            marginTop: 13,
            // backgroundColor: 'green'
        },
        generalWalletTitle: {
            // backgroundColor: 'purple',
            fontSize: 17,
            marginTop: 17,
            textAlign: 'center',
            color: '#efeeda',
            fontWeight: 'bold'
        },
        generalWalletImageContainer: {
            alignItems: 'center'
        },
        generalWalletImage: {
            marginTop: 20,
            width: 100,
            height: 82
        },
        totalBalance: {
            color: '#efeeda',
            fontSize: 25,
            marginTop: 20
        },
        totalAssets: {
            color: '#efeeda',
            fontSize: 12,
            marginTop: 32,
            marginBottom: 30
        },
        //scrollView
        scrollView: {
            height: 500,
            marginTop: 0
        },
        //wallet item
        subWalletItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            // height: 50
        },
        subWalletImageAndTitleContainer:{
            flexDirection:'row',
            marginLeft: 25,
        },
        subWalletImage: {
            width: 47,
            height: 47,
            // marginLeft: 25,
            marginTop: 15,
            marginBottom: 8
        },
        subWalletTitle: {
            marginTop: 18,
            marginLeft: 20,
            fontSize: 17,
            color: '#414042'
            // width: 100,
            // backgroundColor: 'blue'
        },
        subWalletRate: {
            marginLeft: 20,
            marginTop: 6,
            fontSize: 12,
            color: '#aaaaaa',

            // width: 100,
            // backgroundColor: 'blue'
        },
        subWalletBalance: {
            marginTop: 18,
            marginRight: 25,
            fontSize: 17,
            color: '#414042'
        },
        subWalletBalanceUSD: {
            marginTop: 6,
            marginRight: 25,
            fontSize: 12,
            color: '#aaaaaa',
        },
        subWalletSeperator: {
            marginLeft: 20,
            marginRight: 20,
            height: 0.5,
            backgroundColor: 'black'
        }
    }
);