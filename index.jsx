import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { PhotoshopPicker } from 'react-color';

import inlineConvert from './inlineConvert';

const inlineAdditions = (...args) => {
  let styleString = '';

  args.forEach(arg => {
    Object.keys(arg).forEach(key => {
      switch (key) {
        case 'addString':
          if (typeof arg.inlineString === 'string') {
            styleString += '\n' + arg.inlineString + '\n';
          }
          break;
        case 'addObject':
          styleString += '\n' + inlineConvert(arg.inlineConvert) + '\n';
          break;
        default:
          break;
      }
    });
  });

  return styleString;
};
