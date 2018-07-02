import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Clipboard
} from 'react-native';

import QRCodeView from './QRCodeView'

const { WalletManager } = NativeModules;

export default class ReceiveCoinDetailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetAddress: '',
            walletModel: {}
        };
    }

    static navigationOptions = ({ navigation }) => {
        let walletModel = navigation.getParam('walletModel', {});
        let title = 'Receive ' + walletModel.walletType;
        return ({
            title: title,
        });
    };

    componentDidMount() {
        const { navigation } = this.props;
        let targetAddress = navigation.getParam('targetAddress', '');
        let walletModel = navigation.getParam('walletModel', {});
        this.setState({
            targetAddress: targetAddress,
            walletModel: walletModel
        });
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={style.container}>
                <Text style={style.targetAddress}>
                    {this.state.targetAddress}
                </Text>
                <View style={style.qrCodeViewContainer} >
                <QRCodeView style={style.qrCodeView} qrCodeString={this.state.targetAddress} />
                </View>
                <TouchableOpacity
                    style={style.button}
                    onPress={
                        () => {
                            Clipboard.setString(this.state.targetAddress);
                            Alert.alert('address copied');
                        }
                    }>
                    <Text style={style.buttonText}>Copy Address</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const style = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: '#fcfbf0',
            // alignItems:'center',            
        },
        targetAddress: {
            marginTop:30,
            fontSize: 15,
            color: '#414042',
            textAlign:'center'
        },
        qrCodeViewContainer:{
            alignItems:'center'
        },
        qrCodeView: {
            width: 250,
            height: 250,
            marginTop: 30,
            alignItems: 'center',
            backgroundColor: 'red'
        },
        //bottom button
        button: {
            marginTop: 100,
            marginLeft: 25,
            marginRight: 25,
            marginBottom: 30,
            height: 40,
            borderWidth: 0.5,
            borderColor: '#414042',
            justifyContent: 'center'
        },
        buttonText: {
            fontSize: 17,
            color: '#414042',
            textAlign: 'center'
        },
    }
);