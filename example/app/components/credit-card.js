import Ember from 'ember';
import Form from '../utils/form';

export default Ember.Component.extend({
  init() {
    this._super.apply(this, arguments);
    this._form = new Form();
    this._form.struct.on("swap", Ember.run.bind(this, "reform"));
    this.reform();
    window.form = this._form;
  },
  destroy() {
    this.form.destroy();
    this._super.apply(this, arguments);
  },
  reform() {
    var json = this._form.toJSON();
    console.log("json = ", json);
    this.set('form', json);
  },
  input: function(e) {
    const name = e.target.name;
    if (!!name) {
      this._form.set(name, e.target.value);
    }
  }
});
