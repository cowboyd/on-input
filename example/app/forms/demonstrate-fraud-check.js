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
    input: {
      name: "",
      number: "",
      cvc: "",
      exp: ""
    },
    type: null,
    rules: {
      numberLongEnough: {
        isNotFulfilled: true
      },
      numberPassesLuhnCheck: {
        isNotFulfilled: true
      },
      numberPassesFraudCheck: {
        isNotFulfilled: true
      }
    },
    progress: {

    }
  });
  this.reference(['input', 'number']).observe(function(path, newValue, oldValue) {
    console.log("oldValue = ", oldValue);
    console.log("newValue = ", newValue);
    console.log("path = ", path);
    const number = newValue.getIn(['input', 'number']);
    console.log("number = ", number);
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
          reject(`(${number.length}/15)`);
        }
      default:
        if (number.length === 16) {
          resolve();
        } else {
          reject(`(${number.length}/16)`);
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
    }).then(function() {
      return _this.validate('numberPassesFraudCheck', function(resolve, reject) {
        //hax
        window.fraudCheck = {
          resolve: resolve,
          reject: reject
        };
      });
    });
  });
  this.reference(['input', 'exp']).observe(function(path, newValue, oldValue) {
    const exp = newValue.getIn(['input', 'exp']);
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
  this.reference(['input', 'cvc']).observe(function(path, newValue, oldValue) {
    const cvc = newValue.getIn(['input', 'cvc']);
    _this.validate('cvcIsValid', function(resolve, reject) {
      if (!cvc) {
        reject("can't be blank");
      } else {
        var cvcRegex = /\d{3,4}/;
        if (cvcRegex.test(cvc)) {
          resolve();
        } else {
          reject("invalid security code");
        }
      }
    });
  });
  this.reference(['input', 'name']).observe(function(path, newValue, oldValue) {
    const name = newValue.getIn(['input', 'name']);
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
        isNotFulfilled: true,
        isRejected: false,
        isSettled: false,
        isPending: true
      });
    });
    return new Promise(handler).then(function(result) {
      _this.cursor(['rules', ruleName]).update(function(attrs) {
        return attrs.merge({
          isFulfilled: true,
          isNotFulfilled: false,
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
          isNotFulfilled: true,
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
    return this.struct.cursor(path);
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
  get isValid() {
    const rules = this.rules;
    for (var i = 0; i < rules.length; i++) {
      if (!rules[i].isFulfilled) {
        return false;
      }
    }
    return true;
    return rules.reduce(function(currentValue, rule) {
      return currentValue && rule.isFulfilled;
    }, true);
  },
  get isInvalid() {
    return !this.isValid;
  },
  toJSON: function() {
    return Ember.merge(this.cursor().toJSON(), {
      type: this.type,
      isValid: this.isValid,
      isInvalid: this.isInvalid,
      progress: this.progress
    });
  },
  set: function(name, value) {
    this.struct.cursor('input').update(function(map) {
      return map.set(name, value);
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
