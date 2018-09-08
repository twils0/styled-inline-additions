const camelToDash = string => {
  return string.replace(
    /[A-Z]/g,
    (match, offset, string) => (offset > 0 ? '-' : '') + match.toLowerCase()
  );
};

export default camelToDash;
