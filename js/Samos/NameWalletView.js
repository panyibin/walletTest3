import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';

const { WalletManager, NavigationHelper } = NativeModules;

export default class NameWalletView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletName: "google"
        };
    }

    static navigationOptions = ({ navigation }) => {
        return (
            {
                title: 'New Wallet',
                headerLeft: (
                    <TouchableOpacity
                        onPress={
                            () => {
                                NavigationHelper.popViewControllerAnimated(true);
                            }
                        }>
                        <Image
                            style={{ width: 15, height: 20, marginLeft: 10 }}
                            source={require('./images/返回.png')}
                        /></TouchableOpacity>
                ),
                headerRight: (<Text
                    style={{ marginRight: 20 }}
                    onPress={
                        () => {
                            let params = navigation.state.params;
                            if (typeof (params) == 'undefined') {
                                Alert.alert('wallet name cannot be empty');
                            } else {
                                let name = params.walletName;
                                navigation.navigate('SeedView', { walletName: name });
                            }
                        }
                    }>next</Text>)
            }
        );
    };

    componentDidMount() {
        // this.showPasswordViewIfNeeded();
    }

    async showPasswordViewIfNeeded() {
        var bExist = await WalletManager.hasPinCode();
        if (!bExist) {
            this.setState({ passwordViewVisible: true });
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={style.container}>
                <Text style={style.walletName}>
                    Wallet's Name
                </Text>
                <TextInput 
                placeholder={"please input wallet's name"}
                placeholderTextColor={'#6d6f71'}
                // color={'blue'}
                style={style.walletNameInput}
                onChangeText={
                    text => {
                        this.setState({ walletName: text });
                        navigation.setParams({ walletName: text });
                    }
                }></TextInput>
                <View style={style.seperator} />
                <Text style={style.walletName} >Wallet's Avatar</Text>
                <Image 
                style={style.walletImage}
                source={require('./images/钱包0.png')} />
            </View>
        );
    }
}

const style = StyleSheet.create(
    {
        container: {
            flex: 1,
            // justifyContent: 'center',
            backgroundColor: '#2f3239'
        },
        walletName:{
            fontSize:13,
            marginLeft:25,
            marginTop:20,
            color:'#efeeda'
        },
        walletNameInput:{
            marginTop:20,
            marginLeft:25,
            color:'#efeeda'
        },
        seperator:{
            marginTop:10,
            marginLeft:25,
            marginRight:25,
            height:0.5,
            backgroundColor:'#efeeda'
        },
        walletImage:{
            marginLeft:25,
            marginTop:30,
            width:130,
            height:104
        }
    }
);