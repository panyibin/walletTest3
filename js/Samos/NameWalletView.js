import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    FlatList
} from 'react-native';
import LoadingView from './loading';
import { strings } from './i18n';
import LocalImage from './LocalImage'
const { WalletManager, NavigationHelper } = NativeModules;

export default class NameWalletView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletName: "",
            seed: "",
            loading: false,
            selectAvatar:'avatar1',
            avatarArray:[
            'avatar1','avatar2','avatar3','avatar4',
            'avatar5','avatar6','avatar7','avatar8',
            'avatar9','avatar10','avatar11','avatar12',]
        };
    }

    static navigationOptions = ({ navigation }) => {
        let previousView = navigation.getParam('previousView', '');
        let action = navigation.getParam('action', 'create');
        let rightText = '';
        let title = '';
        if (action == 'create') {
            title = strings("NameWalletView.newWallet");
            rightText = strings("NameWalletView.nextText");
        } else {
            rightText = strings("NameWalletView.importText");
            title = strings("NameWalletView.importWallet");
        };

        return (
            {
                title: title,
                headerLeft: (
                    <TouchableOpacity
                        style={
                            {
                                width: 70,
                                height: 15
                            }
                        }
                        onPress={
                            () => {
                                //Alert.alert(typeof(previousView));
                                if (previousView == 'GeneralWalletManagerView' || previousView == 'WelcomeView') {
                                    navigation.goBack();
                                } else {
                                    NavigationHelper.popViewControllerAnimated(true);
                                }
                            }
                        }>
                        <Image
                            style={{ width: 15, height: 20, marginLeft: 10 }}
                            source={require('./images/返回.png')}
                        /></TouchableOpacity>
                ),
                headerRight: (<Text
                    style={{ marginRight: 20, fontSize: 20 }}
                    onPress={navigation.getParam('tapNavigationRightButton')}
                >
                    {rightText}
                </Text>)
            }
        );
    };

    componentDidMount() {
        this.props.navigation.setParams({ tapNavigationRightButton: this.tapNavigationRightButton.bind(this) });
        console.log('LocalImage.avatar1');
        console.log(LocalImage.avatar1);
    }

    async tapNavigationRightButton() {
        // Alert.alert('tap right button');
        let currentWalletName = this.state.walletName;
        let action = this.props.navigation.getParam('action', 'create');
        const { navigation } = this.props;

        if (currentWalletName.length == 0) {
            Alert.alert(strings("NameWalletView.walletNameCannotEmpty"));
            return;
        }

        if (action == 'create') {
            navigation.push('SeedView', { walletName: currentWalletName, avatar:this.state.selectAvatar });
        } else if (action == 'import') {
            var seed = this.state.seed;
            if (seed.length == 0) {
                Alert.alert(strings("NameWalletView.seedCannotEmpty"));
                return;
            }

            this.setState({ loading: true });
            var walletName = currentWalletName;
            var avatar = this.state.selectAvatar;
            var pinCode = await WalletManager.getLocalPinCode();
            var success = await WalletManager.createNewWallet(walletName, seed, pinCode, avatar);

            if (success) {
                this.setState({ loading: false });
                // Alert.alert('success');
                NavigationHelper.rn_resetToMainPage();
            } else {
                this.setState({ loading: false });
                //avoid conflicts with modal loading
                setTimeout(() => {
                    Alert.alert(strings("NameWalletView.failToCreateWallet"));
                }, 500);
            }
        } else {

        }

    }

    render() {
        const { navigation } = this.props;
        let bShouldShowSeedInput = false;
        let action = navigation.getParam('action', 'create');
        if (action == 'import') {
            bShouldShowSeedInput = true;
        }

        return (
            <View style={style.container}>
                <LoadingView loading={this.state.loading} />
                {bShouldShowSeedInput &&
                    <View>
                        <Text style={style.walletName}>
                        {strings("NameWalletView.inputSeed")}
                </Text>
                        <TextInput
                            multiline={true}
                            placeholder={strings("NameWalletView.inputSeedPlaceHolder")}
                            placeholderTextColor={'#6d6f71'}
                            // color={'blue'}
                            style={style.walletNameInput}
                            onChangeText={
                                text => {
                                    this.setState({ seed: text });
                                    navigation.setParams({ seed: text });
                                }
                            }></TextInput>
                        <View style={style.seperator} />
                    </View>
                }
                <View>
                    <Text style={style.walletName}>
                    {strings("NameWalletView.walletName")}
                </Text>
                    <TextInput
                        multiline={true}
                        placeholder={strings("NameWalletView.inputWalletName")}
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
                </View>
                <Text style={style.walletName} >{strings("NameWalletView.walletAvatar")}</Text>
                <Image
                    style={style.walletImage}
                    source={LocalImage[this.state.selectAvatar]} />
                    <Text style={style.selectAvatarHint}>Select an avatar</Text>
                    <FlatList 
                    style={style.flatlist}
                    numColumns = {4}
                    data={this.state.avatarArray}
                    renderItem={({item})=>{
                        return(
                            <View>
                                <TouchableOpacity onPress={()=>{
                                    this.setState({selectAvatar:item});
                                }}>
                                <Image style={style.avatar} source={LocalImage[item]}/>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    />
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
        walletName: {
            fontSize: 13,
            marginLeft: 25,
            marginTop: 20,
            color: '#efeeda'
        },
        walletNameInput: {
            marginTop: 20,
            marginLeft: 25,
            marginRight: 25,
            color: '#efeeda'
        },
        seperator: {
            marginTop: 10,
            marginLeft: 25,
            marginRight: 25,
            height: 0.5,
            backgroundColor: '#efeeda'
        },
        walletImage: {
            marginLeft: 25,
            marginTop: 10,
            width: 60,
            height: 60
        },
        selectAvatarHint:{
            fontSize: 13,
            marginLeft: 25,
            marginTop: 20,
            color: '#efeeda'
        },
        flatlist:{
            // marginTop:0,
            marginLeft:25,
            marginRight:25
        },
        avatar:{
            marginRight:20,
            marginTop:20,
            width:60,
            height:60
        }
    }
);