import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    FlatList,
    Image,
    Clipboard
} from 'react-native';
import LoadingView from './loading';
import { strings } from './i18n';

const { WalletManager } = NativeModules;

export default class ReceiveCoinView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordViewVisible: false,
            addressDictArray: [],
            loading: false,
            walletModel: {}
        };
    }

    static navigationOptions = ({ navigation }) => {
        let walletModel = navigation.getParam('walletModel', {});
        let title = strings("ReceiveCoinView.Receive") + ' ' + walletModel.walletType;
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

        this.refreshAddressList();
    }

    async refreshAddressList() {
        this.setState({ loading: true });
        const { navigation } = this.props;
        let walletModel = navigation.getParam('walletModel', {});
        let localAddressList = await WalletManager.getAddressDictArrayOfWalletId(walletModel.walletId);

        let addressDictArray = [];
        for (const address of localAddressList) {
            let dict = {};
            dict.address = address;
            let balanceDict = await WalletManager.getBalanceDictOfAddress(address, walletModel.walletType);

            let balance = parseFloat(balanceDict.balance).toFixed(2);
            dict.balance = balance;
            addressDictArray.push(dict);
        }

        console.log('address dict array');
        console.log(addressDictArray);
        this.setState({ addressDictArray: addressDictArray });
        this.setState({ loading: false });
    }

    async tapCreateAddressButton() {
        this.setState({ loading: true });
        var success = await WalletManager.createNewAddressWithWalletId(this.state.walletModel.walletId, 1);

        await this.refreshAddressList();

        console.log('create address:')
        console.log(success);

        this.setState({ loading: false });
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={style.container}>
                <LoadingView loading={this.state.loading} />
                <Text style={style.titleBalance}>{strings("ReceiveCoinView.Balance")}</Text>
                <FlatList
                    data={this.state.addressDictArray}
                    renderItem={
                        ({ item }) => {
                            return (
                                <View style={style.listItem}>
                                    <TouchableOpacity onPress={
                                        () => {
                                            // Clipboard.setString(item.address);
                                            // Alert.alert('address copied');
                                            // Alert.alert(item.address);
                                            navigation.push('ReceiveCoinDetailView', {
                                                targetAddress: item.address,
                                                walletModel: this.state.walletModel
                                            });
                                        }
                                    }>
                                        <View style={style.addressContainer}>
                                            <Text
                                                style={style.address}
                                                numberOfLines={1}>
                                                {item.address}
                                            </Text>
                                            <Image
                                                style={style.image}
                                                source={require('./images/二维码.png')}
                                            />
                                            <Text style={style.balance}>{item.balance}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={style.seperator} />
                                </View>
                            );
                        }
                    }
                    keyExtractor={item => item.address}
                />
                <TouchableOpacity
                    style={style.button}
                    onPress={
                        () => {
                            this.tapCreateAddressButton();
                        }
                    }>
                    <Text style={style.buttonText}>{strings("ReceiveCoinView.CreateAddress")}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const style = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: '#fcfbf0'
        },
        titleBalance: {
            textAlign: 'right',
            marginRight: 25,
            marginTop: 15,
            fontSize: 14,
            color: '#414042'
        },
        listItem: {
            marginLeft: 25,
            marginRight: 25,
            marginTop: 25,
        },
        addressContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        address: {
            width: 200,
            fontSize: 13,
            color: '#414042'
        },
        image: {
            width: 20,
            height: 20
        },
        balance: {
            fontSize: 13,
            color: '#414042'
        },
        seperator: {
            // marginLeft:25,
            // marginRight:25,
            marginTop: 10,
            height: 0.5,
            backgroundColor: '#6d6f71'
        },
        //bottom button
        button: {
            marginTop: 22,
            marginLeft: 25,
            marginRight: 25,
            marginBottom: 30,
            height: 40,
            borderWidth: 0.5,
            borderColor: '#414042',
            justifyContent: 'center'
        },
        buttonText: {
            fontSize: 17,
            color: '#414042',
            textAlign: 'center'
        },
    }
);