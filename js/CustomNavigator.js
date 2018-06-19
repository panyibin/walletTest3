import React,{Component} from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

import {
    isiPhoneX,
    getStatusBarHeight,
    getScreenWidth
} from './utils';

var navigationHelper = NativeModules.NavigationHelper;

export default class CustomNavigator extends Component {
    static propTypes = {
        title:PropTypes.string.isRequired,
        hasBackButton:PropTypes.bool,
        backgroundColor:PropTypes.string
    };

    static defaultProps = {
        title:'',
        hasBackButton:false,
        backgroundColor:'transparent',
    };

    render () {
        var styles = this.createStyle();
        return (
            <View style={styles.topView}>
                <Text style={styles.pageTitle}>
                    {this.props.title}
                </Text>
                {this.props.hasBackButton &&
                    <TouchableOpacity
                        style={{ position: 'absolute', marginLeft: 10, marginTop: (getStatusBarHeight() + 10) }}
                        onPress={() => {
                            navigationHelper.popViewControllerAnimated(true);
                        }} >
                        <Image source={require('./images/arrow-left.png')} style={{ width: 27, height: 27 }} />
                    </TouchableOpacity>
                }
                {this.props.onPressMore &&
                    <TouchableOpacity
                        style={{ position: 'absolute', marginLeft: (getScreenWidth() - 40), marginTop: (getStatusBarHeight() + 10) }}
                        onPress={() => {
                            this.props.onPressMore();
                        }} >
                        <Image source={require('./images/more-horizontal.png')} style={{ width: 27, height: 27 }} />
                    </TouchableOpacity>
                }
            </View>
        );
    }

    createStyle(){
        var styles = StyleSheet.create({
            topView: {
                height: (isiPhoneX() ? 88 : 64),
                backgroundColor:(this.props.backgroundColor),
            },
            pageTitle: {
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: (isiPhoneX() ? 54 : 30),
                color: 'white'
            },
        });
    
        return styles;
    }
}