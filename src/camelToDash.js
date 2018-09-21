const camelToDash = (string) => {
  const newString = /media[A-Z]/g.test(string) ? string.replace('media', '') : string;

  return (
    newString
    && newString.replace(/[A-Z]/g, (match, offset) => (offset > 0 ? '-' : '') + match.toLowerCase())
  );
};

export default camelToDash;
