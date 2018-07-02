import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';

import InputPasswordView from './InputPasswordView';
import LoadingView from './loading';

const { WalletManager } = NativeModules;

export default class GeneralWalletManagerDetailView
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backupSeedPasswordViewVisible: false,//used to show the password view for seed
            deleteWalletPasswordViewVisible: false,//used to show the password view for deleteWallet
            loading: false,
            walletId:{},
        };
    }

    static navigationOptions = ({ navigation }) => {
        let walletModel = navigation.getParam('walletModel', {});
        return ({
            title: walletModel.walletName,
        });
    };

    componentDidMount() {
        let walletModel = this.props.navigation.getParam('walletModel', {});
        this.setState({walletModel:walletModel});
    }

    async tapBackupSeedsButton() {
        this.setState({ backupSeedPasswordViewVisible: true });
    }

    async tapDeleteWalletButton() {
        // let generalWalletArray = await WalletManager.getLocalWalletDictArray();
        
        // Alert.alert(generalWalletArray.count);
        this.setState({ deleteWalletPasswordViewVisible: true });
    }

    async _onPressBackupSeedPasswordConfirm(state) {
        const { navigation } = this.props;

        if(state == 'success') {
            this.setState({ backupSeedPasswordViewVisible: false });
            navigation.push('BackupSeedView',{seed:this.state.walletModel.seed});
        } else {
            Alert.alert('the password is not valid');
        }
    }

    async _onPressDeleteWalletPasswordConfirm(state) {
        const { navigation } = this.props;
        if(state == 'success') {            
            this.setState({ deleteWalletPasswordViewVisible: false });
            await WalletManager.removeWallet(this.state.walletModel.walletId);
            // navigation.getParam('refreshWalletList')();
            navigation.goBack();
        } else {
            Alert.alert('the password is not valid');
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
                        source={require('./images/钱包0.png')} />
                </View>
                <View style={style.bottomButtonsContainer}>
                    <TouchableOpacity
                        style={style.button}
                        onPress={
                            () => {
                                this.tapBackupSeedsButton();
                            }
                        }>
                        <Text style={style.buttonText}>
                            Backup Seeds
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
                            Delete wallet
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
            width: 100,
            height: 82
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