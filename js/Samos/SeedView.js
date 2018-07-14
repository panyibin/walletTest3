import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    EventEmitter
} from 'react-native';
import LoadingView from './loading';
import { strings } from './i18n';

const { WalletManager, NavigationHelper } = NativeModules;

export default class SeedView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seed: "",
            loading: false
        };
    }

    static navigationOptions = ({ navigation }) => {
        return (
            {
                title: strings("SeedView.title"),
                headerRight: (
                    <Text
                        onPress={navigation.getParam('tapNavigationRightButton')}
                        style={{ marginRight: 20, fontSize: 20 }}
                    >{strings("SeedView.next")}</Text>)
            }
        );
    };

    componentDidMount() {
        this.props.navigation.setParams({ tapNavigationRightButton: this.tapNavigationRightButton.bind(this) });
        this.setDefaultSeed();
    }

    async setDefaultSeed() {
        var defaultSeed = await WalletManager.getSeed();
        if (defaultSeed) {
            this.setState({ seed: defaultSeed });
        }
    }

    async createWallet() {
        this.setState({ loading: true });
        var walletName = this.props.navigation.getParam('walletName');
        var seed = this.state.seed;
        var pinCode = await WalletManager.getPinCode();

        var success = await WalletManager.createNewWallet(walletName, seed, pinCode);

        if (success) {
            this.setState({ loading: false });
            // Alert.alert('success');
            NavigationHelper.rn_resetToMainPage();
        } else {
            this.setState({ loading: false });
            //   Alert.alert('fail to create wallet');
        }
    }

    tapNavigationRightButton() {
        //  Alert.alert('tap right button');
        const { navigation } = this.props;
        let name = navigation.getParam('walletName', '');
        let avatar = navigation.getParam('avatar', '');
        // Alert.alert(name);
        navigation.push('SeedConfirmView', {
            walletName: name,
            avatar:avatar,
            seed: this.state.seed
        });

        // navigation.push('SeedConfirmView');
        // navigation.push('Home');
    }

    render() {
        const { navigation } = this.props;

        return (
            <View style={style.container}>
                <LoadingView loading={this.state.loading}></LoadingView>
                <Text style={style.title} >
                    {strings("SeedView.writeDownSeed")}
                </Text>
                <Text style={style.description}>
                    {strings("SeedView.description")}
                </Text>
                <View style={style.seedContainer}>
                    <Text style={style.seed}>
                        {this.state.seed}
                    </Text>
                </View>
                <View style={style.buttonContainer}>
                    <TouchableOpacity
                        style={style.button}
                        onPress={
                            () => {
                                // Alert.alert('create');
                                this.setDefaultSeed();
                            }
                        }>
                        <Text style={style.buttonText}>
                            {strings("SeedView.generateSeed")}
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
            backgroundColor: '#2f3239'
        },
        title: {
            marginTop: 50,
            fontSize: 17,
            textAlign: 'center',
            color: '#efeeda'
        },
        description: {
            marginTop: 26,
            marginLeft: 25,
            marginRight: 25,
            fontSize: 12,
            textAlign: 'center',
            color: '#efeeda'
        },
        seedContainer: {
            marginTop: 26,
            marginLeft: 25,
            marginRight: 25,
            borderWidth: 0.5,
            borderColor: '#efeeda'
        },
        seed: {
            fontSize: 17,
            color: '#efeeda',
            marginLeft: 25,
            marginTop: 38,
            marginRight: 25,
            marginBottom: 38
        },
        buttonContainer: {
            flex: 1,
            justifyContent: 'flex-end'
        },
        button: {
            marginBottom: 40,
            marginLeft: 25,
            marginRight: 25,
            borderWidth: 0.5,
            height: 40,
            borderColor: '#efeeda',
            justifyContent: 'center'
        },
        buttonText: {
            fontSize: 17,
            textAlign: 'center',
            color: '#efeeda'
        }
    }
);