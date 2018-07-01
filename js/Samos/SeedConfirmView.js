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
import LoadingView from './loading';

const { WalletManager } = NativeModules;
const { NavigationHelper } = NativeModules;

export default class SeedConfirmView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seedConfirm: "",
            loading: false
        };
    }

    static navigationOptions = ({ navigation }) => {
        return (
            {
                title: 'Confirm mnonomic',
                headerRight: (
                    <Text
                        onPress={navigation.getParam('tapNavigationRightButton')}
                        style={{ marginRight: 20, fontSize: 20 }}
                    >Confirm</Text>)
            }
        );
    };

    componentDidMount() {
        this.props.navigation.setParams({ tapNavigationRightButton: this.tapNavigationRightButton.bind(this) });
        // this.setDefaultSeed();
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
        var seed = this.state.seedConfirm;
        var pinCode = await WalletManager.getPinCode();

        var success = await WalletManager.createNewWallet(walletName, seed, pinCode);

        if (success) {
            this.setState({ loading: false });
            // Alert.alert('success');
            NavigationHelper.rn_resetToMainPage();
        } else {
            this.setState({ loading: false });
            setTimeout(() => {
                Alert.alert('fail to create wallet');
            }, 500);
        }
    }

    tapNavigationRightButton() {
        const { navigation } = this.props;
        let seed = navigation.getParam('seed', '');
        let seedConfirm = this.state.seedConfirm;

        // Alert.alert(seedConfirm);
        if (seed.length > 0 && seed == seedConfirm) {
            this.createWallet();
        } else {
            Alert.alert('the seeds are not the same, please confirm');
        }
    }
    
    render() {
        const { navigation } = this.props;

        return (
            <View style={style.container}>
                <LoadingView loading={this.state.loading}></LoadingView>
                <Text style={style.title} >
                    Confirm your wallet mnemonic
                </Text>
                <Text style={style.description}>
                    Please input the mnenonic your just wrote down.
                </Text>
                <View style={style.seedContainer}>
                    <TextInput
                        multiline={true}
                        placeholder={'input the mnenonic again'}
                        placeholderTextColor={'#6d6f71'}
                        style={style.seedInput}
                        onChangeText={(text) => {
                            this.setState({ seedConfirm: text });
                        }}
                    ></TextInput>
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
        seedInput: {
            fontSize: 17,
            color: '#efeeda',
            marginLeft: 25,
            marginTop: 38,
            marginRight: 25,
            marginBottom: 38
        }
    }
);