import inlineConvert from '../inlineConvert';

describe('inlineConvert', () => {
  it('correctly returns empty strings and empty failedStyles array, when provided a null or undefined object', () => {
    const testObject = undefined;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual('');
    expect(failedStyles).toEqual([]);
  });

  it('correctly returns empty strings and empty failedStyles array, when provided am array', () => {
    const testObject = [];

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual('');
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, regular css and number style value', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      testNum: 1,
      p: {
        alignItems: 'center',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
p {
align-items: center;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual(['testNum']);
  });

  it('correctly converts inline styles object to css string, undefined style value, html with add string 1', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      testUndef: undefined,
      a: {
        add: ',div>|,.button,> select',
        flex: '1 1',
        fontSize: '15px',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > button, select {
flex: 1 1;
font-size: 15px;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual(['testUndef']);
  });

  it('correctly converts inline styles object to css string, null style value, html with add string 2', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      testNull: null,
      a: {
        add: 'div>,  >>...button, p>> select',
        p: {
          add: ['lang', '%en', '_not', 'a', 'div'],
          flex: '1 1',
        },
        dir: {
          add: '%ltr',
          background: 'green',
        },
        fontSize: '15px',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > button, p > select {
p:lang(en), &:not, a, div {
flex: 1 1;
}
&:dir(ltr) {
background: green;
}
font-size: 15px;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual(['testNull']);
  });

  it('correctly converts inline styles object to css string, html with add string 3', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: 'div>,  >>...button, p>> select',
        p: {
          add: ['lang', 'en', '_not', '%a', '%div'],
          flex: '1 1',
        },
        hover: {
          add: 'testStyle1, p',
          alignItems: 'flex-start',
        },
        testKey1: { testKey2: 'testStyle2' },
        fontSize: '15px',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > button, p > select {
p:lang, &:not(a, div) {
flex: 1 1;
}
&:hover, p {
align-items: flex-start;
}
font-size: 15px;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([',', 'en', 'testStyle1', 'testKey1']);
  });

  it('correctly converts inline styles object to css string, html with add array 1', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: ['div', 'p  >>>!button', '|>select'],
        flex: '1 1',
        fontSize: '15px',
      },
      div: {
        add: 'nthChild, %4n',
        flex: '1 1',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div, p > button, select {
flex: 1 1;
font-size: 15px;
}
div:nth-child(4n) {
flex: 1 1;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, html with add array 2', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: ['div>>,', 'p >&button', '>>select'],
        flex: '1 1',
        fontSize: '15px',
        hostContext: {
          add: '%main content',
          flex: '1 1',
        },
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > p > button, select {
flex: 1 1;
font-size: 15px;
&:host-context(main content) {
flex: 1 1;
}
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, media query with empty object, html with add array 3', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: ['div>>,', 'p |>button', '>>select'],
        flex: '1 1',
        fontSize: '15px',
        hostContext: {
          add: 'main content, p',
          flex: '1 1',
        },
        media: {},
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > p > button, select {
flex: 1 1;
font-size: 15px;
&:host-context, p {
flex: 1 1;
}
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual(['|', 'main content']);
  });

  it('correctly converts inline styles object to css string, html and media query with add array 4', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: ['div>>,', '%p >&button', '>>select'],
        flex: '1 1',
        fontSize: '15px',
      },
      outOfRange: {
        flex: '1 1',
      },
      media: {
        add: ['screen&', 'maxWidth', ':750px &', 'minWidth:', '250px'],
        display: 'none',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > p > button, select {
flex: 1 1;
font-size: 15px;
}
&:out-of-range {
flex: 1 1;
}
@media screen and (max-width: 750px) and (min-width: 250px) {
display: none;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, media query with add string 1', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: 'div>|,.button,> select',
        flex: '1 1',
        fontSize: '15px',
      },
      media: {
        add: 'screen, !print & test fail >& width: 145px,& mediaHover',
        flex: '1 1',
        alignItems: 'center',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > button, select {
flex: 1 1;
font-size: 15px;
}
@media screen, not print and (width: 145px), (hover) {
flex: 1 1;
align-items: center;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual(['&', 'test fail', '>']);
  });

  it('correctly converts inline styles object to css string, media query with add string 2', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: 'div>,>>...button, p>> select',
        flex: '1 1',
        fontSize: '15px',
        media: {
          add: '?& speech, ?print &!   width: 145px |& mediaHover: mediaHover',
          flex: '1 1',
          alignItems: 'center',
        },
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > button, p > select {
flex: 1 1;
font-size: 15px;
@media only speech, only print and not (width: 145px), (hover: hover) {
flex: 1 1;
align-items: center;
}
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, media query with add string 3', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: 'div>,>>...button, p>> select',
        flex: '1 1',
        fontSize: '15px',
        media: {
          add: '!&screen, ?print +&   width: 145px ~, mediaHover: mediaHover',
          flex: '1 1',
          alignItems: 'center',
        },
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > button, p > select {
flex: 1 1;
font-size: 15px;
@media not screen, only print and (width: 145px), (hover: hover) {
flex: 1 1;
align-items: center;
}
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual(['+', '~']);
  });

  it('correctly converts inline styles object to css string, media query with add array 1', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: 'div>,>>...button, p>> select',
        flex: '1 1',
        fontSize: '15px',
        media: {
          add: 'screen, ?print &!   overflowBlock: scroll &&width: 145px, mediaHover: none',
          flex: '1 1',
          alignItems: 'center',
        },
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > button, p > select {
flex: 1 1;
font-size: 15px;
@media screen, only print and not (overflow-block: scroll) and (width: 145px), (hover: none) {
flex: 1 1;
align-items: center;
}
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, media query with add array 2', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: 'div>,>>...button, p>> select',
        flex: '1 1',
        fontSize: '15px',
        media: {
          add: 'print, ?screen&!   width: 145px, mediaHover: mediaHover',
          flex: '1 1',
          alignItems: 'center',
        },
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > button, p > select {
flex: 1 1;
font-size: 15px;
@media print, only screen and not (width: 145px), (hover: hover) {
flex: 1 1;
align-items: center;
}
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, pseudo element with add string 1', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      slotted: {
        add: '%*',
        fontSize: '15px',
      },
      mozProgressBar: {
        backgroundColor: 'green',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
&::slotted(*) {
font-size: 15px;
}
&::-moz-progress-bar {
background-color: green;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, pseudo element with add string 2', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      p: {
        add: 'after _ div:before',
        content: 'testContent',
        fontSize: '15px',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
p::after div::before {
content: testContent;
font-size: 15px;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, pseudo element with add array 1', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      placeholder: {
        add: ['> div ?', 'p:', '    firstLetter'],
        content: 'testContent',
        fontSize: '15px',
      },
      nthLastChild: {
        add: ['%2 %', '&width:'],
        alignItems: 'center',
      },
    };

    const expectedString = `background: green;
justify-content: flex-end;
&::placeholder > div, p::first-letter {
content: testContent;
font-size: 15px;
}
&:nth-last-child(2) {
align-items: center;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual(['?', '%', ':']);
  });

  it('correctly converts inline styles object to css string, pseudo element with add array 2', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      mozRangeThumb: {
        content: 'testContent:',
        fontSize: '15px',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
&::-moz-range-thumb {
content: testContent;
font-size: 15px;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, pseudo class with add string 1', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      dir: {
        add: '!a _ test style _, p',
        content: 'testContent',
        fontSize: '15px',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
&:dir, a p {
content: testContent;
font-size: 15px;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual(['!', '_', 'test style']);
  });

  it('correctly converts inline styles object to css string, pseudo class with add string 2', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      dir: {
        add: '%ltr %,rtl + div',
        content: 'testContent',
        fontSize: '15px',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
&:dir(ltr, rtl) + div {
content: testContent;
font-size: 15px;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, pseudo class with add array 1', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      dir: {
        add: ',%ltr',
        content: 'testContent',
        fontSize: '15px',
      },
      body: {
        add: ['_not', '%p', '%div ~', 'a:', 'hover'],
        textDecoration: 'underline',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
&:dir(ltr) {
content: testContent;
font-size: 15px;
}
body &:not(p, div) ~ a:hover {
text-decoration: underline;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, pseudo class with add array 2', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      dir: {
        add: '%ltr :,not %, p, :lang%en',
        content: 'testContent',
        fontSize: '15px',
      },
      body: {
        add: ['_not', '%p', '%div +~a:', 'hover'],
        textDecoration: 'underline',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
&:dir(ltr), &:not(p), &:lang(en) {
content: testContent;
font-size: 15px;
}
body &:not(p, div) + a:hover {
text-decoration: underline;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, pseudo class with add array 3', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: 'not %, p, lang%en',
        content: 'testContent',
        fontSize: '15px',
      },
      not: {
        add: ['lang, %en, a:dir %ltr', 'hover'],
        textDecoration: 'underline',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a:not(p), &:lang(en) {
content: testContent;
font-size: 15px;
}
&:not, &:lang(en), a:dir(ltr), &:hover {
text-decoration: underline;
}
`;

    const {
      paramString, htmlPseudoString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlPseudoString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });
});
