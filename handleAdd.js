import camelToDash from './camelToDash';

import { htmlMediaCategories } from './Categories/categories';

const handleAdd = (styles) => {
  let stylesArray = null;
  let htmlString = '';
  let mediaString = '';
  let paramString = '';
  const failedStyles = [];
  let stylesString = '';

  if (typeof styles === 'string') {
    stylesString = styles;
  } else if (typeof styles === 'object') {
    stylesString = JSON.stringify(styles);
  }

  stylesArray = stylesString
    .replace(/[^A-Za-z0-9,>&|!*:-]/g, '')
    .replace(/([,>&|!*:-]+[,>&|!*:-]+)/g, (match) => {
      const first = match[0];
      const last = match.slice(-1);

      if (first === last) {
        if (first === '&' || first === '|') {
          return `${first}${first}`;
        }
        return first;
      }
      return `${first}${last}`;
    })
    .split(/([,>&|!*:-])/g)
    .filter(value => value);

  console.log('styles array', stylesArray);

  for (let i = 0; i < stylesArray.length; i += 1) {
    const style = stylesArray[i];
    const prevStyle = stylesArray[i - 1];
    const nextStyle = stylesArray[i + 1];
    const prevType = htmlMediaCategories[prevStyle];
    const nextType = htmlMediaCategories[nextStyle];

    if (style.length === 1) {
      switch (style) {
        case ',': {
          const prevPrevStyle = stylesArray[i - 2];
          const nextNextStyle = stylesArray[i + 2];
          const prevPrevType = htmlMediaCategories[prevPrevStyle];
          const nextNextType = htmlMediaCategories[nextNextStyle];

          if (
            prevType === 'htmlElement'
            && (nextType === 'htmlElement'
              || (nextStyle.length === 1 && nextNextType === 'htmlElement'))
          ) {
            if (nextStyle.length === 1 && !nextType) {
              htmlString += `, ${nextNextStyle}`;
              i += 2;
            } else {
              htmlString += `, ${nextStyle}`;
              i += 1;
            }
          } else if (
            (prevType === 'mediaType'
              || prevType === 'mediaFeature'
              || prevPrevType === 'mediaType'
              || prevPrevType === 'mediaFeature')
            && (nextType === 'mediaType'
              || nextType === 'mediaFeature'
              || (nextStyle.length === 1
                && (nextNextType === 'mediaType' || nextNextType === 'mediaFeature')))
          ) {
            if (nextStyle.length === 1) {
              mediaString += `, ${nextNextStyle}`;
              i += 2;
            } else {
              mediaString += `, ${nextStyle}`;
              i += 1;
            }
          } else {
            failedStyles.concat(style);
          }
          break;
        }
        case '>': {
          const nextNextStyle = stylesArray[i + 2];
          const nextNextType = htmlMediaCategories[nextNextStyle];

          if (
            prevType === 'htmlElement'
            && (nextType === 'htmlElement'
              || (nextStyle.length === 1 && nextNextType === 'htmlElement'))
          ) {
            if (nextStyle.length === 1 && !nextType) {
              htmlString += ` > ${nextNextStyle}`;
              i += 2;
            } else {
              htmlString += ` > ${nextStyle}`;
              i += 1;
            }
          } else {
            failedStyles.concat(style);
          }
          break;
        }
        case '&': {
          const prevPrevStyle = stylesArray[i - 2];
          const nextNextStyle = stylesArray[i + 2];
          const prevPrevType = htmlMediaCategories[prevPrevStyle];
          const nextNextType = htmlMediaCategories[nextNextStyle];

          if (
            (prevType === 'mediaType'
              || prevType === 'mediaFeature'
              || prevPrevType === 'mediaType'
              || prevPrevType === 'mediaFeature')
            && (nextType === 'mediaType'
              || nextType === 'mediaFeature'
              || (nextStyle.length === 1
                && (nextNextType === 'mediaType' || nextNextType === 'mediaFeature')))
          ) {
            if (nextStyle.length === 1 && !nextType) {
              i += 2;
            } else {
              i += 1;
            }
            mediaString += ' and';
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '|': {
          const prevPrevStyle = stylesArray[i - 2];
          const nextNextStyle = stylesArray[i + 2];
          const prevPrevType = htmlMediaCategories[prevPrevStyle];
          const nextNextType = htmlMediaCategories[nextNextStyle];

          if (
            (prevType === 'mediaType'
              || prevType === 'mediaFeature'
              || prevPrevType === 'mediaType'
              || prevPrevType === 'mediaFeature')
            && (nextType === 'mediaType'
              || nextType === 'mediaFeature'
              || (nextStyle.length === 1
                && (nextNextType === 'mediaType' || nextNextType === 'mediaFeature')))
          ) {
            if (nextStyle.length === 1 && !nextType) {
              i += 2;
            } else {
              i += 1;
            }
            mediaString += ',';
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '!': {
          const nextNextStyle = stylesArray[i + 2];
          const nextNextType = htmlMediaCategories[nextNextStyle];

          if (
            nextType === 'mediaType'
            || nextType === 'mediaFeature'
            || (nextStyle.length === 1
              && (nextNextType === 'mediaType' || nextNextType === 'mediaFeature'))
          ) {
            mediaString += ' not';
          } else {
            failedStyles.push(style);
          }
          break;
        }
        case '*': {
          const nextNextStyle = stylesArray[i + 2];
          const nextNextType = htmlMediaCategories[nextNextStyle];

          if (
            nextType === 'mediaType'
            || nextType === 'mediaFeature'
            || (nextStyle.length === 1
              && (nextNextType === 'mediaType' || nextNextType === 'mediaFeature'))
          ) {
            mediaString += ' only';
          } else {
            failedStyles.push(style);
          }
          break;
        }
        default: {
          const prevPrevStyle = stylesArray[i - 2];
          const nextNextStyle = stylesArray[i + 2];
          const prevPrevType = htmlMediaCategories[prevPrevStyle];
          const nextNextType = htmlMediaCategories[nextNextStyle];

          if (prevType === 'htmlElement' && nextStyle === ',' && nextNextType === 'htmlElement') {
            htmlString += `, ${nextNextStyle}`;
            i += 2;
          } else if (
            prevType === 'htmlElement'
            && nextStyle === '>'
            && nextNextType === 'htmlElement'
          ) {
            htmlString += ` > ${nextNextStyle}`;
            i += 2;
          } else if (
            (prevType === 'mediaType'
              || prevType === 'mediaFeature'
              || prevPrevType === 'mediaType'
              || prevPrevType === 'mediaFeature')
            && nextStyle === '&'
            && (nextNextType === 'mediaType' || nextNextType === 'mediaFeature')
          ) {
            mediaString += ' and';
            i += 2;
          } else if (
            (prevType === 'mediaType'
              || prevType === 'mediaFeature'
              || prevPrevType === 'mediaType'
              || prevPrevType === 'mediaFeature')
            && nextStyle === '|'
            && (nextNextType === 'mediaType' || nextNextType === 'mediaFeature')
          ) {
            mediaString += ',';
            i += 2;
          } else if (
            nextStyle === '!'
            && (nextNextType === 'mediaType' || nextNextType === 'mediaFeature')
          ) {
            mediaString += ' not';
          } else if (
            nextStyle === '*'
            && (nextNextType === 'mediaType' || nextNextType === 'mediaFeature')
          ) {
            mediaString += ' only';
          } else {
            failedStyles.push(style);
          }
          break;
        }
      }
    } else {
      const type = htmlMediaCategories[style];

      switch (type) {
        case 'htmlElement': {
          // all html styles are handled by the , and > cases above, except the first,
          // which is handled below
          htmlString += `${style}`;
          break;
        }
        case 'mediaTypes': {
          const nextNextStyle = stylesArray[i + 2];
          const nextNextType = htmlMediaCategories[nextNextStyle];
          const formattedStyle = camelToDash(style);

          if (nextStyle === ':' && (nextNextStyle.length > 1 || !nextNextType)) {
            const formattedNextNextStyle = camelToDash(nextNextStyle);

            mediaString += `${
              mediaString.length > 1 ? ' ' : ''
            }(${formattedStyle}: ${formattedNextNextStyle})`;
            i += 2;
          } else if (nextStyle.length > 1 || !nextType) {
            const formattedNextStyle = camelToDash(nextNextStyle);

            mediaString += `${
              mediaString.length > 1 ? ' ' : ''
            }(${formattedStyle}: ${formattedNextStyle})`;
          } else {
            mediaString += `${mediaString.length > 1 ? ' ' : ''}(${formattedStyle})`;
          }
          break;
        }
        case 'mediaFeatures': {
          mediaString += `${mediaString.length > 1 ? ' ' : ''}${camelToDash(style)}`;
          break;
        }
        default: {
          // assumed to be a param
          paramString += style;
          break;
        }
      }
    }
  }

  console.log(htmlString);

  return {
    htmlString,
    paramString,
    mediaString,
    failedStyles,
  };
};

export default handleAdd;
