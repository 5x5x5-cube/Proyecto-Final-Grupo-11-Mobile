import { TextStyle } from 'react-native';

export const fontFamily = {
  light: 'Roboto_300Light',
  regular: 'Roboto_400Regular',
  medium: 'Roboto_500Medium',
  bold: 'Roboto_700Bold',
};

export const typography: Record<string, TextStyle> = {
  h1: { fontFamily: fontFamily.bold, fontSize: 26, lineHeight: 32 },
  h2: { fontFamily: fontFamily.bold, fontSize: 20, lineHeight: 26 },
  h3: { fontFamily: fontFamily.bold, fontSize: 18, lineHeight: 24 },
  subtitle: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  bodySmall: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  captionSmall: { fontFamily: fontFamily.regular, fontSize: 11, lineHeight: 15 },
  label: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16 },
  button: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 20 },
};
