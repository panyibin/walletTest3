import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal
} from 'react-native';

export default class CreatePasswordView extends Component {
    static defaultProps = {
        modalVisible: 'false'
    };

    render() {
        return (
            <Modal visible={this.props.modalVisible} transparent={true}>
                <View style={style.background}>
                    <View style={style.container}>
                        <Text>Enter password</Text>
                        <TouchableOpacity onPress={
                            () => {
                                Alert.alert('password not match');
                            }
                        }>
                            <Text>
                                confirm password
                                </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={
                            () => {
                                // Alert.alert('google');
                                if(typeof(this.props.onPressCreate) != 'undefined') {
                                    this.props.onPressCreate();
                                }                                
                            }
                        }>
                            <Text>
                                close
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