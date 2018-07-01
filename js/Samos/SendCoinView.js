import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput
} from 'react-native';

import InputPasswordView from './InputPasswordView'
import TransactionConfirmView from './TransactionConfirmView'

const { WalletManager } = NativeModules;

export default class SendCoinView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletModel: {},
            targetAddress: '',
            amount: '',
            showPasswordView:false,
            showTransactionConfirmView:false
        };
    }

    static navigationOptions = ({ navigation }) => {
        let walletModel = navigation.getParam('walletModel', {});
        let walletType = walletModel.walletType;
        let title = '';
        if (walletType == 'samos') {
            title = 'Roll out samo';
        } else if (walletType == 'skycoin') {
            title = 'Roll out sky';
        }

        return (
            {
                title: title,
            }
        );
    };

    componentDidMount() {
        const { navigation } = this.props;
        let walletModel = navigation.getParam('walletModel', {});
        this.setState({ walletModel: walletModel });
        // this.showPasswordViewIfNeeded();
    }

    async tapNextButton() {
        let targetAddress = this.state.targetAddress;
        let amount = this.state.amount;
        let walletModel = this.state.walletModel;

        if (targetAddress.length == 0) {
            Alert.alert("address is invalid");
        } else if (amount.length == 0) {
            Alert.alert("amount is invalid");
        } else {
            let a = typeof(this.showPasswordViewIfNeeded);
            // Alert.alert(a);
            this.setState({
                showTransactionConfirmView:true
            });
        }
    }

    async _onPressConfirm(password) {
        Alert.alert('get:'+password);
    }

    render() {
        const { navigation } = this.props;
        let walletModel = navigation.getParam('walletModel', {});
        let walletType = walletModel.walletType;
        let walletUnit = 'samo';

        if (walletType == 'samos') {
            walletUnit = 'samo';
        } else if (walletType == 'skycoin') {
            walletUnit = 'sky';
        } else { }

        return (
            <View style={style.container}>
            <TransactionConfirmView
            visible={this.state.showTransactionConfirmView}
            onPressBack={
                ()=>{
                    this.setState({showTransactionConfirmView:false});
                }
            }
            onPressConfirm={
                ()=>{
                    this.setState({
                        showPasswordView:true,showTransactionConfirmView:false});
                }
            }
            />
            <InputPasswordView visible={this.state.showPasswordView}
            onPressBack={
                ()=>{
                    this.setState({showPasswordView:false});
                }
            }

            // onPressConfirm={this._onPressConfirm.bind(this)}
            onPressConfirm={
                (password)=>{
                    Alert.alert('oh:'+password);
                }
            }
            />
                <View>
                    <Text style={style.walletName}>
                        Send To
                </Text>
                    <TextInput
                        multiline={true}
                        placeholder={"Input the address you want to send"}
                        placeholderTextColor={'#6d6f71'}
                        // color={'blue'}
                        style={style.walletNameInput}
                        onChangeText={
                            text => {
                                this.setState({ targetAddress: text });
                            }
                        }></TextInput>
                    <View style={style.seperator} />
                </View>
                <View>
                    <View style={style.amountTitleContainer}>
                        <Text style={style.walletName}>
                            Amount
                        </Text>
                        <View style={style.balanceContainer}>
                            <Text style={style.balanceTag}>balance:</Text>
                            <Text style={style.balance}>{walletModel.balance} {walletUnit}</Text>
                        </View>
                    </View>
                    <TextInput
                        keyboardType='numeric'
                        multiline={true}
                        placeholder={"please input the amount"}
                        placeholderTextColor={'#6d6f71'}
                        // color={'blue'}
                        style={style.walletNameInput}
                        onChangeText={
                            text => {
                                this.setState({ amount: text });
                            }
                        }></TextInput>
                    <View style={style.seperator} />
                </View>
                <View>
                    <Text style={style.walletName}>
                        Note(optional)
                </Text>
                    <TextInput
                        multiline={true}
                        placeholder={"note"}
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
                            Next
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