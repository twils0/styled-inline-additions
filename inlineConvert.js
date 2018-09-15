import camelToDash from './camelToDash';
import stringifyCategory from './stringifyCategory';
import handleAdd from './handleAdd';

import cssCategories from './Categories/categories';

const inlineConvert = (styles, paramNeeded) => {
  let returnStyleString = '';
  let returnHtmlPseudoString = '';
  let returnMediaString = '';
  let returnParamsString = '';
  let returnFailedStyles = [];

  if (styles && typeof styles === 'object' && styles.constructor !== Array) {
    Object.keys(styles).forEach((key) => {
      const style = styles[key];
      const cleanedKey = key.replace(/[^A-Za-z0-9]/g, '');
      const category = cssCategories[cleanedKey];

      if (typeof style === 'string') {
        if (cleanedKey === 'add') {
          const {
            htmlPseudoString, mediaString, paramString, failedStyles,
          } = handleAdd(
            style,
            paramNeeded,
          );

          if (htmlPseudoString) {
            returnHtmlPseudoString = htmlPseudoString;
          }
          if (mediaString) {
            returnMediaString = mediaString;
          }
          if (paramString) {
            returnParamsString = paramString;
          }
          if (failedStyles.length > 0) {
            returnFailedStyles = [...returnFailedStyles, ...failedStyles];
          }
        } else {
          const formattedKey = stringifyCategory(category, camelToDash(cleanedKey));
          const cleanedStyle = style.replace(/[^A-Za-z0-9- ]/g, '');

          returnStyleString += `${formattedKey}: ${cleanedStyle};\n`;
        }
      } else if (typeof style === 'object') {
        if (style.constructor !== Array) {
          switch (category) {
            case 'htmlElement': {
              const { styleString, htmlPseudoString } = inlineConvert(style);

              if (htmlPseudoString) {
                returnStyleString += `${cleanedKey}${
                  /[^A-Za-z0-9]/g.test(htmlPseudoString[0])
                    ? htmlPseudoString
                    : `, ${htmlPseudoString}`
                } {\n${styleString}}\n`;
              } else {
                returnStyleString += `${cleanedKey} {\n${styleString}}\n`;
              }
              break;
            }
            case 'pseudoClass':
            case 'pseudoElement':
            case 'pseudoClassDash':
            case 'pseudoElementDash': {
              const { styleString, htmlPseudoString } = inlineConvert(style);
              const formattedKey = stringifyCategory(category, camelToDash(cleanedKey));

              if (htmlPseudoString) {
                returnStyleString += `&${formattedKey}${
                  /[^A-Za-z0-9]/g.test(htmlPseudoString[0])
                    ? htmlPseudoString
                    : `, ${htmlPseudoString}`
                } {\n${styleString}}\n`;
              } else {
                returnStyleString += `&${formattedKey} {\n${styleString}}\n`;
              }
              break;
            }
            case 'pseudoClassParam':
            case 'pseudoElementParam': {
              const { styleString, htmlPseudoString, paramString } = inlineConvert(style, true);
              let formattedKey = stringifyCategory(category, camelToDash(cleanedKey));

              console.log('param', paramString);

              if (paramString) {
                formattedKey += `(${paramString})`;
              }
              if (htmlPseudoString) {
                returnStyleString += `&${formattedKey}${
                  /[^A-Za-z0-9]/g.test(htmlPseudoString[0])
                    ? htmlPseudoString
                    : `, ${htmlPseudoString}`
                } {\n${styleString}}\n`;
              } else {
                returnStyleString += `&${formattedKey} {\n${styleString}}\n`;
              }
              break;
            }
            case 'mediaQuery': {
              const { styleString, mediaString } = inlineConvert(style);

              if (mediaString) {
                const formattedKey = stringifyCategory(category, camelToDash(cleanedKey));

                returnStyleString += `${formattedKey} ${mediaString} {\n${styleString}}\n`;
              }
              break;
            }
            default:
              returnFailedStyles.push(cleanedKey);
              break;
          }
        } else if (cleanedKey === 'add') {
          const {
            htmlPseudoString, mediaString, paramString, failedStyles,
          } = handleAdd(
            style,
            paramNeeded,
          );

          if (htmlPseudoString) {
            returnHtmlPseudoString = htmlPseudoString;
          }
          if (mediaString) {
            returnMediaString = mediaString;
          }
          if (paramString) {
            returnParamsString = paramString;
          }
          if (failedStyles.length > 0) {
            returnFailedStyles = [...returnFailedStyles, ...failedStyles];
          }
        }
      }
    });
  }

  return {
    styleString: returnStyleString,
    htmlPseudoString: returnHtmlPseudoString,
    mediaString: returnMediaString,
    paramString: returnParamsString,
    failedStyles: returnFailedStyles,
  };
};

export default inlineConvert;
