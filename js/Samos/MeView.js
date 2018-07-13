import React, { Component } from 'react';
import {
    NativeEventEmitter,
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    FlatList,
    RefreshControl,
    ScrollView,
    ActionSheetIOS
} from 'react-native';
import { getStatusBarHeight, getScreenWidth } from '../utils';
import LoadingView from './loading';
import {strings, setLanguage} from './i18n'

const { WalletManager, NavigationHelper, WalletEventEmitter } = NativeModules;
const wallManagerEmitter = new NativeEventEmitter(WalletEventEmitter);
var subscription;

type Props = {};
export default class MeView extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            wallet: { subWalletArray: [] },
            subWalletArray: [],
            totalBalance: 0,
            refreshControlLoading: false,
            samosPriceUSD: 0.19,
            skyPriceUSD: 5.82,
            displayLanguage: 'en'
        };
    }

    componentDidMount() {
        this.getCurrentLanguage();
    }

    async getCurrentLanguage() {
        let currentLanguage = await WalletManager.getCurrentLanguage();
        let displayLanguage = 'English';
        if(currentLanguage == 'zh') {
            displayLanguage = '中文';
        } else {
            displayLanguage = 'English';
        }

        this.setState({ displayLanguage: displayLanguage });
        setLanguage(currentLanguage);
    }

    async selectLanguage() {
        let buttons = ['English', '中文', 'Cancel'];
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options:buttons,
                cancelButtonIndex:buttons.length - 1,
            },
            (buttonIndex)=>{
                if(buttonIndex == 0) {                    
                    setLanguage('en');
                    this.setState({displayLanguage:'English'});
                    WalletManager.setCurrentLanguage('en');
                    NavigationHelper.rn_resetToMainPage();
                } else if(buttonIndex == 1) {                    
                    setLanguage('zh');
                    this.setState({displayLanguage:'中文'});
                    WalletManager.setCurrentLanguage('zh');
                    NavigationHelper.rn_resetToMainPage();
                }
            }
        );
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={style.container}>
                <LoadingView loading={this.state.loading} />
                <View style={style.topContainer}>
                    <View style={style.topBar}>
                        <View style={style.topBarPlaceholder}>
                        </View>
                        <View style={style.topBarPlaceholder}>
                            <Text style={style.generalWalletTitle}>{strings('Me.me')}</Text>
                        </View>
                        <View style={style.topBarPlaceholder} />
                    </View>
                    <View style={style.generalWalletImageContainer} >
                        <Image style={style.generalWalletImage} source={require('./images/钱包设置.png')} />
                        <Text style={style.totalAssets}>{strings('Me.walletManagement')}</Text>
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={() => {
                        Alert.alert(strings('Me.introTitle'),strings('Me.intro'));
                    }}>
                        <Text style={style.aboutUS} >{strings('Me.aboutUS')}</Text>
                    </TouchableOpacity>
                    <View style={style.seperator} />
                </View>
                <View>
                    <TouchableOpacity onPress={() => {
                        // Alert.alert('Language');
                        this.selectLanguage();
                    }}>
                    <View style={style.languageContainer}>
                        <Text style={style.aboutUS} >{strings('Me.language')}</Text>
                        <Text style={style.currentLanguage}>{this.state.displayLanguage}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={style.seperator} />
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            backgroundColor: '#fcfbf0',
        },
        //top bar
        topContainer: {
            backgroundColor: '#393e3f',
        },
        topBar: {
            flexDirection: 'row',
            height: 50,
            marginTop: getStatusBarHeight(),
            // backgroundColor: 'red',
            // justifyContent:'space-between'
        },
        //topBarPlaceholder:used to center the title
        topBarPlaceholder: {
            flex: 1
        },
        menuIcon: {
            width: 24,
            height: 24,
            marginLeft: 25,
            marginTop: 13,
            // backgroundColor: 'green'
        },
        generalWalletTitle: {
            // backgroundColor: 'purple',
            fontSize: 17,
            marginTop: 17,
            textAlign: 'center',
            color: '#efeeda',
            fontWeight: 'bold'
        },
        generalWalletImageContainer: {
            alignItems: 'center'
        },
        generalWalletImage: {
            marginTop: 20,
            width: 65,
            height: 57
        },
        totalAssets: {
            color: '#efeeda',
            fontSize: 12,
            marginTop: 32,
            marginBottom: 30
        },
        aboutUS: {
            marginTop: 20,
            fontSize: 15,
            marginLeft: 20,
            color: '#414042'
        },
        seperator: {
            marginTop: 10,
            marginLeft: 20,
            marginRight: 20,
            height: 0.5,
            backgroundColor: '#414042'
        },
        languageContainer:{
            flexDirection:'row',
            justifyContent:'space-between'
        },
        currentLanguage:{
            marginTop: 20,
            fontSize: 15,
            marginRight: 25,
            color: '#414042'
        }
    }
);