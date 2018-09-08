import htmlElements from './htmlElements';
import { pseudoClasses, pseudoClassesParam } from './pseudoClasses';
import { pseudoElements, pseudoElementsParam, pseudoElementsDash } from './pseudoElements';
import { mediaTypes, mediaFeatures } from './mediaTypesFeatures';

export const cssCategories = {
  ...htmlElements,
  ...pseudoClasses,
  ...pseudoClassesParam,
  ...pseudoElements,
  ...pseudoElementsParam,
  ...pseudoElementsDash,
  media: 'mediaQuery',
};

export const htmlMediaCategories = {
  ...htmlElements,
  ...mediaTypes,
  ...mediaFeatures,
};
