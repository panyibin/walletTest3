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

const { WalletManager } = NativeModules;

export default class WelcomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordViewVisible: false
        };
    }

    static navigationOptions = ({ navigation }) => {
        return ({
            // headerMode:'none'
            header:null,
            // headerVisible:false
        });
    };

    componentDidMount() {
        this.showPasswordViewIfNeeded();
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
                        Welcome to SPO Wallet. If it's the first time you use it, please create a wallet first. If you already have one, plese import it with your seed.
                </Text>
                    <TouchableOpacity
                        style={style.button}
                        onPress={
                            () => {
                                // Alert.alert('New wallet');
                                navigation.push('NameWalletView',{
                                    action:'create',
                                    previousView:'WelcomeView'
                                });
                            }
                        }>
                        <Text style={style.buttonText}>
                            Create a Wallet
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={style.button}
                        onPress={
                            () => {
                                navigation.push('NameWalletView',{
                                    action:'import',
                                    previousView:'WelcomeView'
                                });
                            }
                        }>
                        <Text style={style.buttonText}>
                            Import Existed Wallet
                    </Text>
                    </TouchableOpacity>
                    <Text style={style.copyright}>
                        SPO 2018 all rights reserved
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
            width: 142,
            height: 64,
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