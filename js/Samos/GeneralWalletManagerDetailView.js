import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    TextInput
} from 'react-native';

import InputPasswordView from './InputPasswordView';
import LoadingView from './loading';
import {strings} from './i18n';
import LocalImage from './LocalImage'
import Wallet from '../Wallet';

const { WalletManager } = NativeModules;

export default class GeneralWalletManagerDetailView
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backupSeedPasswordViewVisible: false,//used to show the password view for seed
            deleteWalletPasswordViewVisible: false,//used to show the password view for deleteWallet
            loading: false,
            walletId: "",
            walletModel:{},
            newWalletName:"",
            pinCodeHint:"",
        };
    }

    static navigationOptions = ({ navigation }) => {
        let walletModel = navigation.getParam('walletModel', {});
        return ({
            title: walletModel.walletName,
            headerRight:(
            <View>
                <Text
                style={{ marginRight: 20, fontSize: 20 }}
                onPress={navigation.getParam('tapNavigationRightButton')}>Save</Text>
            </View>),
        });
    };

    componentDidMount() {
        this.refreshWallet();
        this.props.navigation.setParams({'tapNavigationRightButton':this.tapNavigationRightButton.bind(this)});
    }

    async refreshWallet(){
        let walletModel = this.props.navigation.getParam('walletModel', {});
        this.setState({ walletModel: walletModel });

        let pinCodeHint = await WalletManager.getPinCodeHint();
        this.setState({
            walletName:walletModel.walletName,
            pinCodeHint:pinCodeHint
        });
    }

    async tapNavigationRightButton(){
        await WalletManager.updateGeneralWalletName(this.state.walletModel.walletId, this.state.walletName, this.state.pinCodeHint);
        this.props.navigation.goBack();
    }

    async tapBackupSeedsButton() {
        this.setState({ backupSeedPasswordViewVisible: true });
    }

    async tapDeleteWalletButton() {
        // let generalWalletArray = await WalletManager.getLocalWalletDictArray();

        // Alert.alert(generalWalletArray.count);
        Alert.alert(strings("GeneralWalletManagerDetailView.doYouWantToDeleteWallet"), '', [
            {
                text: 'OK', onPress:() => {
                    this.setState({ deleteWalletPasswordViewVisible: true });
                }
            },
            {
                text: 'Cancel', onPress:() => { }
            }
        ]);
    }

    async _onPressBackupSeedPasswordConfirm(state) {
        const { navigation } = this.props;

        if (state == 'success') {
            this.setState({ backupSeedPasswordViewVisible: false });
            navigation.push('BackupSeedView', { seed: this.state.walletModel.seed });
        } else {
            Alert.alert(strings("GeneralWalletManagerDetailView.passwordInvalid"));
        }
    }

    async _onPressDeleteWalletPasswordConfirm(state) {
        const { navigation } = this.props;
        if (state == 'success') {
            this.setState({ deleteWalletPasswordViewVisible: false });
            let ret = await WalletManager.removeWallet(this.state.walletModel.walletId);
            if(ret == 'success') {
                navigation.goBack();
            } else {
                Alert.alert(strings("GeneralWalletManagerDetailView.Fail to delete wallet"), ret);
            }
            
        } else {
            Alert.alert(strings("GeneralWalletManagerDetailView.passwordInvalid"));
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={style.container}>
                <InputPasswordView visible={this.state.backupSeedPasswordViewVisible}
                    onPressConfirm={this._onPressBackupSeedPasswordConfirm.bind(this)}
                    onPressBack={
                        () => {
                            this.setState({ backupSeedPasswordViewVisible: false });
                        }
                    }
                />
                <InputPasswordView visible={this.state.deleteWalletPasswordViewVisible}
                    onPressConfirm={this._onPressDeleteWalletPasswordConfirm.bind(this)}
                    onPressBack={
                        () => {
                            this.setState({ deleteWalletPasswordViewVisible: false });
                        }
                    }
                />
                <LoadingView loading={this.state.loading} />
                <View style={style.topContainer}>
                    <Image
                        style={style.generalWalletImage}
                        source={LocalImage[this.state.walletModel.avatar]} />
                </View>
                <Text style={style.title}>Wallet's Name</Text>
                <TextInput style={style.input}
                onChangeText={text=>{
                    this.setState({walletName:text});
                    navigation.setParams({walletName:text});
                }}
                >
                {this.state.walletName}
                </TextInput>
                <View style={style.seperator}/>
                <Text style={style.title}>Hint(optional)</Text>
                <TextInput style={style.input}
                onChangeText={
                    text=>{
                        this.setState({pinCodeHint:text});
                        navigation.setParams({pinCodeHint:text});
                    }
                }
                >
                {this.state.pinCodeHint}
                </TextInput>
                <View style={style.seperator}/>
                <View style={style.bottomButtonsContainer}>
                    <TouchableOpacity
                        style={style.button}
                        onPress={
                            () => {
                                this.tapBackupSeedsButton();
                            }
                        }>
                        <Text style={style.buttonText}>
                            {strings('GeneralWalletManagerDetailView.backupSeed')}
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={style.button}
                        onPress={
                            () => {
                                this.tapDeleteWalletButton();
                            }
                        }>
                        <Text style={style.buttonText}>
                        {strings('GeneralWalletManagerDetailView.deleteWallet')}
                    </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: '#fcfbf0'
        },
        //top container
        topContainer: {
            backgroundColor: '#393e3f',
            justifyContent: 'center',
            alignItems: 'center',
            height: 150,
        },
        generalWalletImage: {
            // marginTop: 30,
            // marginBottom:30,
            width: 80,
            height: 80
        },
        title:{
            marginLeft:25,
            marginTop:20,
            color: '#414042',
        },
        input:{
            marginLeft:25,
            marginTop:20,
            color: '#414042',
        },
        seperator:{
            marginLeft:25,
            marginRight:25,
            marginTop:10,
            height:0.5,
            backgroundColor:"#414042"
        },
        //bottom buttons
        bottomButtonsContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: 20,
            // backgroundColor:'red'
        },
        button: {
            marginTop: 22,
            marginLeft: 25,
            marginRight: 25,
            height: 40,
            borderWidth: 0.5,
            borderColor: '#414042',
            justifyContent: 'center'
        },
        buttonText: {
            fontSize: 17,
            // fontWeight: 'bold',
            color: '#414042',
            textAlign: 'center'
        },
    }
);