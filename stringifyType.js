const stringifyType = (type, key) => {
  switch (type) {
    case 'htmlElement':
      return key;
      break;
      break;
    case 'pseudoClass' || 'pseudoClassParam':
      return `:${key}`;
      break;
    case 'pseudoElement' || 'pseudoElementParam':
      return `::${key}`;
      break;
    case 'pseudoElementDash':
      return `::-${key}`;
      break;
    case 'mediaQuery':
      return `@${key}`;
      break;
    default:
      return key;
      break;
  }
};

export default stringifyType;
