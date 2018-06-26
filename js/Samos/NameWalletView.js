import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';

const { WalletManager } = NativeModules;

export default class NameWalletView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletName: "google"
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
        const { navigation } = this.props;
        return (
            <View style={style.container}>
                <Text>
                    Name Wallet
                </Text>
                <TextInput onChangeText={
                    text=>{
                        this.setState({walletName:text});
                    }
                }></TextInput>
                <TouchableOpacity onPress={
                    () => {
                        navigation.navigate('SeedView',{walletName:this.state.walletName});
                    }
                }>
                    <Text>
                        next
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={
                    () => {
                        Alert.alert('Import wallet');
                    }
                }>
                    <Text>

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