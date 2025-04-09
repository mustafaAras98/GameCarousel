import {Dimensions, Platform} from 'react-native';

//---------------------------------------------------------------------
// 1. Ekran Boyutları ve Ölçekleme Faktörü
//---------------------------------------------------------------------

const {width: screenWidth} = Dimensions.get('window');

// Referans alınan temel ekran genişliği (Örn: Realme 7 Pro)
const baseScreenWidth = 360;

// Ölçekleme faktörü
const scaleFactor = screenWidth / baseScreenWidth;

//---------------------------------------------------------------------
// 2. Border Radius Hesaplamaları
//---------------------------------------------------------------------

/**
 * Yuvarlatma tipi seçenekleri.
 */
export enum RadiusType {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Pill = 'pill',
  Circle = 'circle',
}

// Temel yarıçap değerleri (referans ekran genişliği için)
const baseRadius = {
  small: 8,
  medium: 12,
  large: 16,
};

/**
 * Verilen yuvarlatma tipi ve yüksekliğe göre borderRadius değerini hesaplar.
 * @param radiusType - İstenen yuvarlatma tipi.
 * @param height - Elemanın yüksekliği.
 * @returns Hesaplanan borderRadius değeri.
 */
export const getBorderRadius = (
  radiusType: RadiusType,
  height?: number
): number => {
  switch (radiusType) {
    case RadiusType.Small:
      return Math.max(4, Math.round(baseRadius.small * scaleFactor));
    case RadiusType.Medium:
      return Math.max(8, Math.round(baseRadius.medium * scaleFactor));
    case RadiusType.Large:
      return Math.max(12, Math.round(baseRadius.large * scaleFactor));
    case RadiusType.Pill:
    case RadiusType.Circle:
      if (height === undefined) {
        throw new Error(
          `'height' parameter is required for '${radiusType}' radius type`
        );
      }
      return height / 2;
  }
};

//---------------------------------------------------------------------
// 3. Font Boyutu Ölçekleme
//---------------------------------------------------------------------

// Temel font boyutları
const baseFontSizes = {
  xxs: 10,
  xs: 12,
  small: 14,
  medium: 16,
  large: 18,
  xl: 20,
  xxl: 24,
  h1: 32,
  h2: 28,
  h3: 24,
};

// Ölçeklenmiş font boyutları
export const scaledFontSizes = {
  xxs: Math.max(9, Math.round(baseFontSizes.xxs * scaleFactor)),
  xs: Math.max(10, Math.round(baseFontSizes.xs * scaleFactor)),
  small: Math.max(12, Math.round(baseFontSizes.small * scaleFactor)),
  medium: Math.max(14, Math.round(baseFontSizes.medium * scaleFactor)),
  large: Math.max(15, Math.round(baseFontSizes.large * scaleFactor)),
  xl: Math.max(16, Math.round(baseFontSizes.xl * scaleFactor)),
  xxl: Math.max(18, Math.round(baseFontSizes.xxl * scaleFactor)),
  h1: Math.max(28, Math.round(baseFontSizes.h1 * scaleFactor)),
  h2: Math.max(24, Math.round(baseFontSizes.h2 * scaleFactor)),
  h3: Math.max(20, Math.round(baseFontSizes.h3 * scaleFactor)),
};

/**
 * @param baseSize - Ölçeklenecek temel font boyutu.
 * @param minSize - İzin verilen minimum font boyutu (varsayılan 12).
 * @returns Ölçeklenmiş font boyutu.
 */
export const scaleFontSize = (
  baseSize: number,
  minSize: number = 12
): number => {
  const scaledSize = Math.round(baseSize * scaleFactor);
  return Math.max(minSize, scaledSize);
};

//---------------------------------------------------------------------
// 4. Padding
//---------------------------------------------------------------------

export enum BasePadding {
  xxs = 2,
  xs = 4,
  small = 6,
  medium = 8,
  large = 12,
  xl = 16,
  xxl = 20,
}
export enum BasePaddingPercentage {
  xxs = '2%',
  xs = '4%',
  small = '6%',
  medium = '8%',
  large = '12%',
  xl = '16%',
  xxl = '20%',
}

//---------------------------------------------------------------------
// 999. Diğer Sabitler
//---------------------------------------------------------------------

// Renk Sabitleri
export const Colors = {
  Common: {
    Black: '#000000',
    White: '#FFFFFF',
    Disabled: '#6b7579',
  },
  DarkTheme: {
    text: '#f2ebe9',
    background: '#130d0b',
    primary: '#c8a99d',
    secondary: '#41716d',
    accent: '#717ead',
  },
  LightTheme: {
    text: '#160f0d',
    background: '#f4eeec',
    primary: '#624337',
    secondary: '#8ebeb8',
    accent: '#525f8e',
  },
  Message: {
    Error: '#f44336',
    Success: '#559e5c',
    Warning: '#d38e24',
  },
  ThemeSwitch: {
    Track: {
      On: '#b2d8d8',
      Off: '#222222',
    },
    Icons: {
      On: '#e3d539',
      Off: '#343d4a',
    },
  },
};

// Platform bilgisi
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
