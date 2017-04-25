/* @flow */
/* eslint-disable react/display-name */

import React from 'react';
import renderEmbed from 'article-json-react-embeds';

import FacebookEmbed from './embeds/facebook';
import InstagramEmbed from './embeds/instagram';
import TwitterEmbed from './embeds/twitter';
import TumblrEmbed from './embeds/tumblr';
import type { FacebookEmbedPropsType } from './embeds/facebook';
import type { InstagramEmbedPropsType } from './embeds/instagram';
import type { TwitterEmbedPropsType } from './embeds/twitter';
import type { TumblrEmbedPropsType } from './embeds/tumblr';

type CustomEmbedPropsType = {
  src: string,
  width: number,
  height: number,
  secure: boolean,
};

const embeds = {
  twitter: (opts: TwitterEmbedPropsType) => <TwitterEmbed {...opts} />,
  instagram: (opts: InstagramEmbedPropsType) => <InstagramEmbed {...opts} />,
  facebook: (opts: FacebookEmbedPropsType) => <FacebookEmbed {...opts} />,
  tumblr: (opts: TumblrEmbedPropsType) => <TumblrEmbed {...opts} />,
  image: ({ src }: { src: string, }) => renderEmbed({ type: 'image', src }),
  youtube: ({ youtubeId }: { youtubeId: string, }) =>
    renderEmbed({ type: 'youtube', youtubeId }),
  vine: ({ url }: { url: string, }) => renderEmbed({ type: 'vine', url }),
  spotify: ({ url }: { url: string, }) => renderEmbed({ type: 'spotify', url }),
  custom: ({ src, width, height, secure }: CustomEmbedPropsType) =>
    (secure && renderEmbed({ type: 'custom', src, width, height })) || '',
};

export default embeds;
