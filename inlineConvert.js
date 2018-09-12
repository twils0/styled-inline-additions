import camelToDash from './camelToDash';
import stringifyType from './stringifyType';
import handleAdd from './handleAdd';

import { cssCategories } from './Categories/categories';

const inlineConvert = (styles) => {
  let returnStyleString = '';
  let returnParamString = '';
  let returnHtmlString = '';
  let returnMediaString = '';
  const returnFailedStyles = [];

  if (styles && typeof styles === 'object' && styles.constructor !== Array) {
    Object.keys(styles).forEach((key) => {
      const style = styles[key];
      const cleanedKey = key.replace(/[^A-Za-z0-9]/g, '');
      const category = cssCategories[cleanedKey];

      if (typeof style === 'string') {
        if (cleanedKey === 'add') {
          const { htmlString, paramString, mediaString } = handleAdd(style);

          if (htmlString) {
            returnHtmlString = htmlString;
          }
          if (paramString) {
            returnParamString = paramString;
          }
          if (mediaString) {
            returnMediaString = mediaString;
          }
        } else {
          const cleanedStyle = style.replace(/[^A-Za-z0-9- ]/g, '');
          const formattedKey = stringifyType(category, camelToDash(cleanedKey));

          returnStyleString += `${formattedKey}: ${cleanedStyle};\n`;
        }
      } else if (typeof style === 'object') {
        if (style.constructor !== Array) {
          switch (category) {
            case 'htmlElement': {
              const { styleString, htmlString } = inlineConvert(style);

              returnStyleString += `${
                htmlString ? `${cleanedKey}, ${htmlString}` : cleanedKey
              } {\n${styleString}}\n`;
              break;
            }
            case 'pseudoClass' || 'pseudoElement' || 'pseudoElementDash': {
              const { styleString, htmlString } = inlineConvert(style);
              const formattedKey = stringifyType(category, camelToDash(cleanedKey));

              returnStyleString += `${htmlString || '&'}${formattedKey} {\n${styleString}\n}\n`;
              break;
            }
            case 'pseudoClassParam' || 'pseudoElementParam': {
              const { styleString, htmlString, paramString } = inlineConvert(style);

              const formattedKey = stringifyType(category, camelToDash(cleanedKey));
              let filteredHtml = '';

              if (htmlString) {
                const index = htmlString.indexOf(',') > -1;

                if (index > -1) {
                  filteredHtml = htmlString.substr(0, index);
                } else {
                  filteredHtml = htmlString;
                }
              }

              returnStyleString += `${filteredHtml || '&'}${formattedKey}${
                paramString ? `(${paramString})` : ''
              } {\n${styleString}}\n`;
              break;
            }
            case 'mediaQuery': {
              const { styleString, mediaString } = inlineConvert(style);

              if (mediaString) {
                const formattedKey = stringifyType(category, camelToDash(cleanedKey));

                returnStyleString += `${formattedKey} ${mediaString} {
                  ${styleString}
                }
              `;
              }
              break;
            }
            default:
              returnFailedStyles.push(cleanedKey);
              break;
          }
        } else if (cleanedKey === 'add') {
          const { htmlString, paramString, mediaString } = handleAdd(style);

          if (htmlString) {
            returnHtmlString = htmlString;
          }
          if (paramString) {
            returnParamString = paramString;
          }
          if (mediaString) {
            returnMediaString = mediaString;
          }
        }
      }
    });
  }

  return {
    paramString: returnParamString,
    htmlString: returnHtmlString,
    mediaString: returnMediaString,
    styleString: returnStyleString,
    failedStyles: returnFailedStyles,
  };
};

export default inlineConvert;
