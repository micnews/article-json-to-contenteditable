/* @flow */
/* eslint-disable import/no-extraneous-dependencies */

export default (html: string) => html.replace(/<!-- react-text: \d* -->|<!-- \/react-text -->/g, '');
