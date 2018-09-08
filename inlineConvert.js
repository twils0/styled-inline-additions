import camelToDash from './camelToDash';
import stringifyType from './stringifyType';
import handleAdd from './handleAdd';

import { cssCategories } from './Categories/categories';

const inlineConvert = styles => {
  let returnStyleString = '';
  let returnParamString = '';
  let returnHtmlString = '';
  let returnMediaString = '';

  if (styles && typeof styles === 'object' && styles.constructor !== Array) {
    Object.keys(styles).forEach(key => {
      const cleanedKey = key.replace(/[^A-Za-z0-9]/g, '');
      const style = styles[cleanedKey];
      const category = cssCategories[cleanedKey];

      if (typeof style === 'string') {
        const cleanedStyle = style.replace(/[^A-Za-z0-9]/g, '');
        const formattedKey = stringifyType(category, camelToDash(cleanedKey));

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
        }

        returnStyleString += `${formattedKey}: ${cleanedStyle};\n`;
      } else if (typeof style === 'object') {
        if (style.constructor !== Array) {
          switch (category) {
            case 'htmlElement': {
              const { styleString, htmlString } = inlineConvert(style);

              returnStyleString += `${htmlString ? `${cleanedKey}, ${htmlString}` : cleanedKey} {
                ${styleString}
              }
            `;
              break;
            }
            case 'pseudoClass' || 'pseudoElement' || 'pseudoElementDash': {
              const { styleString, htmlString } = inlineConvert(style);
              const formattedKey = stringifyType(category, camelToDash(cleanedKey));

              returnStyleString += `${htmlString || '&'}${formattedKey} {
                ${styleString}
              }
            `;
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

              returnStyleString += `${filteredHtml || '&'}$${formattedKey}${
                paramString ? `(${paramString})` : ''
              } {
                  ${styleString}
                }
              `;
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
              return cleanedKey;
              break;
          }
        } else {
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
  };
};

export default inlineConvert;
