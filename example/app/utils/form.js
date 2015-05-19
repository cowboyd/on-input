import Ember from 'ember';

const VISA_REGEX = /^4/;
const MASTERCARD_REGEX = /^5[1-5]/;
const AMEX_REGEX = /^3[47]/;
const DISCOVER_REGEX = /^6(?:011|5)/;
const DINERS_CLUB_REGEX = /^3(?:0[0-5]|[68])/;
const JCB_REGEX = /^(?:2131|1800|35)/;


function Form() {
  const _this = this;
  this.struct = immstruct({
    input: {},
    type: null,
    rules: {
      numberLongEnough: {},
      numberPassesLuhnCheck: {},
      expIsValid: {},
      ccvIsValid: {},
      nameIsValid: {}
    },
    progress: {

    }
  });
  this.ref = this.reference();
  this.reference(['input', 'number']).observe(function(newValue, oldValue, path) {
    const number = newValue.getIn(path);
    _this.validate('numberLongEnough', function(resolve, reject) {
      if (!number || number.length === 0) {
        reject("can't be blank");
      } else if (!_this.type) {
        reject("not enough digits");
      }

      switch(_this.type) {
      case 'diners':
      case 'amex':
        if (number.length === 15) {
          resolve();
        } else {
          reject(_this.type + ' cards should be exactly 15 digits');
        }
      default:
        if (number.length === 16) {
          resolve();
        } else {
          reject('card number should be exactly 16 digits');
        }
      }
    }).then(function() {
      return _this.validate('numberPassesLuhnCheck', function(resolve, reject) {
        if (luhnCheck(number)) {
          resolve();
        } else {
          reject('invalid card number');
        }
      });
    });
  });
  this.reference(['input', 'exp']).observe(function(newValue, oldValue, path) {
    const exp = newValue.getIn(path);
    _this.validate('expIsValid', function(resolve, reject) {
      if (!exp) {
        reject("can't be blank");
      } else {
        var expRegex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
        if (expRegex.test(exp)) {
          resolve();
        } else {
          reject("invalid expiration date");
        };
      }
    });
  });
  this.reference(['input', 'ccv']).observe(function(newValue, oldValue, path) {
    const ccv = newValue.getIn(path);
    _this.validate('ccvIsValid', function(resolve, reject) {
      if (!ccv) {
        reject("can't be blank");
      } else {
        var ccvRegex = /\d{3,4}/;
        if (ccvRegex.test(ccv)) {
          resolve();
        } else {
          reject("invalid security code");
        }
      }
    });
  });
  this.reference(['input', 'name']).observe(function(newValue, oldValue, path) {
    const name = newValue.getIn(path);
    _this.validate('nameIsValid', function(resolve, reject) {
      if (!name) {
        reject("can't be blank");
      } else {
        if (name.length >= 3) {
          resolve();
        } else {
          reject("name must be at least 3 characters");
        }
      }
    });
  });
}

Form.prototype = {

  get progress() {
    const _this = this;
    function ruleStats(stateName) {
      const rules = _this.filterBy('rules', 'is' + stateName, true);
      var ratio = rules.length / _this.rules.length;
      return {
        count: rules.length,
        ratio: ratio,
        percentage: Math.round(ratio * 100)
      };
    }
    return {
      fulfilled: ruleStats('Fulfilled'),
      rejected: ruleStats('Rejected'),
      pending: ruleStats('Pending'),
      settled: ruleStats('Settled')
    };
  },

  get rules() {
    const ruleData = this.cursor('rules').toJSON();
    return Object.keys(ruleData).map(function(name) {
      return ruleData[name];
    });
  },

  filterBy: function(collection, property, value) {
    let filterFn = function(item) {
      return item[property] === value;
    };
    if (typeof value === 'undefined') {
      filteFn = function(item) {
        return !!item[property];
      };
    }
    return this[collection].filter(filterFn);
  },

  validate: function(ruleName, handler) {
    const _this = this;
    _this.cursor(['rules', ruleName]).update(function(attrs) {
      return attrs.merge({
        isFulfilled: false,
        isRejected: false,
        isSettled: false,
        isPending: true
      });
    });
    return new Promise(handler).then(function(result) {
      _this.cursor(['rules', ruleName]).update(function(attrs) {
        return attrs.merge({
          isFulfilled: true,
          isRejected: false,
          isSettled: true,
          isPending: false,
          result: result
        });
      });
    }).catch(function(reason) {
      _this.cursor(['rules', ruleName]).update(function(attrs) {
        return attrs.merge({
          isFulfilled: false,
          isRejected: true,
          isSettled: true,
          isPending: false,
          reason: reason
        });
      });
      throw reason;
    });
  },
  reference: function(path) {
    return this.struct.reference(path);
  },
  cursor: function(path) {
    return this.ref.cursor(path);
  },
  get type() {
    const number = this.cursor("input").get('number');
    if (number.match(VISA_REGEX)) {return "visa";}
    else if (number.match(MASTERCARD_REGEX)) {return "mastercard";}
    else if (number.match(AMEX_REGEX)) {return "amex";}
    else if (number.match(DISCOVER_REGEX)) {return "discover";}
    else if (number.match(DINERS_CLUB_REGEX)) {return "diners";}
    else if (number.match(JCB_REGEX)) {return "jcb";}
    else {return undefined;}
  },
  get input() {
    return this.cursor('input').toJSON();
  },
  set input(input) {
    for (var property in input) {
      this.cursor('input').set(property, input[property]);
    }
  },
  get isValid() {
    const rules = this.rules;
    for (var i = 0; i < rules.length; i++) {
      if (!rules[i].isFulfilled) {
        return false;
      }
    }
    return true;
  },
  get isInvalid() {
    return !this.isValid;
  },
  toJSON: function() {
    return Ember.merge(this.cursor().toJSON(), {
      isValid: this.isValid,
      isInvalid: this.isInvalid,
      progress: this.progress
    });
  }
};

function luhnCheck(number) {
  // accept only digits, dashes or spaces
  if (/[^0-9-\s]+/.test(number)) {return false;}

  // The Luhn Algorithm. It's so pretty.
  var nCheck = 0, nDigit = 0, bEven = false;
  number = number.replace(/\D/g, "");

  for (var n = number.length - 1; n >= 0; n--) {
    var cDigit = number.charAt(n);
    nDigit = parseInt(cDigit, 10);

    if (bEven) {
      if ((nDigit *= 2) > 9) {nDigit -= 9;}
    }

    nCheck += nDigit;
    bEven = !bEven;
  }
  return (nCheck % 10) === 0;
}


export default Form;
