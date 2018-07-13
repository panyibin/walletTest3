import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput,
    Modal,
    StyleSheet,
    NativeModules
} from 'react-native';

import { strings } from './i18n';

const { WalletManager } = NativeModules;

export default class TransactionConfirmView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactionDict: {}
        };
    }

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

    static defaultProps = {
        onPressConfirm: () => { },
        onPressBack: () => { },
        visible: false,
        transactionDict: {}
    };
    render() {
        let transactionDict = this.props.transactionDict;

        let transactionType = strings('TransactionConfirmView.RollOut') + transactionDict.walletType;
        let targetAddress = ' ' + transactionDict.targetAddress;
        let amount = ' ' + transactionDict.amount;
        let transactionTime = ' ' + transactionDict.transactionTime;

        return (
            <Modal visible={this.props.visible} transparent={true}>
                <View style={style.background}>
                    <TouchableOpacity
                        style={style.dark}
                        onPress={
                            () => {
                                this.props.onPressBack();
                            }
                        }>
                        <View />
                    </TouchableOpacity>
                    <View style={style.container}>
                        <View style={style.titleContainer}>
                            <View style={style.titleSidePlaceHolder}>
                                <TouchableOpacity onPress={
                                    () => {
                                        this.props.onPressBack();
                                    }
                                }>
                                    <Image
                                        style={style.back}
                                        source={require('./images/返回.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={style.titlePlaceHolder}>
                                <Text style={style.title}>{strings('TransactionConfirmView.TransactionInfomation')}</Text>
                            </View>
                            <View style={style.titleSidePlaceHolder} />
                        </View>
                        <View style={style.itemContainer}>
                            <Text style={style.itemLeft}>{strings('TransactionConfirmView.TransactionType')}</Text>
                            <Text style={style.itemRight}>{transactionType}</Text>
                        </View>
                        <View style={style.itemContainer}>
                            <Text style={style.itemLeft}>{strings('TransactionConfirmView.ToAddress')}</Text>
                            <Text style={style.itemRight}>{targetAddress}</Text>
                        </View>
                        <View style={style.itemContainer}>
                            <Text style={style.itemLeft}>{strings('TransactionConfirmView.Amount')}</Text>
                            <Text style={style.itemRight}>{amount}</Text>
                        </View>
                        <View style={style.itemContainer}>
                            <Text style={style.itemLeft}>{strings('TransactionConfirmView.TransactionTime')}</Text>
                            <Text style={style.itemRight}>{transactionTime}</Text>
                        </View>
                        <TouchableOpacity
                            style={style.button}
                            onPress={
                                () => {
                                    this.props.onPressConfirm();
                                }
                            }
                        >
                            <Text style={style.buttonText}>{strings('TransactionConfirmView.Confirm')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

const style = StyleSheet.create(
    {
        background: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end'
        },
        dark: {
            flex: 1,
        },
        container: {
            height: 300,
            backgroundColor: '#fcfbf0'
        },
        titleContainer: {
            marginTop: 16,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center'
        },
        titleSidePlaceHolder: {//used to center the title
            flex: 1
        },
        titlePlaceHolder: {//used to center the title
            flex: 2
        },
        back: {
            marginLeft: 15,
            width: 20,
            height: 18
        },
        title: {
            fontSize: 17,
            color: '#414042',
            textAlign: 'center'
        },
        //item
        itemContainer: {
            flexDirection: 'row',
            marginTop: 15
        },
        itemLeft: {
            flex: 1,
            textAlign: 'right',
            fontSize: 11,
            color: '#414042'
        },
        itemRight: {
            flex: 2,
            fontSize: 11,
            color: '#aaaaaa'
        },
        button: {
            marginTop: 40,
            marginLeft: 25,
            marginRight: 25,
            height: 40,
            borderWidth: 0.5,
            borderColor: '#414042',
            justifyContent: 'center'
        },
        buttonText: {
            fontSize: 17,
            color: '#414042',
            textAlign: 'center'
        }
    }
);