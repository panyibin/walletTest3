import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput,
    Modal,
    StyleSheet,
    NativeModules
} from 'react-native';
import Wallet from '../Wallet';
import { strings } from './i18n';

const { WalletManager } = NativeModules;

//callback 'success' if the password is right
export default class InputPasswordView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            pinCodeHint:""
        };
    }

    static defaultProps = {
        onPressConfirm: () => { },
        onPressBack: () => { },
        visible: false
    };

    async tapConfirmButton() {
        let localPassword = await WalletManager.getLocalPinCode();
        if (this.state.password == localPassword) {
            this.props.onPressConfirm('success');
        } else {
            this.props.onPressConfirm('fail');
        }
    }

    componentDidMount() {
        this.getPinCodeHint();
    }

    async getPinCodeHint(){
        let pinCodeHint = await WalletManager.getPinCodeHint();
        this.setState({pinCodeHint:pinCodeHint});
    }

    render() {
        return (
            <Modal visible={this.props.visible} transparent={true}>
                <View style={style.background}>
                    <TouchableOpacity
                        style={style.dark}
                        onPress={
                            () => {
                                this.props.onPressBack();
                            }
                        }>
                        <View />
                    </TouchableOpacity>
                    <View style={style.container}>
                        <View style={style.titleContainer}>
                            <View style={style.titleSidePlaceHolder}>
                                <TouchableOpacity onPress={
                                    () => {
                                        this.props.onPressBack();
                                    }
                                }>
                                    <Image
                                        style={style.back}
                                        source={require('./images/返回.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={style.titlePlaceHolder}>
                                <Text style={style.title}>{strings('InputPasswordView.title')}</Text>
                            </View>
                            <View style={style.titleSidePlaceHolder} />
                        </View>
                        <Text style={style.password}>{strings('InputPasswordView.password')}</Text>
                        <TextInput
                            style={style.textInput}
                            secureTextEntry={true}
                            placeholder={strings('InputPasswordView.placeholder')}
                            placeholderTextColor={'#aaaaaa'}
                            onChangeText={
                                (text) => {
                                    this.setState({ password: text });
                                }
                            } />
                        <View style={style.seperator} />
                        <Text style={style.pinCodeHint}>{strings('InputPasswordView.passwordHint')}{this.state.pinCodeHint}</Text>
                        <TouchableOpacity
                            style={style.button}
                            onPress={
                                () => {
                                    // this.props.onPressConfirm(this.state.password);
                                    this.tapConfirmButton();
                                }
                            }
                        >
                            <Text style={style.buttonText}>{strings('InputPasswordView.confirm')}</Text>
                        </TouchableOpacity>
                        <Text style={style.description}>{strings('InputPasswordView.hint')}</Text>
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
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end'
        },
        dark: {//the dark part
            flex: 1
        },
        container: {
            height: 300,
            backgroundColor: '#fcfbf0'
        },
        titleContainer: {
            marginTop: 16,
            flexDirection: 'row',
            alignItems: 'center'
        },
        titleSidePlaceHolder: {//used to center the title
            flex: 1
        },
        titlePlaceHolder: {//used to center the title
            flex: 2
        },
        back: {
            marginLeft: 15,
            width: 20,
            height: 18
        },
        title: {
            fontSize: 17,
            color: '#414042',
            textAlign: 'center'
        },
        password: {
            marginLeft: 25,
            marginTop: 35,
            fontSize: 13,
            color: '#414042'
        },
        textInput: {
            marginLeft: 25,
            marginRight: 25,
            marginTop: 24
        },
        seperator: {
            marginLeft: 25,
            marginRight: 25,
            marginTop: 14,
            backgroundColor: '#414042',
            height: 0.5
        },
        pinCodeHint:{
            marginTop:10,
            marginLeft:25,
            color: '#6d6f71',
            fontSize:13,
        },
        button: {
            marginTop: 40,
            marginLeft: 25,
            marginRight: 25,
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
        description: {
            marginTop: 20,
            marginLeft: 25,
            marginRight: 25,
            fontSize: 11,
            color: '#6d6f71'
        }
    }
);