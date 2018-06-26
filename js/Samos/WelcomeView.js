import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
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
        return (
            <View style={style.container}>
                <CreatePasswordView modalVisible={this.state.passwordViewVisible}
                    onPressCreate={
                        () => {
                            this.setState({ passwordViewVisible: false });
                        }
                    }
                ></CreatePasswordView>
                <Text>
                    Welcome Page
                </Text>
                <TouchableOpacity onPress={
                    () => {
                        Alert.alert('New wallet');
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