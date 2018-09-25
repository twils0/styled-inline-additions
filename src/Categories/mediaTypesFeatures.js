export const mediaTypes = {
  all: 'mediaType',
  print: 'mediaType',
  screen: 'mediaType',
  speech: 'mediaType',
};

// any media feature that is used elsewhere should be prefixed
// with 'media'; for instance, 'hover' becomes 'mediaHover'
// this prefix is then filtered out by camelToDash function
export const mediaFeatures = {
  width: 'mediaFeature',
  minWidth: 'mediaFeature',
  maxWidth: 'mediaFeature',
  height: 'mediaFeature',
  minHeight: 'mediaFeature',
  maxHeight: 'mediaFeature',
  aspectRatio: 'mediaFeature',
  orientation: 'mediaFeature',
  resolution: 'mediaFeature',
  scan: 'mediaFeature',
  grid: 'mediaFeature',
  update: 'mediaFeature',
  overflowBlock: 'mediaFeature',
  overflowInline: 'mediaFeature',
  color: 'mediaFeature',
  colorGamut: 'mediaFeature',
  colorIndex: 'mediaFeature',
  displayMode: 'mediaFeature',
  monochrome: 'mediaFeature',
  invertedColors: 'mediaFeature',
  pointer: 'mediaFeature',
  mediaHover: 'mediaFeature',
  anyPointer: 'mediaFeature',
  anyHover: 'mediaFeature',
  lightLevel: 'mediaFeature',
  prefersReducedMotion: 'mediaFeature',
  prefersReducedTransparency: 'mediaFeature',
  prefersContrast: 'mediaFeature',
  prefersColorScheme: 'mediaFeature',
  scripting: 'mediaFeature',
  deviceWidth: 'mediaFeature',
  deviceHeight: 'mediaFeature',
  deviceAspectRatio: 'mediaFeature',
};

// media features that can also be an expr;
// for instance, (hover: hover)
export const mediaFeatureExceptions = {
  mediaHover: 'mediaFeature',
};
