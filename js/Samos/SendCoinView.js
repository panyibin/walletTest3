import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput,
    Image,
    NativeEventEmitter
} from 'react-native';

import InputPasswordView from './InputPasswordView'
import TransactionConfirmView from './TransactionConfirmView'
import LoadingView from './loading'
import Wallet from '../Wallet';
import { strings } from './i18n';

const { WalletManager, NavigationHelper, WalletEventEmitter } = NativeModules;
const WalletManagerEmitter = new NativeEventEmitter(WalletEventEmitter);
var subscription;

export default class SendCoinView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletModel: {},
            targetAddress: '',
            amount: '',
            showPasswordView: false,
            showTransactionConfirmView: false,
            transactionDict: {},
            loading: false,
            balance: 0
        };
    }

    static navigationOptions = ({ navigation }) => {
        let walletModel = navigation.getParam('walletModel', {});
        let previousView = navigation.getParam('previousView', '');
        let walletType = walletModel.walletType;
        let title = '';
        if (walletType == 'samos') {
            title = strings('SendCoinView.sendSamo');
        } else if (walletType == 'skycoin') {
            title = strings('SendCoinView.sendSky');
        }

        return (
            {
                title: title,
                headerLeft: (
                    <TouchableOpacity
                        style={
                            {
                                width: 70,
                                height: 15
                            }
                        }
                        onPress={
                            () => {
                                //Alert.alert(typeof(previousView));
                                if (previousView == 'SubWalletView') {
                                    navigation.goBack();
                                } else {
                                    NavigationHelper.popViewControllerAnimated(true);
                                }
                            }
                        }>
                        <Image
                            style={{ width: 15, height: 20, marginLeft: 10 }}
                            source={require('./images/返回.png')}
                        /></TouchableOpacity>
                ),
                headerRight: (<TouchableOpacity
                    onPress={
                        () => {
                            NavigationHelper.showQRReaderViewControllerAnimated(true);
                        }
                    }
                >
                    <Image
                        style={{
                            marginRight: 10,
                            height: 30,
                            width: 30,
                        }}
                        source={require('./images/侧导航-扫码.png')}></Image>
                </TouchableOpacity>)
            }
        );
    };

    componentDidMount() {
        const { navigation } = this.props;
        let walletModel = navigation.getParam('walletModel', {});
        let transactionDict = navigation.getParam('transactionDict', {});

        let targetAddress = '';
        let amount = '';
        if (typeof (transactionDict.targetAddress) != 'undefined') {
            targetAddress = transactionDict.targetAddress;
        }

        if (typeof (transactionDict.amount) != 'undefined') {
            amount = transactionDict.amount;
        }
        console.log('send coin view');
        console.log(targetAddress);
        console.log(amount);
        console.log(typeof (transactionDict.targetAddress));

        this.setState({
            walletModel: walletModel,
            transactionDict: transactionDict,
            // targetAddress:transactionDict.targetAddress
            targetAddress: targetAddress,
            amount: amount
        });

        this.getWalletBalance();

        subscription = WalletManagerEmitter.addListener(WalletEventEmitter.getAddressFromQRCodeNotification, (reminder) => {
            this.setState({
                targetAddress: reminder.targetAddress,
                amount: reminder.amount
            });
            // Alert.alert(typeof(reminder.targetAddress));

        });
    }

    async getWalletBalance() {
        let walletModel = this.props.navigation.getParam('walletModel', {});
        let balanceDict = await WalletManager.getBalanceDictOfWallet(walletModel.walletId, walletModel.walletType);

        let balance = parseFloat(balanceDict.balance).toFixed(2);

        this.setState({ balance: balance });
    }

    async tapNextButton() {
        let targetAddress = this.state.targetAddress;
        let amount = this.state.amount;
        let walletModel = this.state.walletModel;

        if (targetAddress.length == 0) {
            Alert.alert(strings('SendCoinView.addressInvalid'));
        } else if (amount.length == 0) {
            Alert.alert(strings('SendCoinView.amountInvalid'));
        } else {
            /**
            transaction example
             {
             "walletId":"sky_coin_ddsd",
             "walletType":"skycoin",
             "transactionType":"out"
             "targetAddress":"ssss",
             "amount":"1",
             "transactionTime":"2018-1-1",
             }
             */
            let currentTime = await WalletManager.getCurrentTime();
            let transactionDict = {
                walletId: walletModel.walletId,
                walletType: walletModel.walletType,
                transactionType: 'out',
                targetAddress: targetAddress,
                amount: amount,
                transactionTime: currentTime
            };

            this.setState({
                transactionDict: transactionDict
            });

            this.setState({
                showTransactionConfirmView: true
            });
        }
    }

    //press confirm in passworld view
    async _onPressPasswordConfirm(state) {

        if (state != 'success') {
            Alert.alert(strings('SendCoinView.passwordInvalid'));
        } else {
            this.setState({ showPasswordView: false, loading: true });
            // this.setState({ loading: true });
            let ret = await WalletManager.sendCoinWithTransactionModelDict(this.state.transactionDict);

            //here we use timer to avoid 'Modal View UI hang' problem
            setTimeout(() => {
                this.setState({ loading: false });

                if (ret == 'success') {
                    const { navigation } = this.props;

                    setTimeout(() => {
                        let refreshCurrentWallet = navigation.getParam('refreshCurrentWallet');
                        if(typeof(refreshCurrentWallet) != 'undefined') {
                            refreshCurrentWallet();
                        }

                        Alert.alert(strings("SendCoinView.sendSuccess"), '',
                            [{
                                text: 'ok',
                                onPress: () => {
                                    // navigation.goBack();
                                    let previousView = navigation.getParam('previousView', '');
                                    if (previousView == 'SubWalletView') {
                                        navigation.goBack();
                                    } else {
                                        NavigationHelper.popViewControllerAnimated(true);
                                    }
                                }
                            }]);
                    }, 500);

                } else {
                    setTimeout(() => {
                        Alert.alert(strings("SendCoinView.sendFail"), ret);
                    }, 500);
                }
            }, 500);
        }
    }

    render() {
        const { navigation } = this.props;
        let walletModel = navigation.getParam('walletModel', {});
        let balance = this.state.balance;
        let walletType = walletModel.walletType;

        // let targetAddress = this.props.transactionDict.targetAddress;
        let amount = this.state.transactionDict.amount;

        let walletUnit = 'samo';

        if (walletType == 'samos') {
            walletUnit = 'samo';
        } else if (walletType == 'skycoin') {
            walletUnit = 'sky';
        } else { }

        return (
            <View style={style.container}>
                <LoadingView loading={this.state.loading} />
                <TransactionConfirmView
                    visible={this.state.showTransactionConfirmView}
                    transactionDict={this.state.transactionDict}
                    onPressBack={
                        () => {
                            this.setState({ showTransactionConfirmView: false });
                        }
                    }
                    onPressConfirm={
                        () => {
                            this.setState({
                                showPasswordView: true, showTransactionConfirmView: false
                            });
                        }
                    }
                />
                <InputPasswordView visible={this.state.showPasswordView}
                    onPressBack={
                        () => {
                            this.setState({ showPasswordView: false });
                        }
                    }

                    onPressConfirm={this._onPressPasswordConfirm.bind(this)}
                />
                <View>
                    <Text style={style.walletName}>
                        {strings("SendCoinView.sendTo")}
                </Text>
                    <TextInput
                        multiline={true}
                        placeholder={strings("SendCoinView.inputAddress")}
                        placeholderTextColor={'#6d6f71'}
                        // color={'blue'}
                        style={style.walletNameInput}
                        onChangeText={
                            text => {
                                this.setState({ targetAddress: text });
                            }
                        }>{this.state.targetAddress}</TextInput>
                    <View style={style.seperator} />
                </View>
                <View>
                    <View style={style.amountTitleContainer}>
                        <Text style={style.walletName}>
                        {strings("SendCoinView.amount")}
                        </Text>
                        <View style={style.balanceContainer}>
                            <Text style={style.balanceTag}>{strings("SendCoinView.balance")}</Text>
                            <Text style={style.balance}>{balance} {walletUnit}</Text>
                        </View>
                    </View>
                    <TextInput
                        keyboardType='numeric'
                        multiline={true}
                        placeholder={strings("SendCoinView.inputAmount")}
                        placeholderTextColor={'#6d6f71'}
                        // color={'blue'}
                        style={style.walletNameInput}
                        onChangeText={
                            text => {
                                this.setState({ amount: text });
                            }
                        }>{this.state.amount}</TextInput>
                    <View style={style.seperator} />
                </View>
                <View>
                    <Text style={style.walletName}>
                    {strings("SendCoinView.note")}
                </Text>
                    <TextInput
                        multiline={true}
                        placeholder={strings("SendCoinView.notePlaceholder")}
                        placeholderTextColor={'#6d6f71'}
                        // color={'blue'}
                        style={style.walletNameInput}
                        onChangeText={
                            text => {
                            }
                        }></TextInput>
                    <View style={style.seperator} />
                </View>
                <View style={style.buttonContainer}>
                    <TouchableOpacity
                        style={style.button}
                        onPress={
                            () => {
                                // Alert.alert('Next');
                                this.tapNextButton();
                                // navigation.navigate('NameWalletView');
                            }
                        }>
                        <Text style={style.buttonText}>
                        {strings("SendCoinView.next")}
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
            // justifyContent: 'center',
            backgroundColor: '#2f3239'
        },
        walletName: {
            fontSize: 13,
            marginLeft: 25,
            marginTop: 20,
            color: '#efeeda'
        },
        walletNameInput: {
            marginTop: 20,
            marginLeft: 25,
            marginRight: 25,
            color: '#efeeda'
        },
        seperator: {
            marginTop: 10,
            marginLeft: 25,
            marginRight: 25,
            height: 0.5,
            backgroundColor: '#efeeda'
        },
        //ex: amount   balance:9 sky
        amountTitleContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },

        balanceContainer: {
            marginTop: 20,
            marginRight: 25,
            flexDirection: 'row'
        },
        balanceTag: {
            fontSize: 13,
            color: '#6d6f71'
        },
        balance: {
            fontSize: 13,
            color: '#efeeda'
        },
        //bottom button
        buttonContainer: {
            flex: 1,
            justifyContent: 'flex-end'
        },
        button: {
            marginBottom: 40,
            marginLeft: 25,
            marginRight: 25,
            height: 40,
            borderWidth: 0.5,
            borderColor: '#efeeda',
            justifyContent: 'center'
        },
        buttonText: {
            fontSize: 17,
            // fontWeight: 'bold',
            color: '#efeeda',
            textAlign: 'center'
        },

    }
);