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
import { strings, setLanguage } from './i18n';
import LocalImage from './LocalImage'

const { WalletManager, NavigationHelper, WalletEventEmitter } = NativeModules;
const wallManagerEmitter = new NativeEventEmitter(WalletEventEmitter);
var subscription;

type Props = {};
export default class GeneralWalletView extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            wallet: { subWalletArray: [] },
            subWalletArray: [],
            totalBalanceUSD: 0,
            refreshControlLoading: false,
            samosPriceUSD: 0.19,
            skyPriceUSD: 5.82,
            displayLanguage: "",
            currentCurrencyUnit: "USD"
        };
    }

    componentDidMount() {
        this.refreshCurrentWallet();

        subscription = wallManagerEmitter.addListener(WalletEventEmitter.generalWalletRefreshNotification, (reminder) => {
            this.refreshCurrentWallet();
        })
            ;
    }

    async refreshCurrentWallet() {
        this.setState({ loading: true });

        let currentCurrencyUnit = await WalletManager.getCurrentCurrencyUnit();
        this.setState({ currentCurrencyUnit: currentCurrencyUnit });

        let samos_price_usd = 1;
        let sky_price_usd = 1;

        let samos_price_cny = 1;
        let sky_price_cny = 1;

        var rateApiUrl = 'http://samos.io/api/price?token=all';

        var dataDict = await fetch(rateApiUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                samos_price_usd = responseJson.data.samos.price_usd;
                sky_price_usd = responseJson.data.skycoin.price_usd;

                samos_price_cny = responseJson.data.samos.price_cny;
                sky_price_cny = responseJson.data.skycoin.price_cny;
                console.log('success');
                console.log(samos_price_cny);
                console.log(sky_price_cny);

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

        var tempSubWalletArray = [];

        for (const subWallet of currentWallet.subWalletArray) {
            for (const walletType of currentWallet.supportedWalletTypes) {
                if (subWallet.walletType == walletType) {
                    tempSubWalletArray.push(subWallet);
                }
            }
        }

        var totalUSD = 0;
        var totalCNY = 0;
        for (let i in tempSubWalletArray) {
            let wallet = tempSubWalletArray[i]
            let balanceDict = await WalletManager.getBalanceDictOfWallet(wallet.walletId, wallet.walletType);

            var balanceNum = parseFloat(balanceDict.balance);

            let balanceUSD = 0;
            let walletRateUSD = 1;

            let balanceCNY = 0;
            let walletRateCNY = 1;

            if (wallet.walletType == 'samos') {
                walletRateUSD = samos_price_usd;
                balanceUSD = balanceNum * samos_price_usd;
                totalUSD += balanceUSD;

                walletRateCNY = sky_price_usd;
                balanceCNY = balanceNum * samos_price_cny;
                totalCNY += balanceCNY;

            } else if (wallet.walletType == 'skycoin') {
                walletRateUSD = sky_price_usd;
                balanceUSD = balanceNum * sky_price_usd;
                totalUSD += balanceUSD;

                walletRateCNY = sky_price_cny;
                balanceCNY = balanceNum * sky_price_cny;
                totalCNY += balanceCNY;
            } else {

            }

            wallet.balance = balanceNum.toFixed(2);
            wallet.balanceUSD = balanceUSD.toFixed(2);
            wallet.walletRateUSD = parseFloat(walletRateUSD).toFixed(2);

            wallet.balanceCNY = balanceCNY.toFixed(2);
            wallet.walletRateCNY = parseFloat(walletRateCNY).toFixed(2);
        }

        totalUSD = totalUSD.toFixed(2);
        totalCNY = totalCNY.toFixed(2);

        console.log('totalCNY');
        console.log(totalCNY);

        this.setState({
            subWalletArray: tempSubWalletArray,
            loading: false,
            totalBalanceUSD: totalUSD,
            totalBalanceCNY: totalCNY,
            refreshControlLoading: false
        });

        console.log('General Wallet');
        console.log(this.state.wallet);

        this.getCurrentLanguage();
    }

    async getCurrentLanguage() {
        let currentLanguage = await WalletManager.getCurrentLanguage();
        let displayLanguage = 'English';
        if (currentLanguage == 'zh') {
            displayLanguage = '中文';
        } else {
            displayLanguage = 'English';
        }

        setLanguage(currentLanguage);

        this.setState({ displayLanguage: displayLanguage });
    }

    render() {
        const { navigation } = this.props;
        let currentCurrencyUnit = this.state.currentCurrencyUnit;
        let unitSign = '$';
        let totalBalance;
        if(currentCurrencyUnit == 'USD') {
            unitSign = '$';
            totalBalance = this.state.totalBalanceUSD;
        } else if(currentCurrencyUnit == 'CNY') {
            unitSign = '￥'
            totalBalance = this.state.totalBalanceCNY;
        } else {}

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
                        <Image style={style.generalWalletImage} source={LocalImage[this.state.wallet.avatar]} />
                        <Text style={style.totalBalance}>{totalBalance}</Text>
                        <View style={style.totalAssetsContainer}>
                            <View style={style.totalAssetsPlaceholder} />
                            <View style={style.totalAssetsPlaceholder}>
                                <Text style={style.totalAssets}>{strings('GeneralWalletView.totalAssets')} ({unitSign})</Text>
                            </View>
                            <View style={style.totalAssetsPlaceholder}>
                                <TouchableOpacity style={style.plusContainer} onPress={
                                    () => {
                                        // Alert.alert("add");
                                        NavigationHelper.showSupportedWalletTypeViewController(this.state.wallet, true);
                                    }
                                }>
                                    <Image style={style.plus} source={require('./images/添加.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
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
                                    let walletBalanceMoney = '$' + item.balanceUSD;
                                    if(currentCurrencyUnit == 'USD') {
                                        walletBalanceMoney = '$' + item.balanceUSD;
                                    } else if(currentCurrencyUnit == 'CNY') {
                                        walletBalanceMoney = '￥' + item.balanceCNY;
                                    }

                                    console.log("subwallet item...");
                                    console.log(item);

                                    let walletRate = '';
                                    if (item.walletType == 'samos') {
                                        walletTypeName = 'samos';

                                        if(currentCurrencyUnit == 'USD') {
                                            walletRate = '1 SAMO=$' + item.walletRateUSD;
                                        } else if(currentCurrencyUnit == 'CNY') {
                                            walletRate = '1 SAMO=￥' + item.walletRateCNY;
                                        }

                                        walletIcon = require('./images/samos-logo.png');
                                    } else if (item.walletType == 'skycoin') {
                                        walletTypeName = 'sky';

                                        if(currentCurrencyUnit == 'USD') {
                                            walletRate = '1 SKY=$' + item.walletRateUSD;
                                        } else if(currentCurrencyUnit == 'CNY') {
                                            walletRate = '1 SKY=￥' + item.walletRateCNY;
                                        }

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
                                                            {walletBalanceMoney}
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
            width: 80,
            height: 80
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
            marginBottom: 30,
            textAlign: 'center'
        },
        totalAssetsContainer: {
            flexDirection: 'row'
        },
        totalAssetsPlaceholder: {
            flex: 1
        },
        plusContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end'
        },
        plus: {
            marginTop: 30,
            marginRight: 25,
            width: 20,
            height: 20,
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
        subWalletImageAndTitleContainer: {
            flexDirection: 'row',
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