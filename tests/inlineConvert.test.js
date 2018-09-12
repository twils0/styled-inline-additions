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
      paramString, htmlString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, html with add string 1', () => {
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
      paramString, htmlString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, html with add string 2', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: 'div>,>>...button, p>> select',
        lang: {
          add: 'p, en',
          flex: '1 1',
        },
        fontSize: '15px',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > button, p > select {
flex: 1 1;
font-size: 15px;
p:lang(en) {
flex: 1 1;
}
}
`;

    const {
      paramString, htmlString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });

  it('correctly converts inline styles object to css string, html with add array 1', () => {
    const testObject = {
      background: 'green',
      justifyContent: 'flex-end',
      a: {
        add: ['div', 'p >>>!button', '|>select'],
        flex: '1 1',
        fontSize: '15px',
      },
      nthChild: {
        add: '4n',
        flex: '1 1',
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div, p > button, select {
flex: 1 1;
font-size: 15px;
}
&:nth-child(4n) {
flex: 1 1;
}
`;

    const {
      paramString, htmlString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlString).toEqual('');
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
          add: ['main content'],
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
      paramString, htmlString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlString).toEqual('');
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
      },
      outOfRange: {
        add: ['main content'],
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
      paramString, htmlString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlString).toEqual('');
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
        add: 'screen, print & width: 145px, hover',
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
@media screen, print and (width: 145px), (hover) {
flex: 1 1;
align-items: center;
}
`;

    const {
      paramString, htmlString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlString).toEqual('');
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
      },
    };
    const expectedString = `background: green;
justify-content: flex-end;
a, div > button, p > select {
flex: 1 1;
font-size: 15px;
}
`;

    const {
      paramString, htmlString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlString).toEqual('');
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
      paramString, htmlString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlString).toEqual('');
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
      paramString, htmlString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlString).toEqual('');
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
      paramString, htmlString, mediaString, styleString, failedStyles,
    } = inlineConvert(
      testObject,
    );

    expect(paramString).toEqual('');
    expect(htmlString).toEqual('');
    expect(mediaString).toEqual('');
    expect(styleString).toEqual(expectedString);
    expect(failedStyles).toEqual([]);
  });
});
