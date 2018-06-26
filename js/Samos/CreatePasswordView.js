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
            pinCodeConfirm: ""
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
                        <Text>Enter password</Text>
                        <TextInput onChangeText={
                            text => {
                                this.setState({ pinCode: text });
                            }
                        }
                        ></TextInput>
                        <Text>Confirm password</Text>
                        <TextInput onChangeText={
                            text => {
                                this.setState({ pinCodeConfirm: text });
                            }
                        }></TextInput>
                        <TouchableOpacity onPress={
                            () => {
                                Alert.alert(this.state.pinCode);
                            }
                        }>
                            <Text>
                                show password
                                </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={
                            () => {
                                this.tapCreate();
                            }
                        }>
                            <Text>
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
            width: 200,
            height: 200,
            backgroundColor: 'green'
        }
    }
);