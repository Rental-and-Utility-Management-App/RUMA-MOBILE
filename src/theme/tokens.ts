// Mirrors tokens/colors.css, tokens/typography.css, tokens/spacing.css from the
// RUMA design system, translated to hex/RN-friendly values (RN has no oklch()).
export const color = {
  clay50: '#FBF3EE', clay100: '#F3DCC9', clay200: '#E6C0A0', clay300: '#D49F72',
  clay400: '#BD7F4E', clay500: '#A8632F', clay600: '#8F4F22', clay700: '#764019',
  clay800: '#5C3213', clay900: '#43240D',
  teal50: '#EAF6F5', teal100: '#D2ECEA', teal200: '#AEDBD8', teal300: '#82C4C0',
  teal400: '#57A6A2', teal500: '#3D8683', teal600: '#316D6B', teal700: '#285856',
  stone0: '#FFFFFF', stone50: '#FAF9F7', stone100: '#F0EEEA', stone200: '#E1DDD6',
  stone300: '#C7C1B6', stone400: '#A7A093', stone500: '#877F71', stone600: '#6B6459',
  stone700: '#524C43', stone800: '#38332C', stone900: '#241F1A',
  green500: '#4C9A5B', green600: '#3D7F4B', green100: '#DCEFDF',
  amber500: '#D9A441', amber600: '#B8862E', amber100: '#F5E8CF',
  red500: '#C1503F', red600: '#A33F30', red100: '#F3DAD5',
};

export const theme = {
  fg1: color.stone900, fg2: color.stone600, fg3: color.stone400, fgOnDark: color.stone0,
  bgPage: color.stone50, bgSurface: color.stone0, bgSunken: color.stone100, bgInverse: color.stone900,
  borderSubtle: color.stone200, borderDefault: color.stone300, borderStrong: color.stone400,
  brandPrimary: color.clay500, brandPrimaryHover: color.clay600, brandPrimaryActive: color.clay700, brandPrimaryTint: color.clay50,
  brandSecondary: color.teal500, brandSecondaryHover: color.teal600, brandSecondaryTint: color.teal50,
  success: color.green600, successTint: color.green100,
  warning: color.amber600, warningTint: color.amber100,
  danger: color.red600, dangerTint: color.red100,
};

export const font = {
  display: 'SpaceGrotesk_600SemiBold',
  displayMedium: 'SpaceGrotesk_500Medium',
  body: 'PublicSans_400Regular',
  bodyMedium: 'PublicSans_500Medium',
  bodySemiBold: 'PublicSans_600SemiBold',
};

export const text = {
  displayL: { fontFamily: font.display, fontSize: 32, lineHeight: 38 },
  displayM: { fontFamily: font.display, fontSize: 24, lineHeight: 30 },
  displayS: { fontFamily: font.display, fontSize: 19, lineHeight: 25 },
  bodyL: { fontFamily: font.body, fontSize: 17, lineHeight: 25 },
  bodyM: { fontFamily: font.body, fontSize: 15, lineHeight: 22 },
  bodyS: { fontFamily: font.body, fontSize: 13, lineHeight: 18 },
  labelM: { fontFamily: font.bodySemiBold, fontSize: 13, lineHeight: 17 },
  labelS: { fontFamily: font.bodySemiBold, fontSize: 11, lineHeight: 14, letterSpacing: 0.4 },
};

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 32, 8: 40, 9: 56 };
export const radius = { s: 6, m: 10, l: 16, xl: 24, pill: 999 };
export const shadow = {
  s: { shadowColor: '#28211a', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  m: { shadowColor: '#28211a', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
};
