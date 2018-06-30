import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';
import LoadingView from './loading';
const { WalletManager, NavigationHelper } = NativeModules;

export default class NameWalletView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletName: "",
            seed: "",
            loading: false
        };
    }

    static navigationOptions = ({ navigation }) => {
        let previousView = navigation.getParam('previousView', '');
        let action = navigation.getParam('action', 'create');
        let rightText = '';
        if (action == 'create') {
            rightText = 'next';
        } else {
            rightText = 'import';
        };

        return (
            {
                title: 'New Wallet',
                headerLeft: (
                    <TouchableOpacity
                        onPress={
                            () => {
                                if (previousView == 'GeneralWalletManagerView') {
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
                headerRight: (<Text
                    style={{ marginRight: 20, fontSize: 20 }}
                    onPress={navigation.getParam('tapNavigationRightButton')}
                >
                    {rightText}
                </Text>)
            }
        );
    };

    componentDidMount() {
        this.props.navigation.setParams({ tapNavigationRightButton: this.tapNavigationRightButton.bind(this) });
    }

    async tapNavigationRightButton() {
        // Alert.alert('tap right button');
        let currentWalletName = this.state.walletName;
        let action = this.props.navigation.getParam('action', 'create');
        const { navigation } = this.props;

        if (currentWalletName.length == 0) {
            Alert.alert('wallet name cannot be empty');
            return;
        }

        if (action == 'create') {
            navigation.push('SeedView', { walletName: currentWalletName });
        } else if (action == 'import') {
            var seed = this.state.seed;
            if (seed.length == 0) {
                Alert.alert("seed can't be empty");
                return;
            }

            this.setState({ loading: true });
            var walletName = currentWalletName;
            var pinCode = await WalletManager.getPinCode();
            var success = await WalletManager.createNewWallet(walletName, seed, pinCode);

            if (success) {
                this.setState({ loading: false });
                // Alert.alert('success');
                NavigationHelper.rn_resetToMainPage();
            } else {
                this.setState({ loading: false });
                //avoid conflicts with modal loading
                setTimeout(() => {
                    Alert.alert('fail to create wallet');
                }, 500);
            }
        } else {

        }

    }

    render() {
        const { navigation } = this.props;
        let bShouldShowSeedInput = false;
        let action = navigation.getParam('action', 'create');
        if (action == 'import') {
            bShouldShowSeedInput = true;
        }

        return (
            <View style={style.container}>
                <LoadingView loading={this.state.loading} />
                {bShouldShowSeedInput &&
                    <View>
                        <Text style={style.walletName}>
                            Please input seed
                </Text>
                        <TextInput
                            multiline={true}
                            placeholder={"Please input seed"}
                            placeholderTextColor={'#6d6f71'}
                            // color={'blue'}
                            style={style.walletNameInput}
                            onChangeText={
                                text => {
                                    this.setState({ seed: text });
                                    navigation.setParams({ seed: text });
                                }
                            }></TextInput>
                        <View style={style.seperator} />
                    </View>
                }
                <View>
                    <Text style={style.walletName}>
                        Wallet's Name
                </Text>
                    <TextInput
                        multiline={true}
                        placeholder={"please input wallet's name"}
                        placeholderTextColor={'#6d6f71'}
                        // color={'blue'}
                        style={style.walletNameInput}
                        onChangeText={
                            text => {
                                this.setState({ walletName: text });
                                navigation.setParams({ walletName: text });
                            }
                        }></TextInput>
                    <View style={style.seperator} />
                </View>
                <Text style={style.walletName} >Wallet's Avatar</Text>
                <Image
                    style={style.walletImage}
                    source={require('./images/钱包0.png')} />
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
            marginRight:25,
            color: '#efeeda'
        },
        seperator: {
            marginTop: 10,
            marginLeft: 25,
            marginRight: 25,
            height: 0.5,
            backgroundColor: '#efeeda'
        },
        walletImage: {
            marginLeft: 25,
            marginTop: 30,
            width: 130,
            height: 104
        }
    }
);