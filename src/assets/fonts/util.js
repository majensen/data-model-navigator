import { Font } from '@react-pdf/renderer';
import NunitoExtraBold from './Nunito-ExtraBold.ttf';
import NunitoBold from './Nunito-Bold.ttf';
import NunitoSemiBold from './Nunito-SemiBold.ttf';
import NunitoExtraLightItalic from './Nunito-ExtraLightItalic.ttf';
import NunitoNormal from './Nunito-Medium.ttf';
import NunitoLight from './Nunito-Light.ttf';

export const getFont = (path) => {
  switch (path) {
    case 'NunitoExtraBold':
      return NunitoExtraBold;
    case 'NunitoSemiBold':
      return NunitoSemiBold;
    case 'NunitoBold':
      return NunitoBold;
    case 'NunitoExtraLightItalic':
      return NunitoExtraLightItalic;
    case 'NunitoNormal':
      return NunitoNormal;
    case 'NunitoLight':
      return NunitoLight;
    default:
      return NunitoNormal;
  }
};

export const FontRegistry = (font) => {
  const fontConfig = { src: getFont(font), family: font };
  Font.register(fontConfig);
  return font;
};

export const formatEnumValues = (enums) => {
  if (Array.isArray(enums)) {
    let concatEnums = '';
    enums.forEach((value) => {
      concatEnums += `'${value}'; `;
    });
    return concatEnums;
  }
  return JSON.stringify(enums);
};
