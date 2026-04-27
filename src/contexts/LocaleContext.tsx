import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import { useExchangeRates } from '@/api/hooks/useExchangeRates';
import type { ExchangeRate } from '@/api/hooks/useExchangeRates';

type Language = 'ES' | 'EN';
type Currency = 'COP' | 'USD' | 'MXN' | 'ARS' | 'CLP' | 'PEN';
type DateFormat = 'short' | 'shortWithDay' | 'medium' | 'mediumWithDay' | 'monthYear' | 'monthOnly';

const dateFormatOptions: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  short: { day: 'numeric', month: 'short' },
  shortWithDay: { weekday: 'short', day: 'numeric', month: 'short' },
  medium: { day: 'numeric', month: 'short', year: 'numeric' },
  mediumWithDay: { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' },
  monthYear: { month: 'short', year: 'numeric' },
  monthOnly: { month: 'short' },
};

interface LocaleContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (cur: Currency) => void;
  formatPrice: (copAmount: number) => string;
  formatDate: (date: string | Date, format: DateFormat) => string;
}

// Fallback rates used when backend is unreachable
const FALLBACK_RATES: Record<Currency, { rate: number; symbol: string; decimals: number }> = {
  COP: { rate: 1, symbol: 'COP', decimals: 0 },
  USD: { rate: 0.00024, symbol: 'USD', decimals: 2 },
  MXN: { rate: 0.0041, symbol: 'MXN', decimals: 0 },
  ARS: { rate: 0.21, symbol: 'ARS', decimals: 0 },
  CLP: { rate: 0.22, symbol: 'CLP', decimals: 0 },
  PEN: { rate: 0.00089, symbol: 'PEN', decimals: 2 },
};

const currencyNames: Record<Currency, string> = {
  COP: 'Peso colombiano',
  USD: 'Dólar estadounidense',
  MXN: 'Peso mexicano',
  ARS: 'Peso argentino',
  CLP: 'Peso chileno',
  PEN: 'Sol peruano',
};

const languageNames: Record<Language, string> = {
  ES: 'Español',
  EN: 'English',
};

function buildRatesMap(
  apiRates: ExchangeRate[] | undefined
): Record<Currency, { rate: number; symbol: string; decimals: number }> {
  if (!Array.isArray(apiRates) || apiRates.length === 0) return FALLBACK_RATES;
  const map = { ...FALLBACK_RATES };
  for (const r of apiRates) {
    if (r.currency in map) {
      map[r.currency as Currency] = { rate: r.rate, symbol: r.symbol, decimals: r.decimals };
    }
  }
  return map;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ES');
  const [currency, setCurrencyState] = useState<Currency>('COP');

  const { data: apiRates } = useExchangeRates();
  const rates = useMemo(() => buildRatesMap(apiRates), [apiRates]);

  useEffect(() => {
    AsyncStorage.getItem('language').then(val => {
      if (val === 'EN' || val === 'ES') {
        setLanguageState(val);
        i18n.changeLanguage(val);
      }
    });
    AsyncStorage.getItem('currency').then(val => {
      if (val && val in FALLBACK_RATES) setCurrencyState(val as Currency);
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    AsyncStorage.setItem('language', lang);
  };

  const setCurrency = (cur: Currency) => {
    setCurrencyState(cur);
    AsyncStorage.setItem('currency', cur);
  };

  const formatDate = (date: string | Date, format: DateFormat): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const locale = language === 'ES' ? 'es' : 'en';
    return new Intl.DateTimeFormat(locale, dateFormatOptions[format]).format(d);
  };

  const formatPrice = (copAmount: number): string => {
    const { rate, symbol, decimals } = rates[currency];
    const converted = copAmount * rate;
    const formatted = converted.toLocaleString('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${symbol} ${formatted}`;
  };

  return (
    <LocaleContext.Provider
      value={{ language, currency, setLanguage, setCurrency, formatPrice, formatDate }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

export { currencyNames, languageNames };
export type { Language, Currency, DateFormat };
