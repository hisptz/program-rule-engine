import typeKeys from './types-keys.constant';

export default {
  [typeKeys.TEXT]: 'convertText',
  [typeKeys.LONG_TEXT]: 'convertLongText',
  [typeKeys.LETTER]: 'convertLetter',
  [typeKeys.PHONE_NUMBER]: 'convertPhoneNumber',
  [typeKeys.EMAIL]: 'convertEmail',
  [typeKeys.BOOLEAN]: 'convertBoolean',
  [typeKeys.TRUE_ONLY]: 'convertTrueOnly',
  [typeKeys.DATE]: 'convertDate',
  [typeKeys.DATETIME]: 'convertDateTime',
  [typeKeys.TIME]: 'convertTime',
  [typeKeys.NUMBER]: 'convertNumber',
  [typeKeys.INTEGER]: 'convertInteger',
  [typeKeys.INTEGER_POSITIVE]: 'convertIntegerPositive',
  [typeKeys.INTEGER_NEGATIVE]: 'convertIntegerNegative',
  [typeKeys.INTEGER_ZERO_OR_POSITIVE]: 'convertIntegerZeroOrPositive',
  [typeKeys.PERCENTAGE]: 'convertPercentage',
  [typeKeys.URL]: 'convertUrl',
  [typeKeys.AGE]: 'convertAge'
};
