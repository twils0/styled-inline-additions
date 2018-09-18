import inlineConvert from './inlineConvert';

const inlineAdditions = ({ addString, addObject }) => {
  let finalStyleString = '';

  if (addString) {
    if (typeof addString === 'string') {
      finalStyleString += `\n${addString}\n`;
    } else {
      console.error('inlineAdditions - please provide a string for addString');
    }
  }

  if (addObject) {
    if (typeof addObject === 'object' && addObject.constructor !== Array) {
      const { styleString, failedStyles } = inlineConvert(addObject);
      finalStyleString += `\n${styleString}\n`;

      if (failedStyles.length > 0) {
        console.error(
          'inlineAdditions - the following styles were not understood and ignored: \n',
          failedStyles,
        );
      }
    } else {
      console.error(
        'inlineAdditions - please provide an object (arrays do not count) for addObject',
      );
    }
  }

  return finalStyleString;
};

export default inlineAdditions;
