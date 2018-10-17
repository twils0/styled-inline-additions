import inlineAdditions from '../inlineAdditions';
import inlineConvert from '../inlineConvert';

global.console.error = jest.fn();
jest.mock('../inlineConvert', () => jest.fn());

describe('inlineAdditions', () => {
  beforeEach(() => {
    global.console.error.mockReset();
    inlineConvert.mockReset();
  });

  it('throws a console error when provided an addString prop that is not a string', () => {
    const props = {
      addString: {},
    };

    inlineAdditions(props);

    expect(console.error).toMatchSnapshot();
    expect(inlineConvert).not.toBeCalled();
  });

  it('throws a console error when provided an addObject prop that is not an object (not counting arrays)', () => {
    const addObject = [];
    const props = {
      addObject,
    };

    inlineAdditions(props);

    expect(console.error).toMatchSnapshot();
    expect(inlineConvert).not.toBeCalled();
  });

  it('throws a console error when returned a failedStyles array with length greater than 0', () => {
    const addObject = {};
    const props = {
      addObject,
    };
    const failedStyles = ['testStyle'];

    inlineConvert.mockReturnValue({ failedStyles });

    inlineAdditions(props);

    expect(console.error).toMatchSnapshot();
    expect(inlineConvert).toBeCalledWith(addObject);
  });

  it('correctly returns a style string for addString and addObject', () => {
    const addString = 'testCss1: testStyle1';
    const addObject = { testCss2: 'testStyle2' };
    const styleString = 'testCss2: testStyle2\n';
    const failedStyles = [];
    const props = {
      addString,
      addObject,
    };
    const expectedResult = `\n${addString}\n\n${styleString}\n`;

    inlineConvert.mockReturnValue({ styleString, failedStyles });

    const result = inlineAdditions(props);

    expect(console.error).not.toBeCalled();
    expect(inlineConvert).toBeCalledWith(addObject);
    expect(result).toEqual(expectedResult);
  });
});
