const stringifyCategory = (type, key) => {
  switch (type) {
    case 'htmlElement':
      return key;
    case 'pseudoClass':
    case 'pseudoClassParam':
      return `:${key}`;
    case 'pseudoElement':
    case 'pseudoElementParam':
      return `::${key}`;
    // case 'pseudoClassDash':
    // return `:-${key}`;
    case 'pseudoElementDash':
      return `::-${key}`;
    case 'mediaQuery':
      return `@${key}`;
    default:
      return key;
  }
};

export default stringifyCategory;
