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
import { strings } from './i18n';

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
                title: strings("SeedConfirmView.title"),
                headerRight: (
                    <Text
                        onPress={navigation.getParam('tapNavigationRightButton')}
                        style={{ marginRight: 20, fontSize: 20 }}
                    >{strings("SeedConfirmView.confirm")}</Text>)
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
        var pinCode = await WalletManager.getLocalPinCode();

        var success = await WalletManager.createNewWallet(walletName, seed, pinCode);

        if (success) {
            this.setState({ loading: false });
            // Alert.alert('success');
            NavigationHelper.rn_resetToMainPage();
        } else {
            this.setState({ loading: false });
            setTimeout(() => {
                Alert.alert(strings("SeedConfirmView.failToCreateWallet"));
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
            Alert.alert(strings("SeedConfirmView.seedsNotSame"));
        }
    }

    render() {
        const { navigation } = this.props;

        return (
            <View style={style.container}>
                <LoadingView loading={this.state.loading}></LoadingView>
                <Text style={style.title} >
                    {strings("SeedConfirmView.confirmSeed")}
                </Text>
                <Text style={style.description}>
                    {strings("SeedConfirmView.inputSeed")}
                </Text>
                <View style={style.seedContainer}>
                    <TextInput
                        multiline={true}
                        placeholder={strings("SeedConfirmView.placeholder")}
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