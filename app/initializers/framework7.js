/* global Framework7 */
import { schedule } from '@ember/runloop';

export function initialize() {
  return schedule('afterRender', function () {
    new Framework7({
      theme: 'md'
    });
  });
}

export default {
  name: 'framework7',
  initialize
};