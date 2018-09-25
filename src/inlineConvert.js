import camelToDash from './camelToDash';
import stringifyCategory from './stringifyCategory';
import handleAdd from './handleAdd';

import cssCategories from './Categories/categories';

// inlineConvert recursively iterates through an object provided
// by 'addObject'; it ultimately returns a 'styleString' and 'failedStyles'
// array to inlineAdditions
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
        // add is a prop used to add additional, relevant syntax;
        // this section handles cases in which a string is provided to add
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
          const cleanedStyle = style.replace(/[^A-Za-z0-9- #]/g, '');

          returnStyleString += `${formattedKey}: ${cleanedStyle};\n`;
        }
      } else if (typeof style === 'object') {
        /* object values must have recognized css selector (category) keys;
          inlineCovert recursively handles all styles contained in the object,
          placing them inside the selector's declaration block; the selector may
          receive additional syntax from the add prop

          for example, { div: { add: 'hover', alignItems: 'center' } }
          - returns -
          div:hover {
          align-items: center;
          }
        */
        if (style && style.constructor !== Array) {
          switch (category) {
            case 'htmlElement': {
              const { styleString, htmlPseudoString, failedStyles } = inlineConvert(style);

              if (htmlPseudoString) {
                returnStyleString += `${cleanedKey}${
                  /[A-Za-z0-9&]/g.test(htmlPseudoString[0]) ? ', ' : ''
                }${htmlPseudoString} {\n${styleString}}\n`;
              } else {
                returnStyleString += `${cleanedKey} {\n${styleString}}\n`;
              }
              if (failedStyles.length > 0) {
                returnFailedStyles = [...returnFailedStyles, ...failedStyles];
              }
              break;
            }
            case 'pseudoClass':
            case 'pseudoElement':
            case 'pseudoClassDash':
            case 'pseudoElementDash': {
              const { styleString, htmlPseudoString, failedStyles } = inlineConvert(style);
              const formattedKey = stringifyCategory(category, camelToDash(cleanedKey));

              if (htmlPseudoString) {
                returnStyleString += `&${formattedKey}${
                  /[A-Za-z0-9&]/g.test(htmlPseudoString[0]) ? ', ' : ''
                }${htmlPseudoString} {\n${styleString}}\n`;
              } else {
                returnStyleString += `&${formattedKey} {\n${styleString}}\n`;
              }
              if (failedStyles.length > 0) {
                returnFailedStyles = [...returnFailedStyles, ...failedStyles];
              }
              break;
            }
            case 'pseudoClassParam':
            case 'pseudoElementParam': {
              const {
                styleString, htmlPseudoString, paramString, failedStyles,
              } = inlineConvert(
                style,
                true,
              );
              let formattedKey = stringifyCategory(category, camelToDash(cleanedKey));

              if (paramString) {
                formattedKey += `(${paramString})`;
              }
              if (htmlPseudoString) {
                returnStyleString += `&${formattedKey}${
                  /[A-Za-z0-9&]/g.test(htmlPseudoString[0]) ? ', ' : ''
                }${
                  htmlPseudoString[0] === ':' ? `, &${htmlPseudoString}` : htmlPseudoString
                } {\n${styleString}}\n`;
              } else {
                returnStyleString += `&${formattedKey} {\n${styleString}}\n`;
              }
              if (failedStyles.length > 0) {
                returnFailedStyles = [...returnFailedStyles, ...failedStyles];
              }
              break;
            }
            case 'mediaQuery': {
              const { styleString, mediaString, failedStyles } = inlineConvert(style);

              if (mediaString) {
                const formattedKey = stringifyCategory(category, camelToDash(cleanedKey));

                returnStyleString += `${formattedKey} ${mediaString} {\n${styleString}}\n`;
              }
              if (failedStyles.length > 0) {
                returnFailedStyles = [...returnFailedStyles, ...failedStyles];
              }
              break;
            }
            default:
              returnFailedStyles.push(cleanedKey);
              break;
          }

          // add is a prop used to add additional, relevant syntax;
          // this section handles cases in which an array is provided to add
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
        } else {
          returnFailedStyles.push(cleanedKey);
        }
      } else {
        returnFailedStyles.push(cleanedKey);
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
