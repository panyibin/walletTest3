import {Dimensions, Platform} from 'react-native'
export const isiPhoneX=()=>{
    let d = Dimensions.get('window');
    const {height, width} = d;

    return (Platform.OS === 'ios' && (height === 812 || width === 812));
}

export const getStatusBarHeight=()=>{
    if(isiPhoneX()) {
        return 44;
    } else {
        return 20;
    }
}

export const getScreenWidth=()=>{
    let d = Dimensions.get('window');
    const {height, width} = d;

    return width;
}

export const getScreenHeight=()=>{
    let d = Dimensions.get('window');
    const {height, width} = d;

    return height;
}