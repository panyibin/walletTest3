import I18n from 'react-native-i18n';
import en from './locale/en';
import zh from './locale/zh';

I18n.defaultLocale = 'en';
I18n.fallbacks = true;
I18n.translations = {
    en,
    zh
};

I18n.locale = 'en';

export function strings(name, param={}) {
    return I18n.t(name, param);
}

export function setLanguage(lan) {
    I18n.locale = lan;
}

export default I18n;
