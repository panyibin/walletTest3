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
import { strings, setLanguage } from './i18n'

const { WalletManager, NavigationHelper, WalletEventEmitter } = NativeModules;
const wallManagerEmitter = new NativeEventEmitter(WalletEventEmitter);
var subscription;

type Props = {};
export default class AboutUsView extends Component<Props> {
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
            displayLanguage: 'English',
            currencyUnit: 'USD'
        };
    }

    static navigationOptions = ({ navigation }) => {
        return (
            {
                // title:strings('AboutUsView.title'),
                header: null
            }
        );
    };

    componentDidMount() {
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={style.container}>
                <LoadingView loading={this.state.loading} />
                <View style={style.topContainer}>
                    <View style={style.topBar}>
                        <View style={style.topBarPlaceholder}>
                            <TouchableOpacity onPress={
                                () => {
                                    navigation.goBack();
                                }
                            }>
                                <Image style={style.back} source={require('./images/返回.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={style.topBarPlaceholder}>
                            <Text style={style.generalWalletTitle}>{strings('AboutUsView.title')}</Text>
                        </View>
                        <View style={style.topBarPlaceholder} />
                    </View>
                    <View style={style.generalWalletImageContainer} >
                        <Image style={style.logo}
                            source={require('./images/logo.png')}
                        />
                        <View style={style.versionContainer}>
                            <Text style={style.version}>1.0</Text>
                        </View>
                        <Text style={style.introduction}>{strings('AboutUsView.description')}</Text>
                    </View>
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
        back: {
            width: 20,
            height: 20,
            marginLeft: 20,
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
        logo: {
            marginTop: 20,
            width: 180,
            height: 63
        },
        introduction: {
            color: '#efeeda',
            fontSize: 12,
            marginTop: 32,
            marginBottom: 30,
            marginLeft:55,
            marginRight:55,
            textAlign:'center'
        },
        seperator: {
            marginTop: 10,
            marginLeft: 20,
            marginRight: 20,
            height: 0.5,
            backgroundColor: '#414042'
        },
        versionContainer: {            
            width:80,
            height:30,
            marginTop:20,
            borderWidth:0.5,
            justifyContent:'center',
            borderColor:'#efeeda'
        },
        version: {
            color: '#efeeda',
            fontSize: 12,
            textAlign:'center',
        }
    }
);