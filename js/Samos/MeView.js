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
    ScrollView
} from 'react-native';
import { getStatusBarHeight, getScreenWidth } from '../utils';
import LoadingView from './loading';

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
        };
    }

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
                        </View>
                        <View style={style.topBarPlaceholder}>
                            <Text style={style.generalWalletTitle}>Me</Text>
                        </View>
                        <View style={style.topBarPlaceholder} />
                    </View>
                    <View style={style.generalWalletImageContainer} >
                        <Image style={style.generalWalletImage} source={require('./images/钱包设置.png')} />
                        <Text style={style.totalAssets}>Wallet Management</Text>
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={()=>{
                        Alert.alert('Samos v1.0','Samos is a safe digital assets management app. Easy to use.');
                    }}>
                    <Text style={style.aboutUS} >About us</Text>
                    </TouchableOpacity>
                    <View style={style.seperator}/>
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
        aboutUS:{
            marginTop:20,
            fontSize:15,
            marginLeft: 20,
            color:'#414042'
        },
        seperator:{
            marginTop:10,
            marginLeft: 20,
            marginRight: 20,
            height: 0.5,
            backgroundColor: '#414042'
        }
    }
);