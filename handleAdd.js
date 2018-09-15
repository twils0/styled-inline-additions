import camelToDash from './camelToDash';

import cssCategories from './Categories/categories';
import { mediaFeaturesExceptions } from './Categories/mediaTypesFeatures';
import stringifyCategory from './stringifyCategory';

const handleAdd = (styles, paramNeeded) => {
  let stylesArray = null;
  let htmlPseudoString = '';
  let mediaString = '';
  let paramString = '';
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
  let paramIndex = paramNeeded ? 0 : -1;

  if (typeof styles === 'string') {
    stylesString = styles;
  } else if (typeof styles === 'object') {
    stylesString = JSON.stringify(styles);
  }

  console.log('1 add', styles, paramNeeded);

  stylesArray = stylesString
    .replace(/[^A-Za-z0-9 ,>&|!*:-]/g, '')
    .replace(/([\s,>&|!*:-]+[\s,>&|!*:-]+)/g, (match) => {
      const cleanedMatch = match.replace(/\s/g, '');
      const first = cleanedMatch[0];
      const last = cleanedMatch.slice(-1);

      if (first === last) {
        if (first === '&' || first === '|') {
          return `${first}${first}`;
        }
        return first;
      }
      return `${first}${last}`;
    })
    .split(/([,>&|!*:-])/g)
    .map(style => style && style.replace(/(^\s+)|(\s+$)/g, ''))
    .filter(style => style);

  console.log('2 add', stylesArray);

  for (let i = 0; i < stylesArray.length; i += 1) {
    const style = stylesArray[i];
    const nextStyle = stylesArray[i + 1];
    const nextNextStyle = stylesArray[i + 2];
    const category = cssCategories[style];
    const nextCategory = cssCategories[nextStyle];
    const nextNextCategory = cssCategories[nextNextStyle];
    const charTest = /[,>&|!*:]/g.test(style);
    const nextCharTest = /[,>&|!*:]/g.test(nextStyle);

    if (paramIndex > -1) {
      console.log(
        'param',
        paramIndex > -1,
        'style',
        style !== ',',
        'cat',
        category !== 'htmlElement',
        'char cat',
        charTest,
        category,
        i,
        stylesArray.length - 1,
      );
    }

    if (
      paramIndex > -1
      && (style !== ','
        && category !== 'htmlElement'
        && (charTest || category || i === stylesArray.length - 1))
    ) {
      if (i === stylesArray.length - 1) {
        htmlPseudoString += `${
          htmlPseudoString && paramIndex < htmlPseudoString.length ? ', ' : ''
        }${style}`;
      }

      if (paramNeeded) {
        if (htmlPseudoString.slice(0, 2) === ', ') {
          paramString = htmlPseudoString.slice(2);
        } else {
          paramString = htmlPseudoString;
        }

        htmlPseudoString = '';
      } else {
        console.log('p ind', htmlPseudoString, paramIndex);

        htmlPseudoString = `${htmlPseudoString.slice(0, paramIndex)}(${htmlPseudoString.slice(
          paramIndex,
        )})`;
      }

      console.log('***', paramString, '***', htmlPseudoString);

      paramIndex = -1;
    }

    if (charTest) {
      switch (style) {
        case ',': {
          const nextHtmlPseudo = htmlPseudoCategories.indexOf(nextCategory) > -1;
          const nextNextHtmlPseudo = htmlPseudoCategories.indexOf(nextNextCategory) > -1;
          const nextMedia = mediaCategories.indexOf(nextCategory) > -1;
          const nextNextMedia = mediaCategories.indexOf(nextNextCategory) > -1;

          if (nextHtmlPseudo || (nextCharTest && nextNextHtmlPseudo)) {
            if (nextCharTest) {
              htmlPseudoString += `, ${nextNextStyle}`;
              i += 2;
            } else {
              htmlPseudoString += `, ${nextStyle}`;
              i += 1;
            }
          } else if (nextMedia || (nextCharTest && nextNextMedia)) {
            if (nextCharTest && nextStyle !== '!' && nextStyle !== '*') {
              i += 1;
            }

            mediaString += ',';
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
              htmlPseudoString += ` > ${nextNextStyle}`;
              i += 2;
            } else {
              htmlPseudoString += ` > ${nextStyle}`;
              i += 1;
            }
          } else {
            failedStyles.concat(style);
          }
          break;
        }
        case '&': {
          const nextMedia = mediaCategories.indexOf(nextCategory) > -1;
          const nextNextMedia = mediaCategories.indexOf(nextNextCategory) > -1;

          if (nextMedia || (nextCharTest && nextNextMedia)) {
            if (nextCharTest && nextStyle !== '!' && nextStyle !== '*') {
              i += 1;
            }

            mediaString += ' and';
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

            mediaString += ',';
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

            mediaString += `${mediaString ? ' ' : ''}not`;
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '*': {
          const nextMedia = mediaCategories.indexOf(nextCategory) > -1;
          const nextNextMedia = mediaCategories.indexOf(nextNextCategory) > -1;

          if (nextMedia || (nextCharTest && nextNextMedia)) {
            if (nextCharTest) {
              i += 1;
            }

            mediaString += `${mediaString ? ' ' : ''}only`;
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case ':': {
          const nextHtmlPseudo = htmlPseudoCategories.indexOf(nextCategory) > -1;
          const nextNextHtmlPseudo = htmlPseudoCategories.indexOf(nextNextCategory) > -1;

          if (nextHtmlPseudo || (nextCharTest && nextNextHtmlPseudo)) {
            if (nextCharTest) {
              htmlPseudoString += `:${nextNextStyle}`;
              i += 2;
            } else {
              htmlPseudoString += `:${nextStyle}`;
              i += 1;
            }
          } else {
            failedStyles.concat(style);
          }
          break;
        }
        default: {
          const nextNextHtmlPseudo = htmlPseudoCategories.indexOf(nextNextCategory) > -1;
          const nextNextMedia = mediaCategories.indexOf(nextNextCategory) > -1;

          if (nextStyle === ',' && nextNextHtmlPseudo) {
            htmlPseudoString += `, ${nextNextStyle}`;
            i += 2;
          } else if (nextStyle === '>' && nextNextHtmlPseudo) {
            htmlPseudoString += ` > ${nextNextStyle}`;
            i += 2;
          } else if (nextStyle === ',' && nextNextMedia) {
            mediaString += ',';
            i += 1;
          } else if (nextStyle === '&' && nextNextMedia) {
            mediaString += ' and';
            i += 1;
          } else if (nextStyle === '|' && nextNextMedia) {
            mediaString += ',';
            i += 1;
          } else if (nextStyle === '!' && nextNextMedia) {
            mediaString += `${mediaString ? ' ' : ''}not`;
            i += 1;
          } else if (nextStyle === '*' && nextNextMedia) {
            mediaString += `${mediaString ? ' ' : ''}only`;
            i += 1;
          } else if (nextStyle === ':' && nextNextHtmlPseudo) {
            htmlPseudoString += `:${nextNextStyle}`;
            i += 2;
          } else {
            failedStyles.push(style);
          }
          break;
        }
      }
    } else {
      switch (category) {
        case 'htmlElement':
        case 'pseudoClass':
        case 'pseudoElement':
        case 'pseudoClassDash':
        case 'pseudoElementDash': {
          const formattedStyle = stringifyCategory(category, camelToDash(style));

          htmlPseudoString += formattedStyle;
          break;
        }
        case 'pseudoClassParam':
        case 'pseudoElementParam': {
          const formattedStyle = stringifyCategory(category, camelToDash(style));

          htmlPseudoString += formattedStyle;

          paramIndex = htmlPseudoString.length;
          break;
        }
        case 'mediaType': {
          const formattedStyle = stringifyCategory(category, camelToDash(style));

          mediaString += `${mediaString ? ' ' : ''}${formattedStyle}`;
          break;
        }
        case 'mediaFeature': {
          const formattedStyle = stringifyCategory(category, camelToDash(style));
          const nextNextCharTest = /[,>&|!*:]/g.test(nextNextStyle);
          const nextException = mediaFeaturesExceptions[nextStyle];
          const nextNextException = mediaFeaturesExceptions[nextNextStyle];

          if (
            nextStyle === ':'
            && (nextNextStyle && !nextNextCharTest && (!nextNextCategory || nextNextException))
          ) {
            const formattedNextNextStyle = stringifyCategory(category, camelToDash(nextNextStyle));

            mediaString += `${
              mediaString ? ' ' : ''
            }(${formattedStyle}: ${formattedNextNextStyle})`;
            i += 2;
          } else if (nextStyle && !nextCharTest && (!nextCategory || nextException)) {
            const formattedNextStyle = stringifyCategory(category, camelToDash(nextStyle));

            mediaString += `${mediaString ? ' ' : ''}(${formattedStyle}: ${formattedNextStyle})`;
          } else {
            mediaString += `${mediaString ? ' ' : ''}(${formattedStyle})`;
          }
          break;
        }
        default: {
          if (paramIndex > -1) {
            htmlPseudoString += style;
          } else {
            failedStyles.push(style);
          }
          break;
        }
      }
    }
  }

  console.log('3 add', paramString);

  return {
    htmlPseudoString,
    mediaString,
    paramString,
    failedStyles,
  };
};

export default handleAdd;
