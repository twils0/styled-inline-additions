import camelToDash from './camelToDash';

import cssCategories from './Categories/categories';
import { mediaFeaturesExceptions } from './Categories/mediaTypesFeatures';
import stringifyCategory from './stringifyCategory';

const handleAdd = (styles, paramNeeded) => {
  let stylesArray = null;
  let htmlPseudoString = '';
  let mediaString = '';
  let paramString = '';
  let returnParamString = '';
  const failedStyles = [];
  let stylesString = '';
  const htmlPseudoCategories = [
    'htmlElement',
    'pseudoClass',
    'pseudoElement',
    'pseudoClassDash',
    'pseudoElementDash',
    'pseudoClassParam',
    'pseudoElementParam',
  ];
  const mediaCategories = ['mediaType', 'mediaFeature'];
  let paramLoaded = paramNeeded ? false : true;
  let paramIndex = paramNeeded ? 0 : -1;
  let nextParamIndex = -1;

  if (typeof styles === 'string') {
    stylesString = styles;
  } else if (typeof styles === 'object') {
    stylesString = JSON.stringify(styles);
  }

  stylesArray = stylesString
    .replace(/[^A-Za-z0-9-\s*,>_+~&|!^:%]/g, '')
    .replace(/([-\s,*>_+~&|!^:*%]+[-\s,*>_+~&|!^:%]+)/g, match => {
      const cleanedMatch = match.replace(/(^\s+)|(\s+$)/g, '');
      if (cleanedMatch.length > 1) {
        const first = cleanedMatch[0];
        const last = cleanedMatch.slice(-1);

        if (first === last) {
          if (first === '&' || first === '|') {
            return `${first}${first}`;
          }
          return first;
        }
        return `${first}${last}`;
      }
      return cleanedMatch;
    })
    .split(/([,>_+~&|!^:%])/g)
    .filter(style => style);

  const stylesArrayLen = stylesArray.length - 1;

  for (let i = 0; i <= stylesArrayLen; i += 1) {
    const style = stylesArray[i];
    const nextStyle = stylesArray[i + 1];
    const nextNextStyle = stylesArray[i + 2];
    const category = cssCategories[style];
    const nextCategory = cssCategories[nextStyle];
    const nextNextCategory = cssCategories[nextNextStyle];
    const charTest = /[,>_+~&|!^:%]/g.test(style); // don't include param character %
    const nextCharTest = /[,>_+~&|!^:%]/g.test(nextStyle); // don't include param character %
    let paramUpdate = false;

    if (charTest) {
      switch (style) {
        case ',': {
          const nextHtmlPseudo = htmlPseudoCategories.indexOf(nextCategory) > -1;
          const nextNextHtmlPseudo = htmlPseudoCategories.indexOf(nextNextCategory) > -1;
          const nextMedia = mediaCategories.indexOf(nextCategory) > -1;
          const nextNextMedia = mediaCategories.indexOf(nextNextCategory) > -1;

          if (nextStyle === '%') {
            paramString += `${paramString ? ', ' : ''}${nextNextStyle}`;
            i += 2;

            paramUpdate = true;
          } else if (nextHtmlPseudo || (nextCharTest && nextNextHtmlPseudo)) {
            if (nextCharTest) {
              i += 1;
            }

            htmlPseudoString += ', ';
          } else if (nextMedia || (nextCharTest && nextNextMedia)) {
            if (nextCharTest && nextStyle !== '!' && nextStyle !== '^') {
              i += 1;
            }

            mediaString += ', ';
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '>': {
          const nextHtmlPseudo = htmlPseudoCategories.indexOf(nextCategory) > -1;
          const nextNextHtmlPseudo = htmlPseudoCategories.indexOf(nextNextCategory) > -1;

          if (nextHtmlPseudo || (nextCharTest && nextNextHtmlPseudo)) {
            if (nextCharTest) {
              i += 1;
            }

            htmlPseudoString += ' > ';
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '_': {
          const nextHtmlPseudo = htmlPseudoCategories.indexOf(nextCategory) > -1;
          const nextNextHtmlPseudo = htmlPseudoCategories.indexOf(nextNextCategory) > -1;

          if (nextHtmlPseudo || (nextCharTest && nextNextHtmlPseudo)) {
            if (nextCharTest) {
              i += 1;
            }

            htmlPseudoString += ' ';
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '+': {
          const nextHtmlPseudo = htmlPseudoCategories.indexOf(nextCategory) > -1;
          const nextNextHtmlPseudo = htmlPseudoCategories.indexOf(nextNextCategory) > -1;

          if (nextHtmlPseudo || (nextCharTest && nextNextHtmlPseudo)) {
            if (nextCharTest) {
              i += 1;
            }

            htmlPseudoString += ' + ';
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '~': {
          const nextHtmlPseudo = htmlPseudoCategories.indexOf(nextCategory) > -1;
          const nextNextHtmlPseudo = htmlPseudoCategories.indexOf(nextNextCategory) > -1;

          if (nextHtmlPseudo || (nextCharTest && nextNextHtmlPseudo)) {
            if (nextCharTest) {
              i += 1;
            }

            htmlPseudoString += ' ~ ';
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '&': {
          const nextMedia = mediaCategories.indexOf(nextCategory) > -1;
          const nextNextMedia = mediaCategories.indexOf(nextNextCategory) > -1;

          if (nextMedia || (nextCharTest && nextNextMedia)) {
            if (nextCharTest && nextStyle !== '!' && nextStyle !== '^') {
              i += 1;
            }

            mediaString += ' and ';
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '|': {
          const nextMedia = mediaCategories.indexOf(nextCategory) > -1;
          const nextNextMedia = mediaCategories.indexOf(nextNextCategory) > -1;

          if (nextMedia || (nextCharTest && nextNextMedia)) {
            if (nextCharTest) {
              i += 1;
            }

            mediaString += ', ';
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '!': {
          const nextMedia = mediaCategories.indexOf(nextCategory) > -1;
          const nextNextMedia = mediaCategories.indexOf(nextNextCategory) > -1;

          if (nextMedia || (nextCharTest && nextNextMedia)) {
            if (nextCharTest) {
              i += 1;
            }

            mediaString += `not `;
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '^': {
          const nextMedia = mediaCategories.indexOf(nextCategory) > -1;
          const nextNextMedia = mediaCategories.indexOf(nextNextCategory) > -1;

          if (nextMedia || (nextCharTest && nextNextMedia)) {
            if (nextCharTest) {
              i += 1;
            }

            mediaString += `only `;
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case ':': {
          const prevStyle = stylesArray[i - 1];
          const prevCategory = cssCategories[prevStyle];
          const prevHtmlPseudo = htmlPseudoCategories.indexOf(prevCategory) > -1;
          const nextHtmlPseudo = htmlPseudoCategories.indexOf(nextCategory) > -1;
          const nextNextHtmlPseudo = htmlPseudoCategories.indexOf(nextNextCategory) > -1;

          if (nextHtmlPseudo || (nextCharTest && nextNextHtmlPseudo)) {
            if (nextCharTest) {
              const formattedNextNextStyle = stringifyCategory(
                nextNextCategory,
                camelToDash(nextNextStyle)
              );

              if (prevHtmlPseudo || (!htmlPseudoString && !paramString)) {
                htmlPseudoString += formattedNextNextStyle;
              } else {
                htmlPseudoString += `&${formattedNextNextStyle}`;
              }

              if (
                nextNextCategory === 'pseudoClassParam' ||
                nextNextCategory === 'pseudoElementParam'
              ) {
                if (paramIndex > -1) {
                  paramUpdate = false;
                  nextParamIndex = htmlPseudoString.length;
                } else {
                  paramUpdate = true;
                  paramIndex = htmlPseudoString.length;
                }
              }

              i += 2;
            } else {
              const formattedNextStyle = stringifyCategory(nextCategory, camelToDash(nextStyle));

              if (prevHtmlPseudo || (!htmlPseudoString && !paramString)) {
                htmlPseudoString += formattedNextStyle;
              } else {
                htmlPseudoString += `&${formattedNextStyle}`;
              }

              if (nextCategory === 'pseudoClassParam' || nextCategory === 'pseudoElementParam') {
                if (paramIndex > -1) {
                  paramUpdate = false;
                  nextParamIndex = htmlPseudoString.length;
                } else {
                  paramUpdate = true;
                  paramIndex = htmlPseudoString.length;
                }
              }

              i += 1;
            }
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '%': {
          if (
            (!nextCharTest && !nextCategory) ||
            nextCategory === 'htmlElement' ||
            (nextCharTest && (!nextNextCategory || nextNextCategory === 'htmlElement'))
          ) {
            if (nextCharTest) {
              paramString += `${paramString ? ', ' : ''}${nextNextStyle}`;
              i += 2;
            } else {
              paramString += `${paramString ? ', ' : ''}${nextStyle}`;
              i += 1;
            }
          } else {
            failedStyles.push(style);
          }

          paramUpdate = true;
          break;
        }
      }
    } else {
      switch (category) {
        case 'htmlElement': {
          htmlPseudoString += style;
          break;
        }
        case 'pseudoClass':
        case 'pseudoElement':
        case 'pseudoClassDash':
        case 'pseudoElementDash': {
          const prevStyle = stylesArray[i - 1];
          const prevCategory = cssCategories[prevStyle];
          const prevHtmlPseudo = htmlPseudoCategories.indexOf(prevCategory) > -1;
          const formattedStyle = stringifyCategory(category, camelToDash(style));

          if (prevHtmlPseudo || (!htmlPseudoString && !paramString)) {
            htmlPseudoString += formattedStyle;
          } else {
            htmlPseudoString += `&${formattedStyle}`;
          }
          break;
        }
        case 'pseudoClassParam':
        case 'pseudoElementParam': {
          const prevStyle = stylesArray[i - 1];
          const prevCategory = cssCategories[prevStyle];
          const prevHtmlPseudo = htmlPseudoCategories.indexOf(prevCategory) > -1;
          const formattedStyle = stringifyCategory(category, camelToDash(style));

          if (prevHtmlPseudo || (!htmlPseudoString && !paramString)) {
            htmlPseudoString += formattedStyle;
          } else {
            htmlPseudoString += `&${formattedStyle}`;
          }

          if (paramIndex > -1) {
            paramUpdate = false;
            nextParamIndex = htmlPseudoString.length;
          } else {
            paramUpdate = true;
            paramIndex = htmlPseudoString.length;
          }
          break;
        }
        case 'mediaType': {
          mediaString += style;
          break;
        }
        case 'mediaFeature': {
          const nextNextNextStyle = stylesArray[i + 3];
          const formattedStyle = stringifyCategory(category, camelToDash(style));
          const nextNextCharTest = /[,>&|!^:]/g.test(nextNextStyle);
          const nextNextNextCharTest = /[,>&|!^:]/g.test(nextNextNextStyle);
          const nextNextNextCategory = cssCategories[nextNextNextStyle];
          const nextNextException = mediaFeaturesExceptions[nextNextStyle];
          const nextNextNextException = mediaFeaturesExceptions[nextNextNextStyle];

          if (
            nextStyle === ':' &&
            (nextNextStyle && !nextNextCharTest && (!nextNextCategory || nextNextException))
          ) {
            const formattedNextNextStyle = stringifyCategory(category, camelToDash(nextNextStyle));

            mediaString += `(${formattedStyle}: ${formattedNextNextStyle})`;

            i += 2;
          } else if (
            nextStyle === ':' &&
            nextNextCharTest &&
            (nextNextNextStyle &&
              !nextNextNextCharTest &&
              (!nextNextNextCategory || nextNextNextException))
          ) {
            const formattedNextNextNextStyle = stringifyCategory(
              category,
              camelToDash(nextNextNextStyle)
            );

            mediaString += `(${formattedStyle}: ${formattedNextNextNextStyle})`;

            i += 3;
          } else if (
            nextNextStyle === ':' &&
            nextCharTest &&
            (nextNextNextStyle &&
              !nextNextNextCharTest &&
              (!nextNextNextCategory || nextNextNextException))
          ) {
            const formattedNextNextNextStyle = stringifyCategory(
              category,
              camelToDash(nextNextNextStyle)
            );

            mediaString += `(${formattedStyle}: ${formattedNextNextNextStyle})`;

            i += 3;
          } else {
            mediaString += `(${formattedStyle})`;
          }
          break;
        }
        default: {
          failedStyles.push(style);
          break;
        }
      }
    }

    if (paramIndex > -1 && (!paramUpdate || i === stylesArrayLen)) {
      if (paramNeeded && !paramLoaded) {
        returnParamString = paramString;

        paramLoaded = true;
      } else if (paramString) {
        htmlPseudoString = `${htmlPseudoString.slice(
          0,
          paramIndex
        )}(${paramString})${htmlPseudoString.slice(paramIndex)}`;
      }

      paramString = '';
      if (nextParamIndex > -1) {
        paramIndex = nextParamIndex;
        nextParamIndex = -1;
      } else {
        paramIndex = -1;
      }
    }
  }

  return {
    htmlPseudoString,
    mediaString,
    paramString: returnParamString,
    failedStyles,
  };
};

export default handleAdd;
