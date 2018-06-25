import React, { Component } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Modal
} from 'react-native';

export class LoadingView extends Component {
    static defaultProps = {
        loading: false
    };

    render() {
        return (
            <Modal visible={this.props.loading} transparent={true}>
                <View style={style.background}>
                    <ActivityIndicator size='large' style={style.activityIndicator} animating={true} />
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
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        activityIndicator: {
            width: 100,
            height: 100,
            backgroundColor: 'black',
            borderRadius: 10
        }
    }
);