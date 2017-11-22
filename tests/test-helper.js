/* global chai */
import {setResolver} from 'ember-mocha'

import resolver from './helpers/resolver'

const {isArray} = Array
const {keys} = Object
const flag = chai.util.flag

/* eslint-disable complexity */
// Taken from chai-subset
function compare (expected, actual) {
  if (typeof (actual) !== typeof (expected)) {
    return false
  }
  if (typeof (expected) !== 'object' || expected === null) {
    return expected === actual
  }
  if (!!expected && !actual) {
    return false
  }

  if (isArray(expected)) {
    if (typeof (actual.length) !== 'number') {
      return false
    }
    const aa = Array.prototype.slice.call(actual)
    return expected.every(function (exp) {
      return aa.some(function (act) {
        return compare(exp, act)
      })
    })
  }

  if (expected instanceof Date && actual instanceof Date) {
    return expected.getTime() === actual.getTime()
  }

  return keys(expected).every(function (key) {
    const eo = expected[key]
    const ao = actual[key]
    if (typeof (eo) === 'object' && eo !== null && ao !== null) {
      return compare(eo, ao)
    }
    return ao === eo
  })
}
/* eslint-enable complexity */

// Taken from chai-subset
chai.Assertion.addMethod('containSubset', function (expected) {
  const actual = flag(this, 'object')
  const showDiff = chai.config.showDiff

  this.assert(
    compare(expected, actual),
    'expected #{act} to contain subset #{exp}',
    'expected #{act} to not contain subset #{exp}',
    expected,
    actual,
    showDiff
  )
})

// Taken from chai-subset
chai.assert.containSubset = function (val, exp, msg) {
  new chai.Assertion(val, msg).to.be.containSubset(exp)
}

// Taken from chai-jquery
chai.Assertion.addMethod('class', function (className) {
  this.assert(
    flag(this, 'object').hasClass(className),
    'expected #{this} to have class #{exp}',
    'expected #{this} not to have class #{exp}',
    className
  )
})

// Taken from chai-jquery
chai.Assertion.overwriteChainableMethod('contain',
  function (_super) {
    return function (text) {
      const obj = flag(this, 'object')
      if ('jquery' in obj) {
        this.assert(
          obj.is(':contains(\'' + text + '\')')
          , 'expected #{this} to contain #{exp}'
          , 'expected #{this} not to contain #{exp}'
          , text)
      } else {
        _super.apply(this, arguments)
      }
    }
  },
  function (_super) {
    return function () {
      _super.call(this)
    }
  }
)

// FIXME: move this to ember-test-utils maybe? (ARM 2016-09-07)
chai.Assertion.addMethod('msg', function (msg) {
  flag(this, 'message', msg)
})

setResolver(resolver)
