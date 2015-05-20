import Ember from 'ember';

export function xNot(expr) {
  return !expr;
}

export default Ember.HTMLBars.makeBoundHelper(xNot);
