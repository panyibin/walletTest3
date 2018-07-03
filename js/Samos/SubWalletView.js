import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    RefreshControl,
    FlatList
} from 'react-native';
import LoadingView from './loading';
import Wallet from '../Wallet';

const { WalletManager, NavigationHelper } = NativeModules;

/*
example:transactionDict

amount:"0.1"
targetAddress:"2aPfXHz8MHBpXEu95uePP2Gy6w4vHZ92bo8"
transactionTime:"2018-07-01 16:06:45 GMT+8"
transactionType:"out"
walletId:"skycoin_t56kCA4kx7zCxC8z"
walletType:"skycoin
*/

export default class SubWalletView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletModel: {},
            balance: '0',
            loading: false,
            transactionArray: []
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
        } else { }

        return ({
            title: barTitle,
            headerLeft: (
                <TouchableOpacity
                    style={
                        {
                            height: 20,
                            width: 70
                        }
                    }
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
        let currentWalletModel = navigation.getParam('walletModel', {});
        let transactionArray = currentWalletModel.transactionArray;
        this.setState({
            walletModel: currentWalletModel,
            balance: currentWalletModel.balance,
            transactionArray: transactionArray
        });
        console.log(currentWalletModel);
        console.log(currentWalletModel.transactionArray);
    }

    async refreshCurrentWallet() {
        this.setState({ loading: true });

        const { navigation } = this.props;
        let walletModel = navigation.getParam('walletModel', {});

        console.log('refreshCurrentWallet-----');
        console.log(walletModel);

        let currentWalletModel = await WalletManager.getSubWalletModelDict(walletModel.walletId);
        let balanceDict = await WalletManager.getBalanceDictOfWallet(currentWalletModel.walletId, currentWalletModel.walletType);

        let balance = parseFloat(balanceDict.balance).toFixed(2);
        let transactionArray = currentWalletModel.transactionArray;

        console.log(currentWalletModel);
        console.log(currentWalletModel.walletId);

        if (typeof (currentWalletModel.walletId) != 'undefined') {
            this.setState({
                walletModel: currentWalletModel,
                balance: balance,
                transactionArray: transactionArray
            });
        }

        this.setState({ loading: false });
    }

    render() {
        console.log('render----');
        const { navigation } = this.props;

        let walletModel = this.state.walletModel;
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
                <LoadingView loading={this.state.loading} />

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
                <View style={style.transactionList}>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.loading}
                                onRefresh={
                                    () => {
                                        this.refreshCurrentWallet();
                                    }
                                }
                            />
                        }

                        data={this.state.transactionArray}
                        renderItem={({ item }) => {
                            console.log('item----');
                            console.log(item);
                            return (
                                <View style={style.transactionListItem}>
                                    <View style={style.transactionAddressContainer}>
                                        <Text style={style.transactionAddress}
                                            numberOfLines={1}
                                        >{item.targetAddress}
                                        </Text>
                                        <Text style={style.transactionAmount}>-{item.amount}</Text>
                                    </View>
                                    <View style={style.transactionTimeContainer}>
                                        <Text style={style.transactionType}>send{' ' + item.walletType}</Text>
                                        <Text style={style.transactionTime}>{item.transactionTime}</Text>
                                    </View>
                                    <View style={style.seperator} />
                                </View>
                            );
                        }}
                        keyExtractor={item => item.transactionTime}
                    />
                </View>
                <View style={style.bottomButtonsContainer}>
                    <TouchableOpacity
                        style={style.button}
                        onPress={
                            () => {
                                // console.log(navigation.getParam('walletModel', {}));
                                // let walletModel = this.state.walletModel;

                                // Alert.alert('roll out');
                                navigation.push('SendCoinView', {
                                    walletModel: this.state.walletModel,
                                    balance: this.state.balance,
                                    refreshCurrentWallet: this.refreshCurrentWallet.bind(this)
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

                                navigation.push('ReceiveCoinView', {
                                    walletModel: walletModel
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
        topContainer: {
            flexDirection: 'row',
            backgroundColor: '#303540'
        },
        logo: {
            marginLeft: 40,
            marginTop: 42,
            marginBottom: 44,
            width: 47,
            height: 47
        },
        balance: {
            marginLeft: 26,
            fontSize: 17,
            color: '#efeeda',
            marginTop: 45
        },
        walletType: {
            marginLeft: 26,
            marginTop: 6,
            fontSize: 13,
            color: '#aaaaaa'
        },
        transactionTitleContainer: {
            justifyContent: 'center',
            height: 41,
            backgroundColor: '#efeeda'
        },
        transactionTitle: {
            marginLeft: 25,
            fontSize: 13,
            color: '#414042'
        },
        //transaction list
        transactionList: {
            flex: 3,
            // backgroundColor: 'red'
        },
        transactionListItem: {
            marginLeft: 25,
            marginRight: 25,
            marginTop: 25
        },
        transactionAddressContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        transactionAddress: {
            width: 200,
            fontSize: 13,
            color: '#414042'
        },
        transactionAmount: {
            fontSize: 13,
            color: '#414042'
        },
        transactionTimeContainer: {
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        transactionType: {
            fontSize: 13,
            color: '#aaaaaa'
        },
        transactionTime: {
            fontSize: 13,
            color: '#aaaaaa'
        },
        seperator: {
            marginTop: 15,
            height: 0.5,
            backgroundColor: '#414042'
        },
        //bottom buttons
        bottomButtonsContainer: {
            marginLeft: 25,
            marginRight: 25,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            // backgroundColor:'blue'
        },
        button: {
            width: 150,
            height: 42,
            borderColor: '#414042',
            borderWidth: 0.5,
            justifyContent: 'center',
            marginBottom: 26
        },
        buttonText: {
            textAlign: 'center',
            fontSize: 17,
            color: '#414042'
        }
    }
);