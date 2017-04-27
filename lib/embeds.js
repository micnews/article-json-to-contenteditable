/* @flow */

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

const TwitterEmbedWrapper = (opts: TwitterEmbedPropsType) => <TwitterEmbed {...opts} />;
const InstagramEmbedWrapper = (opts: InstagramEmbedPropsType) => <InstagramEmbed {...opts} />;
const FacebookEmbedWrapper = (opts: FacebookEmbedPropsType) => <FacebookEmbed {...opts} />;
const TumblrEmbedWrapper = (opts: TumblrEmbedPropsType) => <TumblrEmbed {...opts} />;

const embeds = {
  twitter: TwitterEmbedWrapper,
  instagram: InstagramEmbedWrapper,
  facebook: FacebookEmbedWrapper,
  tumblr: TumblrEmbedWrapper,
  image: ({ src }: { src: string, }) => renderEmbed({ type: 'image', src }),
  youtube: ({ youtubeId }: { youtubeId: string, }) =>
    renderEmbed({ type: 'youtube', youtubeId }),
  vine: ({ url }: { url: string, }) => renderEmbed({ type: 'vine', url }),
  spotify: ({ url }: { url: string, }) => renderEmbed({ type: 'spotify', url }),
  custom: ({ src, width, height, secure }: CustomEmbedPropsType) =>
    (secure && renderEmbed({ type: 'custom', src, width, height })) || '',
};

export default embeds;
