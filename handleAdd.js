import camelToDash from './camelToDash';
import handleHtml from './handleHtml';
import handleMedia from './handleMedia';

import htmlMediaCategories from './Categories/categories';

const handleAdd = styles => {
  let stylesArray = null;
  let htmlString = '';
  let paramString = '';
  let mediaString = '';
  let failedStyles = [];

  if (typeof styles === 'string') {
    stylesArray = styles.split(',');
  } else if (typeof styles === 'object' && styles.constructor === Array) {
    stylesArray = [...styles];
  }

  if (stylesArray && stylesArray.length > 0) {
    stylesArray.forEach(style => {
      if (typeof style === 'string') {
        const cleanedStyle = style.replace(/[^A-Za-z0-9->&:!]/g, '');
        const colonIndex = cleanedStyle.indexOf(':');

        if (cleanedStyle.indexOf('>') > -1) {
          const { formattedHtml, failedString } = handleHtml(htmlString, cleanedStyle);

          if (htmlString.length < formattedHtml.length) {
            htmlString = formattedHtml;
          }
          if (failedString) failedStyles.push(failedString);
        } else if (cleanedStyle.indexOf(':') > -1) {
          const { formattedMedia, failedString } = handleMedia(mediaString, cleanedStyle);

          if (mediaString.length > formattedMedia.length) {
            mediaString = formattedMedia;
          }
          if (failedString) {
            failedStyles.push(failedString);
          }
        } else {
          paramString += cleanedStyle;
        }
      }
    });
  }

  return { htmlString, paramString, mediaString, failedStyles };
};

export default handleAdd;
