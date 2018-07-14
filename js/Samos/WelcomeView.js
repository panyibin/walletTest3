import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ImageBackground
} from 'react-native';
import CreatePasswordView from './CreatePasswordView'
import { strings, setLanguage } from './i18n'

const { WalletManager } = NativeModules;

export default class WelcomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordViewVisible: false,
            displayLanguage:'English'
        };
    }

    static navigationOptions = ({ navigation }) => {
        return ({
            // headerMode:'none'
            header: null,
            // headerVisible:false
        });
    };

    componentDidMount() {
        this.getCurrentLanguage();
        this.showPasswordViewIfNeeded();
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
                <ImageBackground
                    source={require('./images/bg0.png')}
                    style={style.imageBackground}
                >
                    <CreatePasswordView modalVisible={this.state.passwordViewVisible}
                        onPressCreate={
                            () => {
                                this.setState({ passwordViewVisible: false });
                            }
                        }
                    />
                    <View style={style.logoContainer}>
                        <Image
                            source={require('./images/logo.png')}
                            style={style.logo}
                        />
                    </View>
                    <Text style={style.description}>
                        {strings('WelcomeView.description')}
                    </Text>
                    <TouchableOpacity
                        style={style.button}
                        onPress={
                            () => {
                                // Alert.alert('New wallet');
                                navigation.push('NameWalletView', {
                                    action: 'create',
                                    previousView: 'WelcomeView'
                                });
                            }
                        }>
                        <Text style={style.buttonText}>
                            {strings('WelcomeView.createWallet')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={style.button}
                        onPress={
                            () => {
                                navigation.push('NameWalletView', {
                                    action: 'import',
                                    previousView: 'WelcomeView'
                                });
                            }
                        }>
                        <Text style={style.buttonText}>
                            {strings('WelcomeView.importWallet')}
                        </Text>
                    </TouchableOpacity>
                    <Text style={style.copyright}>
                        Samos 2018 all rights reserved
                </Text>
                </ImageBackground>
            </View>
        );
    }
}

const style = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: 'center',
            // backgroundColor: 'red'
        },
        imageBackground: {
            width: '100%',
            height: '100%'
        },
        logoContainer: {
            alignItems: 'center'
        },
        logo: {
            width: 180,
            height: 63,
            marginTop: 78,
        },
        description: {
            marginTop: 178,
            fontSize: 14,
            color: '#efeeda',
            textAlign: 'center',
            marginBottom: 30,
            marginLeft: 25,
            marginRight: 25,
            lineHeight: 20
        },
        button: {
            marginTop: 22,
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
        copyright: {
            fontSize: 10,
            marginTop: 80,
            textAlign: 'center',
            color: '#939598'
        }
    }
);