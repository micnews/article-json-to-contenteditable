import {render as renderEmbed} from 'embeds';
import FacebookEmbed from './embeds/facebook';
import InstagramEmbed from './embeds/instagram';
import element from 'magic-virtual-element';

const embeds = {
  youtube: ({youtubeId}) => renderEmbed({type: 'youtube', youtubeId}),
  image: ({src}) => renderEmbed({type: 'image', src}),
  twitter: ({text, url, date, user, id}) => renderEmbed({type: 'twitter', text, url, date, user, id}),
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

export default embeds;
