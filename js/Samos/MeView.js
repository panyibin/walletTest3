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

export default class MeView extends Component {
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
                    TBD
                </Text>                   
            </View>
        );
    }
}

const style = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems:'center',
            backgroundColor: '#fcfbf0'
        }
    }
);