import { createI18n } from 'vue-i18n';
import es from './es';
import en from './en';
import ca from './ca';

const i18n = createI18n({
  locale: 'es',
  fallbackLocale: 'es',
  messages: {
    es,
    en,
    ca,
  },
});

export default i18n;
