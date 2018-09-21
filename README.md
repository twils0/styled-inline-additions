# styled-inline-additions

styled-inline-additions is extremely fast and light-weight (no dependencies; 15.9 KB minified; 4.3 KB minified + gzipped) module that converts a Javascript object of inline styles, with a few unique syntax additions to accomodate selectors, pseudo-classes, pseudo-elements, and media queries, to a string of valid CSS. styled-inline-additions also provides a small amount of error/typo correction (possibly more to come).

Please check out:

- [Performance Demo]() demo to showcase performance;
- [Getting Started](#getting-started) for a basic example;
- [Example](#example) for a more complex example; and,
- [Example Demo]() demo corresponding to the example
- [Documentation](#documentation)

### Motivation

styled-components is great. A separation between container and presentational components makes great sense. Sometimes, however, you may want a little leeway.

Alternatively, you may not agree with the separation between container and presentational components at all. You may simply want a way to add pseudo-classes, pseudo-elements, and media queries to your inline styles using Javascript (and you don't want to use Radium or any another CSS-in-JS option).

Maybe, you just need to convert styles from a Javascript object to a CSS string, and you don't mind styled-inline-additions' unique syntax.

### Version

v0.5.2-alpha - not yet production ready, but seems to work; please let me know what you think!

### Getting Started

styled-inline-additions looks for two props: 'addString' and 'addObject'.

It's as easy as:

```JSX
import styled from 'styled-components';
import inlineAdditions from 'styled-inline-additions';

const FlexRow = styled.div`
  display: flex;
  justify-content: center;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`;

const FlexColumn = styled.div`
  display: flex;
  justify-content: center;
  width: ${({ width }) => width};
  height: ${({ height }) => height};

  ${inlineAdditions}
`;
// why add 'align-self: ${({ alignSelf }) => alignSelf};' and
// 'background-color: ${props => props.backgroundColor};'
// to the styled-component above just to use align-self
// and background-color one time?

const PageGrid = props => {
  // instead why not add align-self, or any other CSS
  // just as you would normally, except you can't use
  // props (yet)
  const addString = `
    align-self: 'center';
  `;

  // you can also add background-color using inline styles
  // and styled-inline-additions unique syntax for selectors,
  // pseudo-classes, pseudo-elements, and media queries
  const addObject = {
    backgroundColor: '#9B6FCC',
  };

  return (
    <FlexRow width="100%" height="100%">
      <FlexColumn
        addString={addString}
        addObject={addObject}
        width="50%"
        height="50%"
      >
        <h2> Test Column </h2>
      </FlexColumn>
    </FlexRow>
  );
};

// inlineAdditions will output:
// `align-self: center;
// background-color: #9B6FCC;
// `
```

### Prerequisites

styled-inline-additions was built for and tested with React. It has no dependencies. If you're not using React, but styled-components works for you, there's a good chance styled-inline-additions will work as well.

### Installing

Install styled-inline-additions as a dependency:

```console
npm i -S styled-inline-additions
```

Import the styled-inline-additions module:

```javascript
import inlineAdditions from 'styled-inline-additions';

/*--- or ---*/

var inlineAdditions = require('styled-inline-additions').default;
```

### Example

Please find a more complex example with a demo below.

Please refer to the [Documentation](#documentation) to become familiar with the 'add' prop and reserved characters. Only reserved characters and [A-Za-z0-9] characters will be parsed; all other characters will be removed.

```JSX
import styled from 'styled-components';
import inlineAdditions from 'styled-inline-additions';

const FlexRow = styled.div`
  display: flex;
  justify-content: center;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`;

const FlexColumn = styled.div`
  display: flex;
  justify-content: center;
  width: ${({ width }) => width};
  height: ${({ height }) => height};

  ${inlineAdditions}
`;

const PageGrid = props => {
  const addObject = {
    backgroundColor: '#9B6FCC',
    alignSelf: 'center'
    div: {
      add: 'nthOfType   %    2n, div:%^$%^>> hover  '
      backgroundColor: 'green';
    },
    media: {
      add: ['screen    &  ', 'minWidth:', '250px()()()', { maxWidth: '750px' }],
      alignSelf: 'flex-start',
    },
  };

  return (
    <FlexRow width="100%" height="100%">
      <FlexColumn
        addString={addString}
        addObject={addObject}
        width="50%"
        height="50%"
      >
        <h2> Test Column </h2>
      </FlexColumn>
    </FlexRow>
  );
};

// inlineAdditions will output:
// `background-color: #9B6FCC;
// align-self: center;
// div:nth-of-type(2n), div:hover {
// background-color: green;
// }
// @media screen and (min-width: 250px) and (max-width: 750px) {
// align-self: flex-start;
// }
// `
```

## Documentation

- addStyle (string): a string of CSS; you should use normally CSS syntax and, you may include anything you would normally include in a styled-component string, except for props (support for props may be added in the future)

- addObject (object): styled-inline-additions follows regular inline style (camel case) syntax and also provides a unique syntax to parse html, pseudo-classes, pseudo-elements, and media queries;

  - add (array or string): include an 'add' key, with an array or string value, to add additional styling;

    - Rules:
      1. arrays may include nested objects;
      2. please keep in mind commas ',' and colons ':' contained in an array, nested object in an array, or a string, are counted as reserved characters:


    ```JSX
    <StyledDiv
      addObject={{
        backgroundColor: '#9B6FCC',
        p: {
          add: '> div > a',
          alignSelf: 'center',
          hover: {
            backgroundColor: 'green';
          },
        },
        media: {
          add: ['print', 'screen&', { maxWidth: '750px' }],
          width: '100%',
        },
      }}
    />

    // output:
    // `backgroundColor: #9B6FCC
    // p > div > a {
    // align-self: center;
    // &:hover {
    // background-color: green;
    // }
    // }
    // @media print, screen and (max-width: 750px) {
    // width: 100%;
    // }
    // `
    ```

    - Reserved Characters: styled-inline-additions looks for certain reserved characters when parsing the "add" prop;

      - Rules:
        1. only reserved characters and [A-Za-z0-9] characters will be parsed; all other characters will be removed;
        2. if a string of consecutive reserved characters is provided, only the first and last reserved character will be parsed ("&|>>|" would be parsed as "&|");
        3. the first relevant character (searching from left to right) of two consecutive characters will be used (if both '&' and '|' are relevant, '&' will be used) and the other character ignored;
        4. if both characters are irrelevant, both will be ignored;


      - spaces between two or more [A-Za-z0-9] characters or words will be kept; all other occurances of the space character will be removed;

      - [ - ] : dashes can be used when needed; pseudo-classes, pseudo-elements, media types, and media features should all be provided in camel case, without dashes

      - [ , ] : commas can be used as selectors ('p, div'); or, as logical operators for media queries ('print, screen');

      - [ > ] : greater-than signs can be used as selectors ('p > div');

      - [ _ ] : underscores can be used as a space selector ('body_p,div' will be parsed as 'body p, div)

      - [ + ] : plus signs can be used as selectors ('p + div');

      - [ ~ ] : tildes can be used as selectors ('p ~ div');

      - [ & ] : ampersands can be used as logical operators for media queries ('print & screen' will be parsed as 'print and screen')

      - [ | ] : vertical bars can be used as logical operators for media queries ('print | screen' will be parsed as 'print, screen')

      - [ ! ] : exclamation marks can be used as logical operators for media queries ('!print' will be parsed as 'not print')

      - [ ? ] : question marks can be used as logical operators for media queries ('?print' will be parsed as 'only print')

      - [ : ] : colons can be used to join html, pseudo-classes, and pseudo-elements ('a:focus:firstLine' will be parsed as 'a:focus::first-line'); or, with media features ('maxWidth:750px' will be parsed as '(max-width: 750px)')

      - [ % ] : percentage signs can be used to identify parameters, for pseudo-classes or pseudo-elements:


        ```JSX
        <StyledDiv
          addObject={{
            backgroundColor: '#9B6FCC',
            not: {
              add: ["%p", "%div", "nthChild %", "2n"],
              alignSelf: 'center',
            },
          }}
        />

        // output:
        // `backgroundColor: #9B6FCC
        // :not(p, div), nth-child(2n) {
        // align-self: center;
        // }
        // `
        ```

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
