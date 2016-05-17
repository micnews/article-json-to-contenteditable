import {render as renderEmbed} from 'embeds';
import FacebookEmbed from './embeds/facebook';
import InstagramEmbed from './embeds/instagram';
import TwitterEmbed from './embeds/twitter';
import element from 'magic-virtual-element';

const embeds = {
  youtube: ({youtubeId}) => renderEmbed({type: 'youtube', youtubeId}),
  image: ({src}) => renderEmbed({type: 'image', src}),
  twitter: (opts) => renderTwitter(opts),
  vine: ({url}) => renderEmbed({type: 'vine', url}),
  instagram: (opts) => renderInstagram(opts),
  facebook: (opts) => renderFacebook(opts),
  custom: ({src, width, height, secure}) => secure && renderEmbed({type: 'custom', src, width, height}) || ''
};

function renderFacebook (opts) {
  return <FacebookEmbed {...opts} />;
}

function renderInstagram (opts) {
  return <InstagramEmbed {...opts} />;
}

function renderTwitter (opts) {
  return <TwitterEmbed {...opts} />;
}

export default embeds;
