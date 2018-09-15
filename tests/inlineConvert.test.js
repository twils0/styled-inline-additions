import inlineConvert from '../inlineConvert';

describe('inlineConvert', () => {
  it('correctly converts inline styles object to css string, regular css', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
    };
    const expectedString = `background: green;
justify-content: flex-end;
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

  it('correctly converts inline styles object to css string, html with add string and pseudo class 1', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: 'div>|,.button,> select',
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
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, html with add string and pseudo class 2', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: 'div>,  >>...button, p>> select',
        p: {
          add: ['lang', 'en'],
          flex: '1 1',
        },
        fontSize: '15px',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > button, p > select {
p:lang(en) {
flex: 1 1;
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
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, html with add array and pseudo class 1', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: ['div', 'p  >>>!button', '|>select'],
        flex: '1 1',
        fontSize: '15px',
      },
      div: {
        add: 'nthChild, 4n',
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

  it('correctly converts inline styles object to css string, html with add array and pseudo class 2', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: ['div>>,', 'p >&button', '>>select'],
        flex: '1 1',
        fontSize: '15px',
        hostContext: {
          add: 'main content',
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

  it('correctly converts inline styles object to css string, html with add array and pseudo class 3', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: ['div>>,', 'p >&button', '>>select'],
        flex: '1 1',
        fontSize: '15px',
      },
      outOfRange: {
        flex: '1 1',
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
        add: 'screen, !print & width: 145px, hover',
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
    expect(failedStyles).toEqual([]);
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
          add: '*print & width: 145px, hover: hover',
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
@media only print and (width: 145px), (hover: hover) {
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

  it('correctly converts inline styles object to css string, media query with add array 1', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: ['div', 'p >>>!button', '|>select'],
        flex: '1 1',
        fontSize: '15px',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div, p > button, select {
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
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, media query with add array 2', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: ['div>>,', 'p >&button', '>>select'],
        flex: '1 1',
        fontSize: '15px',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > p > button, select {
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
    expect(failedStyles).toEqual([]);
  });
});
