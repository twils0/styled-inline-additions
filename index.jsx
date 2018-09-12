import inlineConvert from './inlineConvert';

const inlineAdditions = ({ addString, addObject }) => {
  let finalStyleString = '';

  if (addString && typeof addString === 'string') {
    finalStyleString += `\n${addString}\n`;
  } else {
    console.error('inlineAdditions - please provide a string for addString');
  }

  if (addObject && typeof addObject === 'object' && addObject.constructor !== Array) {
    const { styleString, failedStyles } = inlineConvert(addObject);
    finalStyleString += `\n${styleString}\n`;

    if (failedStyles.length > 0) {
      console.error(
        'inlineAdditions - an error occured when processing each of the following styles: \n',
        failedStyles,
      );
    }
  } else {
    console.error('inlineAdditions - please provide an object (arrays do not count) for addObject');
  }

  return finalStyleString;
};

export default inlineAdditions;
