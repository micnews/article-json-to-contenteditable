/* @flow */
/* eslint-disable import/no-extraneous-dependencies */

import { renderToStaticMarkup } from 'react-dom/server';
import { Parser } from 'html-to-react';

export default (html: string) => {
  const reactComponent = new Parser().parse(html);
  const reactComponents = Array.isArray(reactComponent) ? reactComponent : [reactComponent];

  return reactComponents.map(component => renderToStaticMarkup(component)).join('');
};
