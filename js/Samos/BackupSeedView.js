import React, { Component } from 'react';
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    EventEmitter
} from 'react-native';
import LoadingView from './loading';
import { strings } from './i18n';

const { WalletManager, NavigationHelper } = NativeModules;

export default class BackSeedView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seed: "",
            loading: false
        };
    }

    static navigationOptions = ({ navigation }) => {
        return (
            {
                title: 'back up mnomonic',
            }
        );
    };

    componentDidMount() {
        let seed = this.props.navigation.getParam('seed');
        this.setState({ seed: seed });
    }

    render() {
        const { navigation } = this.props;

        return (
            <View style={style.container}>
                <LoadingView loading={this.state.loading}></LoadingView>
                <Text style={style.title} >
                    {strings('BackupSeedView.title')}
                </Text>
                <Text style={style.description}>
                    {strings('BackupSeedView.description')}
                </Text>
                <View style={style.seedContainer}>
                    <Text style={style.seed}>
                        {this.state.seed}
                    </Text>
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: '#2f3239'
        },
        title: {
            marginTop: 50,
            fontSize: 17,
            textAlign: 'center',
            color: '#efeeda'
        },
        description: {
            marginTop: 26,
            marginLeft: 25,
            marginRight: 25,
            fontSize: 12,
            textAlign: 'center',
            color: '#efeeda'
        },
        seedContainer: {
            marginTop: 26,
            marginLeft: 25,
            marginRight: 25,
            borderWidth: 0.5,
            borderColor: '#efeeda'
        },
        seed: {
            fontSize: 17,
            color: '#efeeda',
            marginLeft: 25,
            marginTop: 38,
            marginRight: 25,
            marginBottom: 38
        }
    }
);