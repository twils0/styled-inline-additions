import { htmlMediaCategories } from './Categories/categories';

const handleHtml = (htmlString, cleanedStyle) => {
  let formattedHtml = '';
  let failedString = '';
  const htmlArray = cleanedStyle.split('>');
  const htmlArrayLen = htmlArray.length;

  htmlArray.forEach((html, index) => {
    const type = htmlMediaCategories[html];

    if (type && type === 'htmlElement') {
      const htmlStringLen = htmlString.length;
      const htmlStringLastChar = htmlString[htmlStringLen - 1];
      const leftSideComma = htmlStringLastChar === ',';

      if (!htmlStringLastChar || htmlStringLastChar === '>' || leftSideComma) {
        const leftSideGreater = index > 0;
        const rightSideGreater = index < htmlArrayLen - 1;

        if (leftSideGreater && rightSideGreater) {
          if (leftSideComma) {
            formattedHtml = `${htmlString.substr(0, htmlStringLen - 1)} > ${html} >`;
          } else {
            formattedHtml = `${htmlString} ${html} >`;
          }
        } else if (rightSideGreater) {
          formattedHtml = `${htmlString} ${html} >`;
        } else if (leftSideGreater && leftSideComma) {
          formattedHtml = `${htmlString.substr(0, htmlStringLen - 1)} > ${html},`;
        } else {
          formattedHtml = `${htmlString} ${html},`;
        }
      }
    } else {
      failedString = html;
    }
  });

  return { formattedHtml, failedString };
};
