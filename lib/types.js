/* @flow */

import React from 'react';

export type TextItemType = {
  type: string,
  content?: string,
  children?: Array<TextItemType>,
  mark?: boolean,
  markClass?: string,
  italic?: boolean,
  bold?: boolean,
  strikethrough?: boolean,
  href?: string,
};
export type TextItemsType = Array<TextItemType>;

export type ElementType = string | React.Element<*>;
export type ElementsType = Array<ElementType>;

export type KeydownEventType = Event & {
  keyCode: number,
  metaKey: boolean,
  key: string,
};
export type GetCustomKeyDownType = (KeydownEventType) => void;

export type IFrameWithPropsType = HTMLIFrameElement & {
  __props__?: Object,
};
