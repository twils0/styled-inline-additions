const stringifyType = (type, key) => {
  switch (type) {
    case 'htmlElement':
      return key;
    case 'pseudoClass' || 'pseudoClassParam':
      return `:${key}`;
    case 'pseudoElement' || 'pseudoElementParam':
      return `::${key}`;
    case 'pseudoElementDash':
      return `::-${key}`;
    case 'mediaQuery':
      return `@${key}`;
    default:
      return key;
  }
};

export default stringifyType;
