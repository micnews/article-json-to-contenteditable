/* @flow */
/* eslint-disable no-script-url */

import React from 'react';

import type { IFrameWithPropsType } from '../types';

type PropsType = {|
  url?: string,
  type: string,
  height: number,
  id?: string,
  passRef?: (IFrameWithPropsType) => void,
|};

const EmbedIframe = ({ id, url = '', height, type, passRef = () => {} }: PropsType) => {
  const embedId = id || url.replace(/https:\/\/[^/]*\//, '').replace(/\W+/g, '');
  return (<iframe
    id={`${type}-${embedId}`}
    type={`${type}`}
    frameBorder='0'
    width='100%'
    src='javascript:false'
    height={height}
    ref={passRef}
  />);
};

export default EmbedIframe;
