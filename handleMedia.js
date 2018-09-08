import { htmlMediaCategories } from './Categories/categories';

const handlemedia = (mediaString, style) => {
  let formattedmedia = '';
  const mediaAmpArray = style.split('&');
  const mediaAmpArrayLen = mediaAmpArray.length;

  mediaAmpArray.forEach((mediaAmp, index) => {
    const mediaColonArray = mediaAmp.split(':');
    const mediaColonArrayLen = mediaColonArray.length;
    const media = mediaColonArray[0];
    const condition = mediaColonArray[1] || '';
    const type = htmlMediaCategories[media];

    if (type && (type === 'mediaType' || type === 'mediaFeature')) {
      const mediaStringLen = mediaString.length;
      const mediaStringLastChar = mediaStringLen > 0 && mediaString[mediaStringLen - 1];
      const leftSideComma = mediaStringLastChar === ',';

      if (!mediaStringLastChar || mediaStringLastChar === ':' || leftSideComma) {
        const leftSideAmp = index > 0;
        const rightSideAmp = index < mediaAmpArrayLen - 1;

        if (leftSideAmp && rightSideAmp) {
          if (leftSideComma) {
            formattedmedia = `${mediaString.substr(0, mediaStringLen - 1)} & ${media} &`;
          } else {
            formattedmedia = `${mediaString} ${media} >`;
          }
        } else if (rightSideAmp) {
          formattedmedia = `${mediaString} ${media} >`;
        } else if (leftSideAmp && leftSideComma) {
          formattedmedia = `${mediaString.substr(0, mediaStringLen - 1)} > ${media},`;
        } else {
          formattedmedia = `${mediaString} ${media},`;
        }
      }
    }
  });

  return formattedmedia;
};
