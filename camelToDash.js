const camelToDash = string => string
  && string.replace(/[A-Z]/g, (match, offset) => (offset > 0 ? '-' : '') + match.toLowerCase());

export default camelToDash;
