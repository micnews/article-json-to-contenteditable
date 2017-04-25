/* @flow */

import renderEmbed from 'article-json-react-embeds';

import FacebookEmbed from './embeds/facebook';
import InstagramEmbed from './embeds/instagram';
import TwitterEmbed from './embeds/twitter';
import TumblrEmbed from './embeds/tumblr';

type CustomEmbedPropsType = {
  src: string,
  width: number,
  height: number,
  secure: boolean,
};

const embeds = {
  twitter: TwitterEmbed,
  instagram: InstagramEmbed,
  facebook: FacebookEmbed,
  tumblr: TumblrEmbed,
  image: ({ src }: { src: string, }) => renderEmbed({ type: 'image', src }),
  youtube: ({ youtubeId }: { youtubeId: string, }) =>
    renderEmbed({ type: 'youtube', youtubeId }),
  vine: ({ url }: { url: string, }) => renderEmbed({ type: 'vine', url }),
  spotify: ({ url }: { url: string, }) => renderEmbed({ type: 'spotify', url }),
  custom: ({ src, width, height, secure }: CustomEmbedPropsType) =>
    (secure && renderEmbed({ type: 'custom', src, width, height })) || '',
};

export default embeds;
