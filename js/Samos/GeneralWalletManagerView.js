import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';

const { WalletManager } = NativeModules;

export default class GeneralWalletManagerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordViewVisible: false
        };
    }

    componentDidMount() {
        // this.showPasswordViewIfNeeded();
    }

    async showPasswordViewIfNeeded() {
        var bExist = await WalletManager.hasPinCode();
        if (!bExist) {
            this.setState({ passwordViewVisible: true });
        }
    }

    render() {
        const {navigation} = this.props;
        return (
            <View style={style.container}>
                <Text>
                GeneralWalletManagerView
                </Text>
                <TouchableOpacity onPress={
                    () => {
                        // Alert.alert('New wallet');
                        navigation.navigate('NameWalletView');
                    }
                }>
                    <Text>
                        New Wallet
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={
                    () => {
                        Alert.alert('Import wallet');
                    }
                }>
                    <Text>
                        Import Wallet
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