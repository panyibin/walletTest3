import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput
} from 'react-native';

const { WalletManager } = NativeModules;

export default class CreatePasswordView extends Component {
    static defaultProps = {
        modalVisible: 'false'
    };

    constructor(props) {
        super(props);
        this.state = {
            pinCode: "",
            pinCodeConfirm: "",
            pinCodeHint:""
        };
    }

    async tapCreate() {
        var pinCode = this.state.pinCode;
        var pinCodeConfirm = this.state.pinCodeConfirm;
        if (pinCode.length != 6) {
            Alert.alert("pin code must be 6 digits");
        } else if (pinCode != pinCodeConfirm) {
            Alert.alert("the pin codes you input aren't the same");
        } else {
            console.log('create wallet');
            var success = await WalletManager.createPinCode(pinCode);

            if (success) {
                // Alert.alert('create wallet success');
                if (typeof (this.props.onPressCreate) != 'undefined') {
                    this.props.onPressCreate();
                }

            } else {
                Alert.alert('fail to create pin code');
            }
        }
    }

    render() {
        return (
            <Modal visible={this.props.modalVisible} transparent={true}>
                <View style={style.background}>
                    <View style={style.container}>
                    <Text style={style.title}>Wallet password</Text>
                    <Text style={style.description}>Please create a password for your wallet, the password will be used for transaction and removing wallet.</Text>
                        <Text style={style.passwordTitle}>Enter password(6 digits)</Text>
                        <TextInput 
                        style={style.passwordInput}
                        secureTextEntry={true}
                        onChangeText={
                            text => {
                                this.setState({ pinCode: text });
                            }
                        }
                        placeholder={'Please input password'}
                        ></TextInput>
                        <View style={style.seperator}/>
                        <Text style={style.passwordTitle}>Confirm password</Text>
                        <TextInput
                        style={style.passwordInput} 
                        secureTextEntry={true}
                        placeholder={'Please confirm password'}
                        onChangeText={
                            text => {
                                this.setState({ pinCodeConfirm: text });
                            }
                        }></TextInput>
                        <View style={style.seperator}/>
                        <Text style={style.passwordTitle}>Hint(optional)</Text>
                        <TextInput 
                        style={style.passwordInput}
                        placeholder={'Please input hint'}
                        onChangeText={
                            text => {
                                this.setState({ pinCodeHint: text });
                            }
                        }></TextInput>
                        <View style={style.seperator}/>
                        <Text style={style.passwordHintDescription}>We won't store your password, you can't find your password if you forget it. You can set a hint in case you forget your password.</Text>
                        <TouchableOpacity 
                        style={style.createButton}
                        onPress={
                            () => {
                                this.tapCreate();
                            }
                        }>
                            <Text style={style.createButtonText}>
                                create
                                </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

const style = StyleSheet.create(
    {
        background: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)'
        },
        container: {
            width: 292,
            height: 510,
            backgroundColor: 'white'
        },
        //
        title:{
            marginTop:24,
            fontSize:17,
            fontWeight:'bold',
            color:'#414042',
            textAlign:'center'
        },
        description:{
            fontSize:11,
            color:'#6d6f71',
            marginTop:18,
            marginLeft:20,
            marginRight:20
        },
        passwordTitle:{
            marginTop:20,
            marginLeft:20,
            fontSize:13,
            color:'#414042'
        },
        passwordInput:{
            marginTop:20,
            marginLeft:20
        },
        seperator:{
            marginTop:14,
            marginLeft:20,
            marginRight:20,
            height:0.5,
            backgroundColor:'black'
        },
        passwordHintDescription:{
            marginTop:18,
            fontSize:11,
            color:'#6d6f71',
            marginLeft:20,
            marginRight:20
        },
        createButton:{
            marginTop:26,
            marginLeft:20,
            marginRight:20,
            height:40,
            borderColor:'#414042',
            borderWidth:0.5,
            justifyContent:'center'
        },
        createButtonText:{
            fontSize:17,
            fontWeight:'bold',
            color:'#414042',
            textAlign:'center'
        }

    }
);