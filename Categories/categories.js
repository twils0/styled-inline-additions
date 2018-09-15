import htmlElements from './htmlElements';
import { pseudoClasses, pseudoClassesParam } from './pseudoClasses';
import { pseudoElements, pseudoElementsParam, pseudoElementsDash } from './pseudoElements';
import { mediaTypes, mediaFeatures } from './mediaTypesFeatures';

const cssCategories = {
  ...htmlElements,
  ...pseudoClasses,
  ...pseudoClassesParam,
  ...pseudoElements,
  ...pseudoElementsParam,
  ...pseudoElementsDash,
  ...mediaTypes,
  ...mediaFeatures,
  media: 'mediaQuery',
};

export default cssCategories;
