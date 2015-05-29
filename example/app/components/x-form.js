import Ember from 'ember';

export default Ember.Component.extend({
  init() {
    this._super.apply(this, arguments);
    const Form = this.get('formConstructor');
    this._form = new Form();
    this._form.struct.on("swap", Ember.run.bind(this, "reform"));
    this.reform();
  },
  // destroy() {
  //   this.form.destroy();
  //   this._super.apply(this, arguments);
  // },
  reform() {
    var json = this._form.toJSON();
    this.set('form', json);
  },
  input: function(e) {
    const name = e.target.name;
    if (!!name) {
      this._form.set(name, e.target.value);
    }
  },
  formConstructor: Ember.computed('type', function() {
    const type = this.get('type');
    if (!!type) {
      return this.container.lookupFactory(`form:${type}`);
    } else {
      return this.container.lookupFactory('util:form');
    }
  })
});
