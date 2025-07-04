import {Dimensions, Platform} from 'react-native';

//---------------------------------------------------------------------
// 1. Ekran Boyutları ve Ölçekleme Faktörü
//---------------------------------------------------------------------

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// Referans alınan temel ekran genişliği (Örn: Realme 7 Pro)
const baseScreenWidth = 360;
const baseScreenHeight = 720;

export const scale = (size: number) => (screenWidth / baseScreenWidth) * size;
export const verticalScale = (size: number) =>
  (screenHeight / baseScreenHeight) * size;

// Ölçekleme faktörü
const scaleFactor = screenWidth / baseScreenWidth;

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
export const scaledPadding = {
  xxs: Math.max(2, Math.round(baseFontSizes.xxs * scaleFactor)),
  xs: Math.max(3, Math.round(baseFontSizes.xs * scaleFactor)),
  small: Math.max(5, Math.round(baseFontSizes.small * scaleFactor)),
  medium: Math.max(7, Math.round(baseFontSizes.medium * scaleFactor)),
  large: Math.max(11, Math.round(baseFontSizes.large * scaleFactor)),
  xl: Math.max(15, Math.round(baseFontSizes.xl * scaleFactor)),
  xxl: Math.max(19, Math.round(baseFontSizes.xxl * scaleFactor)),
};

//---------------------------------------------------------------------
// 999. Diğer Sabitler
//---------------------------------------------------------------------

// Platform bilgisi
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

//Win Points
export const winPointMultiplier = 5;
export const bestScorePointMultiplier = 10;

export type PositionObjectType = {
  x: number;
  y: number;
  width: number;
  height: number;
};
