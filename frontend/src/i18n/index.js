import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './en/common.json';
import enProducts from './en/products.json';
import enAuth from './en/auth.json';
import enPages from './en/pages.json';
import arCommon from './ar/common.json';
import arProducts from './ar/products.json';
import arAuth from './ar/auth.json';
import arPages from './ar/pages.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, products: enProducts, auth: enAuth, pages: enPages },
      ar: { common: arCommon, products: arProducts, auth: arAuth, pages: arPages },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
