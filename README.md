# article-json-to-contenteditable [![Build Status](https://travis-ci.org/micnews/article-json-to-contenteditable.png?branch=master)](https://travis-ci.org/micnews/article-json-to-contenteditable)



## Installation

```sh
npm install article-json-to-contenteditable --save
```

## Usage

```js
/* eslint-disable no-console */

import React, { Component } from 'react';
import { render } from 'react-dom';

import setupArticle from './lib';

const Article = setupArticle();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [{
        type: 'header1',
        children: [{
          type: 'text',
          content: 'Text text text',
          href: null,
          italic: false,
          bold: false,
          mark: false,
          markClass: null,
        }],
      }, {
        type: 'embed',
        embedType: 'facebook',
        url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070',
        embedAs: 'post',
        date: 'Thursday, January 21, 2016',
        user: 'David Pop Hipsterson',
        text: [{
          content: 'Hey! So, for the last few weeks I\'ve worked on https://mic.com/ - the new home for mic.com - please take a look :)',
          href: null,
        }],
      }, {
        type: 'embed',
        embedType: 'instagram',
        caption: [],
        date: {},
        user: {},
        id: 'tsxp1hhQTG',
        text: '',
        url: 'https://instagram.com/p/tsxp1hhQTG',
      }, {
        type: 'embed',
        embedType: 'vine',
        caption: [],
        id: 'iHTTDHz6Z2v',
        url: 'https://vine.co/v/iHTTDHz6Z2v/embed/simple',
      }, {
        type: 'header1',
        children: [{
          type: 'text',
          content: 'Text text text',
          href: null,
          italic: false,
          bold: false,
          mark: false,
          markClass: null,
        }],
      }, {
        type: 'embed',
        embedType: 'youtube',
        caption: [],
        youtubeId: 'I7IdS-PbEgI',
      }, {
        type: 'embed',
        embedType: 'custom',
        caption: [],
        width: 542,
        height: 987,
        secure: true,
        src: 'https://embed.tumblr.com/embed/post/Hj-X2tKsXur2oF91XMwT5w/141227828011?width=542&language=en_US&did=da39a3ee5e6b4b0d3255bfef95601890afd80709',
      }, {
        type: 'embed',
        embedType: 'custom',
        caption: [],
        width: 480,
        height: 268,
        secure: true,
        src: '//giphy.com/embed/j7ieM4wLOaNu8',
      }, {
        type: 'embed',
        embedType: 'twitter',
        caption: [],
        url: 'https://twitter.com/nvidia/status/699645794903666688',
        date: '',
        user: {
          name: null,
          slug: null,
        },
        id: '699645794903666688',
        text: [{
          content: 'Explore the power of mobility, flexibility, and collaboration at #GTC16. Learn more: http://nvda.ly/Y65h9 pic.twitter.com/cZ34wHVJaP',
          href: null,
        }],
      }],
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.getCustomKeyDown = this.getCustomKeyDown.bind(this);
  }

  onUpdate({ items, selectionBoundingClientRect, activeItem }) {
    console.log('in client.js onUpdate');
    console.log('selectionBoundingClientRect:', selectionBoundingClientRect);
    console.log('activeItem:', activeItem);
    this.setState({ items });
  }

  getCustomKeyDown(e) {
    // Return method(s) to handle any keydown events you want custom
    // handling for, like undo/redo etc.
    const zKeyCode = 90;
    if (e.metaKey && e.keyCode === zKeyCode) {
      this.setState({ undone: true });
      return function handleUndoRedo() {
        console.log('should undo/redo');
      };
    }

    return undefined;
  }

  render() {
    return (<Article
      items={this.state.items}
      onUpdate={this.onUpdate}
      getCustomKeyDown={this.getCustomKeyDown}
    />);
  }
}

const container = document.querySelector('#editor');
render(<App />, container);

```

## Tests

```sh
npm install
npm test
```

## Dependencies

- [article-json-react-embeds](https://github.com/micnews/article-json-react-embeds): Render article-json embeds using react
- [article-json-react-render](https://github.com/micnews/article-json-react-render): Render article json as react components
- [dift](https://github.com/ashaffer/dift): Super fast list diff algorithm
- [embeds](https://github.com/micnews/embeds): Parse &amp; render embeds
- [get-selection-range-from-elm](https://github.com/micnews/get-selection-range-from-elm): window.getSelection().rangeAt(0) but only if it exists &amp; is within an element
- [html-to-article-json](https://github.com/micnews/html-to-article-json): Converting HTML to article-json
- [immutable-array-methods](https://github.com/micnews/immutable-array-methods): Immutable versions of normally mutable array methods, such as pop(), push(), splice()
- [immutable-object-methods](https://github.com/micnews/immutable-object-methods): Update normal plain javascript object, immutable style. Simlar to how immutable.js, seamless-immutable etc does it but a lot smaller and simpler.
- [is-image](https://github.com/sindresorhus/is-image): Check if a filepath is an image
- [is-url](https://github.com/segmentio/is-url): Check whether a string is a URL.
- [keycode](https://github.com/timoxley/keycode): Convert between keyboard keycodes and keynames and vice versa.
- [react](https://github.com/facebook/react): React is a JavaScript library for building user interfaces.
- [react-dom](https://github.com/facebook/react): React package for working with the DOM.
- [save-selection](https://github.com/micnews/save-selection): Save &amp; restore selections in a document, using `&lt;mark&gt;` elements

## Dev Dependencies

- [babel-cli](https://github.com/babel/babel/tree/master/packages): Babel command line.
- [babel-plugin-transform-object-assign](https://github.com/babel/babel/tree/master/packages): Replace Object.assign with an inline helper
- [babel-preset-es2015](https://github.com/babel/babel/tree/master/packages): Babel preset for all es2015 plugins.
- [babel-preset-react](https://github.com/babel/babel/tree/master/packages): Babel preset for all React plugins.
- [babel-tape-runner](https://github.com/wavded/babel-tape-runner): Babel + Tape for running your ES Next tests
- [babel-watch](https://github.com/kmagiera/babel-watch): Reload your babel-node app on JS source file changes. And do it *fast*.
- [babelify](https://github.com/babel/babelify): Babel browserify transform
- [beefy](https://github.com/chrisdickinson/beefy): local development server that aims to make using browserify fast and fun
- [brfs](https://github.com/substack/brfs): browserify fs.readFileSync() static asset inliner
- [browserify](https://github.com/substack/node-browserify): browser-side require() the node way
- [create-event](https://github.com/kenany/create-event): Create an event object
- [devtool](https://github.com/Jam3/devtool): runs Node.js programs through Chromium DevTools
- [enzyme](https://github.com/airbnb/enzyme): JavaScript Testing utilities for React
- [faucet](https://github.com/substack/faucet): human-readable TAP summarizer
- [flow-bin](https://github.com/flowtype/flow-bin): Binary wrapper for Flow - A static type checker for JavaScript
- [miclint](https://github.com/micnews/miclint): Mic lint CLI
- [package-json-to-readme](https://github.com/zeke/package-json-to-readme): Generate a README.md from package.json contents
- [pretty](https://github.com/jonschlinkert/pretty): Some tweaks for beautifying HTML with js-beautify according to my preferences.
- [react-addons-test-utils](https://github.com/facebook/react): This package provides the React TestUtils add-on.
- [react-test-renderer](https://github.com/facebook/react): React package for snapshot testing.
- [snazzy](https://github.com/feross/snazzy): Format JavaScript Standard Style as Stylish (i.e. snazzy) output
- [tape](https://github.com/substack/tape): tap-producing test harness for node and browsers
- [tape-catch](https://github.com/michaelrhodes/tape-catch): a wrapper around tape that catches and reports exceptions


## License

MIT
