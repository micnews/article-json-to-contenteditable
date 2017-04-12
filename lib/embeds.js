import React from 'react';
import { render as renderEmbed } from 'embeds';

import FacebookEmbed from './embeds/facebook';
import InstagramEmbed from './embeds/instagram';
import TwitterEmbed from './embeds/twitter';
import TumblrEmbed from './embeds/tumblr';

function renderFacebook(opts) {
  return <FacebookEmbed {...opts} />;
}

function renderInstagram(opts) {
  return <InstagramEmbed {...opts} />;
}

function renderTwitter(opts) {
  return <TwitterEmbed {...opts} />;
}

function renderTumblr(opts) {
  return <TumblrEmbed {...opts} />;
}

const embeds = {
  youtube: ({ youtubeId }) => renderEmbed({ type: 'youtube', youtubeId }),
  image: ({ src }) => renderEmbed({ type: 'image', src }),
  twitter: opts => renderTwitter(opts),
  vine: ({ url }) => renderEmbed({ type: 'vine', url }),
  instagram: opts => renderInstagram(opts),
  facebook: opts => renderFacebook(opts),
  spotify: ({ url }) => renderEmbed({ type: 'spotify', url }),
  tumblr: opts => renderTumblr(opts),
  custom: ({ src, width, height, secure }) =>
    (secure && renderEmbed({ type: 'custom', src, width, height })) || '',
};

export default embeds;
