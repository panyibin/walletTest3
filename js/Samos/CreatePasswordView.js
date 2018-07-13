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

import { strings } from './i18n';

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
            Alert.alert(strings("CreatePasswordView.pinCodeError6Digits"));
        } else if (pinCode != pinCodeConfirm) {
            Alert.alert(strings("CreatePasswordView.pinCodeNotSame"));
        } else {
            console.log('create wallet');
            var success = await WalletManager.createPinCode(pinCode);

            if (success) {
                // Alert.alert('create wallet success');
                if (typeof (this.props.onPressCreate) != 'undefined') {
                    this.props.onPressCreate();
                }

            } else {
                Alert.alert(strings("CreatePasswordView.pinCodeFail"));
            }
        }
    }

    render() {
        return (
            <Modal visible={this.props.modalVisible} transparent={true}>
                <View style={style.background}>
                    <View style={style.container}>
                    <Text style={style.title}>{strings("CreatePasswordView.title")}</Text>
                    <Text style={style.description}>{strings("CreatePasswordView.description")}</Text>
                        <Text style={style.passwordTitle}>{strings("CreatePasswordView.passwordTitle")}</Text>
                        <TextInput 
                        style={style.passwordInput}
                        secureTextEntry={true}
                        onChangeText={
                            text => {
                                this.setState({ pinCode: text });
                            }
                        }
                        placeholder={strings("CreatePasswordView.passwordPlaceHolder")}
                        ></TextInput>
                        <View style={style.seperator}/>
                        <Text style={style.passwordTitle}>{strings("CreatePasswordView.confirmPassword")}</Text>
                        <TextInput
                        style={style.passwordInput} 
                        secureTextEntry={true}
                        placeholder={strings("CreatePasswordView.confirmPasswordPlaceHolder")}
                        onChangeText={
                            text => {
                                this.setState({ pinCodeConfirm: text });
                            }
                        }></TextInput>
                        <View style={style.seperator}/>
                        <Text style={style.passwordTitle}>{strings("CreatePasswordView.hint")}</Text>
                        <TextInput 
                        style={style.passwordInput}
                        placeholder={strings("CreatePasswordView.hintPlaceHolder")}
                        onChangeText={
                            text => {
                                this.setState({ pinCodeHint: text });
                            }
                        }></TextInput>
                        <View style={style.seperator}/>
                        <Text style={style.passwordHintDescription}>{strings("CreatePasswordView.hintDescription")}</Text>
                        <TouchableOpacity 
                        style={style.createButton}
                        onPress={
                            () => {
                                this.tapCreate();
                            }
                        }>
                            <Text style={style.createButtonText}>
                            {strings("CreatePasswordView.create")}
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