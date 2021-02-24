import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTrans from './en';
import zhTrans from './zh';
import itTrans from './it';
import spTrans from './sp';
// not like to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

// Internationalized resource files
const resources = {
  EN: {
    translation: enTrans
  },
  CN: {
    translation: zhTrans
  },
  IT: {
    translation: itTrans
  },
  SP: {
    translation: spTrans
  },

}

let lng = 'EN'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng,
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });


export default i18n;