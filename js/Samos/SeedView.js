import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import LoadingView from './loading';

const { WalletManager } = NativeModules;
const { NavigationHelper } = NativeModules;

export default class SeedView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seed: "",
            loading:false
        };
    }

    componentDidMount() {
        this.setDefaultSeed();
    }

    async setDefaultSeed() {
        var defaultSeed = await WalletManager.getSeed();
        if (defaultSeed) {
            this.setState({ seed: defaultSeed });
        }
    }

    async createWallet() {
        this.setState({loading:true});
        var walletName = this.props.navigation.getParam('walletName');
        var seed = this.state.seed;
        var pinCode = await WalletManager.getPinCode();

        var success = await WalletManager.createNewWallet(walletName, seed, pinCode);
        
        if(success) {
            this.setState({loading:false});    
            // Alert.alert('success');
            NavigationHelper.rn_resetToMainPage();
        } else {
            this.setState({loading:false});
        //   Alert.alert('fail to create wallet');
        }
    }

    render() {
        const {navigation} = this.props;

        return (
            <View style={style.container}>
            <LoadingView loading={this.state.loading}></LoadingView>
                <Text>
                    Seed View
                </Text>
                <Text>
                walletName:{navigation.getParam('walletName')}
                </Text>
                <Text>
                    {this.state.seed}
                </Text>
                <TouchableOpacity onPress={
                    () => {
                        // Alert.alert('create');
                        this.setDefaultSeed();
                    }
                }>
                    <Text>
                        Generate Seed
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={
                    () => {
                        // Alert.alert('Import wallet');
                        // NavigationHelper.rn_resetToMainPage();
                        this.createWallet();
                    }
                }>
                    <Text>
                        Create
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const style = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'red'
        }
    }
);