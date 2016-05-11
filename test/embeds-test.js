import _test from 'tape-catch';
import FacebookEmbed from '../lib/embeds/facebook';
import {render, renderString, tree} from 'deku';
import element from 'magic-virtual-element';

const fs = require('fs');
const fixtures = {
  facebookPost:
    fs.readFileSync(`${__dirname}/fixtures/facebook-post.html`, 'utf8').trim()
};

const test = process.browser ? _test : function () {};

test('FacebookEmbed - body', t => {
  const actual = renderString(tree(<FacebookEmbed embedAs='post' />));
  const expected = renderString(tree(
    <iframe type='facebook' frameBorder='0' width='100%' src='javascript:false'></iframe>));
  t.equal(actual, expected);
  t.end();
});

test('FacebookEmbed - onLoaded', t => {
  const opts = {
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070',
    embedAs: 'post',
    date: 'Thursday, January 21, 2016',
    user: 'David Pop Hipsterson',
    text: [{
      content: 'Hey!So, for the last few weeks I\'ve worked on http://mic.com/ - the new home for mic.com (on desktop) - please take a look :)',
      href: null
    }]
  };
  const el = document.body.appendChild(document.createElement('div'));
  const expectedPost = fixtures.facebookPost;
  const onLoaded = () => {
    const iframeBody = el.querySelector('iframe').contentWindow.document.body;
    const actualPost = iframeBody.innerHTML.slice(0, expectedPost.length);

    t.equal(actualPost, expectedPost);
    t.end();
  };
  render(tree(<FacebookEmbed {...opts} onLoaded={onLoaded} />), el);
});

test('FacebookEmbed onResize', t => {
  const opts = {
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070',
    embedAs: 'post',
    date: 'Thursday, January 21, 2016',
    user: 'David Pop Hipsterson',
    text: [{
      content: 'Hey!So, for the last few weeks I\'ve worked on http://mic.com/ - the new home for mic.com (on desktop) - please take a look :)',
      href: null
    }]
  };

  const el = document.body.appendChild(document.createElement('div'));
  const expectedHeight = 150;
  const onResize = ({height}) => {
    t.equal(height, expectedHeight);
    t.end();
  };
  render(tree(<FacebookEmbed {...opts} onResize={onResize} />), el);
});
