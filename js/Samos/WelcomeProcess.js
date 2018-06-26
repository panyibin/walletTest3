import { createStackNavigator } from 'react-navigation';
import WelcomeView from './WelcomeView';

export default WelcomeProcess = createStackNavigator(
    {
        Home: WelcomeView
    },
    {
        headerMode:'none'
    }
);