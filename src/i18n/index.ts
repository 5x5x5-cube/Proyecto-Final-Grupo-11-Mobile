import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonES from './locales/es/common.json';
import mobileES from './locales/es/mobile.json';
import commonEN from './locales/en/common.json';
import mobileEN from './locales/en/mobile.json';

i18n.use(initReactI18next).init({
  resources: {
    ES: {
      common: commonES,
      mobile: mobileES,
    },
    EN: {
      common: commonEN,
      mobile: mobileEN,
    },
  },
  lng: 'ES',
  fallbackLng: 'ES',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
