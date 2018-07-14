import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    Switch
} from 'react-native';

import { strings } from './i18n';

const { WalletManager, NavigationHelper } = NativeModules;

export default class SupportedWalletTypeManagerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordViewVisible: false,
            generalWalletModel: {},
            skyEnabled: false
        };
    }

    static navigationOptions = ({ navigation }) => {
        return (
            {
                title: strings("SupportedWalletTypeManagerView.title"),
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
            }
        );
    }

    componentDidMount() {
        // this.showPasswordViewIfNeeded();
        const { navigation } = this.props;
        let generalWalletModel = navigation.getParam("generalWalletModel", {});
        this.setState({ generalWalletModel: generalWalletModel });

        let supportedWalletTypes = generalWalletModel.supportedWalletTypes;
        console.log('supportedWalletsArray');
        console.log(generalWalletModel);
        console.log(supportedWalletTypes);
        for (const walletType of supportedWalletTypes) {
            if (walletType == 'skycoin') {
                this.setState({ skyEnabled: true });
                break;
            }
        }
    }

    async showPasswordViewIfNeeded() {
        var bExist = await WalletManager.hasPinCode();
        if (!bExist) {
            this.setState({ passwordViewVisible: true });
        }
    }

    render() {
        const { navigation } = this.props;
        let generalWalletModel = this.state.generalWalletModel;
        return (
            <View style={style.container}>
                <View style={style.item}>
                    <View style={style.logoContainer}>
                        <Image style={style.logo} source={require('./images/samos-logo.png')} />
                        <View>
                            <Text style={style.itemTitle}>SAMO</Text>
                            <Text style={style.walletType}>samos</Text>
                        </View>
                    </View>

                </View>
                <View style={style.seperator} />
                <View style={style.item}>
                    <View style={style.logoContainer}>
                        <Image style={style.logo} source={require('./images/sky-logo.png')} />
                        <View>
                            <Text style={style.itemTitle}>SKY</Text>
                            <Text style={style.walletType}>skycoin</Text>
                        </View>
                    </View>
                    <View style={style.swithContainer}>
                        <Switch
                            style={style.switch}
                            value={this.state.skyEnabled}
                            onValueChange={(value) => {
                                this.setState({ skyEnabled: value });
                                if (value) {
                                    WalletManager.updateSupportedWalletsArray(generalWalletModel.walletId, ['samos', 'skycoin']);
                                } else {
                                    WalletManager.updateSupportedWalletsArray(generalWalletModel.walletId, ['samos']);
                                }
                            }}
                        />
                    </View>
                </View>
                <View style={style.seperator} />
            </View>
        );
    }
}

const style = StyleSheet.create(
    {
        container: {
            flex: 1,
            // justifyContent: 'center',
            backgroundColor: '#fcfbf0'
        },
        item: {
            flexDirection: 'row'
        },
        logoContainer: {
            marginTop: 20,
            flex: 1,
            marginLeft: 20,
            flexDirection: 'row'
        },
        swithContainer: {
            flex: 1,
            alignItems: 'flex-end'
        },
        logo: {
            height: 50,
            width: 50
        },
        itemTitle: {
            marginTop: 10,
            marginLeft: 10,
            color: '#414042',
            fontSize: 15
        },
        walletType: {
            marginLeft: 10,
            marginRight: 3,
            color: '#aaaaaa',
            fontSize: 12
        },
        switch: {
            marginRight: 20,
            marginTop: 20
        },
        seperator: {
            marginLeft: 20,
            marginRight: 20,
            marginTop: 10,
            height: 0.5,
            backgroundColor: '#414042'
        }
    }
);