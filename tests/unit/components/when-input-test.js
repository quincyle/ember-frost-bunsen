import {expect} from 'chai'
import Ember from 'ember'
const {isEmpty, run} = Ember
import {DATE_VALUE} from 'ember-frost-bunsen/components/inputs/when'
import {setupComponentTest} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import moment from 'moment'
import sinon from 'sinon'

describe('Unit: frost-bunsen-input-when', function () {
  setupComponentTest('frost-bunsen-input-when', {
    unit: true
  })
  const ctx = {}
  let component, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    component = this.subject({
      bunsenId: 'foo',
      bunsenModel: {
        type: 'string'
      },
      bunsenView: {},
      cellConfig: {
        model: 'foo',
        renderer: {
          name: 'when'
        }
      },
      onChange () {},
      onError () {},
      state: Ember.Object.create({})
    })
    ctx.component = component
  })

  afterEach(function () {
    sandbox.restore()
    component = null
    sandbox = null

    Object.keys(ctx).forEach((key) => {
      delete ctx[key]
    })
  })

  it('size defaults to "small"', function () {
    expect(component.get('size')).to.eql('small')
  })

  it('dateFormat defaults to "YYYY-MM-DD"', function () {
    expect(component.get('dateFormat')).to.eql('YYYY-MM-DD')
  })

  it('timeFormat defaults to "HH:mm:ss"', function () {
    expect(component.get('timeFormat')).to.eql('HH:mm:ss')
  })

  it('dateTimeFormat defaults to "YYYY-MM-DDTHH:mm:ssZ"', function () {
    expect(component.get('dateTimeFormat')).to.eql('YYYY-MM-DDTHH:mm:ssZ')
  })

  describe('when init() is called without value', function () {
    let firstButtonValue = 'RIGHT_NOW'
    let onChangeSpy
    beforeEach(function () {
      onChangeSpy = sandbox.spy()
      component.setProperties({
        'cellConfig.renderer.value': firstButtonValue,
        onChange: onChangeSpy
      })
      component.init()
    })

    it('sets date', function () {
      expect(isEmpty(component.get('date'))).to.equal(false)
    })

    it('sets time', function () {
      expect(isEmpty(component.get('time'))).to.equal(false)
    })

    it('sets firstButtonValue', function () {
      expect(component.get('firstButtonValue')).to.equal(firstButtonValue)
    })

    it('sets selectedValue to value of first button', function () {
      expect(component.get('selectedValue')).to.equal(firstButtonValue)
    })

    it('sets storedDateTimeValue', function () {
      expect(isEmpty(component.get('storedDateTimeValue'))).to.equal(false)
    })
  })

  describe('when init() is called with value', function () {
    let firstButtonValue = 'RIGHT_NOW'
    let onChangeSpy
    beforeEach(function () {
      onChangeSpy = sandbox.spy()
      component.setProperties({
        'cellConfig.renderer.value': firstButtonValue,
        value: '2017-11-07T16:20:47+00:00',
        onChange: onChangeSpy
      })
      component.init()
    })

    it('sets date', function () {
      expect(isEmpty(component.get('date'))).to.equal(false)
    })

    it('sets time', function () {
      expect(isEmpty(component.get('time'))).to.equal(false)
    })

    it('sets firstButtonValue', function () {
      expect(component.get('firstButtonValue')).to.equal(firstButtonValue)
    })

    it('sets selectedValue to value of DATE_VALUE', function () {
      expect(component.get('selectedValue')).to.equal(DATE_VALUE)
    })

    it('sets storedDateTimeValue', function () {
      expect(moment(component.get('storedDateTimeValue')).valueOf())
        .to.equal(moment('2017-11-07T16:20:47+00:00').valueOf())
    })
  })

  describe('when selectDate() is called', function () {
    let onChangeSpy
    beforeEach(function () {
      onChangeSpy = sandbox.spy()
      component.set('onChange', onChangeSpy)
      component.send('selectDate', moment('2017-02-25'))
    })

    it('sets "storedDateTimeValue" for the second radio button', function () {
      expect(component.get('storedDateTimeValue')).to.include('2017-02-25')
    })

    it('calls onChange() with correct argument', function () {
      expect(onChangeSpy).to.have.been.calledWith('foo', sinon.match('2017-02-25'))
    })
  })

  describe('when selectedButton() is called', function () {
    let eventObject = {target: {value: null}}
    let firstButtonValue = 'RIGHT_NOW'
    let onChangeSpy
    let setDisabled
    beforeEach(function () {
      onChangeSpy = sandbox.spy()
      setDisabled = sandbox.stub()
      component.setProperties({
        firstButtonValue: firstButtonValue,
        onChange: onChangeSpy,
        _setDisabled: setDisabled,
        storedDateTimeValue: 'Test'
      })
    })

    describe('when secenario for first button has been selected', function () {
      beforeEach(function () {
        run(() => {
          eventObject.target.value = firstButtonValue
          component.send('selectedButton', eventObject)
        })
      })

      it('sets "selectedValue" to the value the first radio button', function () {
        expect(component.get('selectedValue')).to.equal(firstButtonValue)
      })

      it('calls onChange() with correct argument (value from firstButtonValue)', function () {
        expect(onChangeSpy).to.have.been.calledWith('foo', firstButtonValue)
      })

      it('calls _setDisabled() should be called with true', function () {
        expect(setDisabled).to.have.been.calledWith(true)
      })
    })

    describe('when secenario for second button has been selected', function () {
      beforeEach(function () {
        run(() => {
          eventObject.target.value = DATE_VALUE
          component.send('selectedButton', eventObject)
        })
      })

      it('sets "selectedValue" to the value the second radio button', function () {
        expect(component.get('selectedValue')).to.equal(DATE_VALUE)
      })

      it('calls onChange() with correct argument (value from storedDateTimeValue)', function () {
        expect(onChangeSpy).to.have.been.calledWith('foo', 'Test')
      })

      it('calls _setDisabled() should be called with false', function () {
        expect(setDisabled).to.have.been.calledWith(false)
      })
    })
  })
})
