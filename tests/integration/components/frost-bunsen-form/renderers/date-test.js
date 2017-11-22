import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {
  expectBunsenDateRendererWithState,
  expectCollapsibleHandles,
  expectOnChangeState,
  expectOnValidationState,
  openDatepickerBunsenDateRenderer
} from 'dummy/tests/helpers/ember-frost-bunsen'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'
import {deps} from 'ember-frost-bunsen/components/inputs/date'

/**
 * Click outside the date picker to close it
 * @param {Object} context - the test context
 */
function closePikaday (context) {
  context.$().click()
}

describe('Integration: Component / frost-bunsen-form / renderer / date', function () {
  const ctx = setupFormComponentTest({
    bunsenModel: {
      properties: {
        foo: {
          type: 'string'
        }
      },
      type: 'object'
    },
    bunsenView: {
      cells: [
        {
          model: 'foo',
          renderer: {
            name: 'date'
          }
        }
      ],
      type: 'form',
      version: '2.0'
    }
  })

  describe('Default values', function () {
    describe('when no value is given', function () {
      beforeEach(function () {
        this.set('bunsenView', {
          cells: [
            {
              collapsible: true,
              model: 'foo',
              renderer: {
                name: 'date'
              }
            }
          ],
          type: 'form',
          version: '2.0'
        })

        return wait()
      })

      it('defaults to an un-selected date', function () {
        expect($hook('bunsenForm-foo-datePicker-input').val()).to.equal('')
      })
    })

    describe('when defaultToCurrentDate is set to true in renderer options', function () {
      let format, currentDate
      beforeEach(function () {
        currentDate = '2017-09-01'
        format = ctx.sandbox.stub().returns(currentDate)
        ctx.sandbox.stub(deps, 'moment').returns({format})

        this.set('bunsenView', {
          cells: [
            {
              collapsible: true,
              model: 'foo',
              renderer: {
                defaultToCurrentDate: true,
                name: 'date'
              }
            }
          ],
          type: 'form',
          version: '2.0'
        })
        this.set('value', undefined)

        return wait()
      })

      it('defaults to the current date', function () {
        expect($hook('bunsenForm-foo-datePicker-input').val()).to.equal(currentDate)
      })
    })
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(0)
    expectBunsenDateRendererWithState('foo', {label: 'Foo'})
    expectOnValidationState(ctx, {count: 1})
  })

  describe('when classes are defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'date'
            },
            classNames: {
              label: 'custom-label',
              value: 'custom-value'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expect($hook('bunsenForm-foo').find('label.custom-label')).to.have.length(1)
      expect($hook('bunsenForm-foo').find('.custom-value input')).to.have.length(1)
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when hideLabel is set to true in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            hideLabel: true,
            model: 'foo',
            renderer: {
              name: 'date'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDateRendererWithState('foo', {label: null})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when hideLabel is set to false in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            hideLabel: false,
            model: 'foo',
            renderer: {
              name: 'date'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDateRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when label defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            label: 'FooBar Baz',
            model: 'foo',
            renderer: {
              name: 'date'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDateRendererWithState('foo', {label: 'FooBar Baz'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when collapsible set to true in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            collapsible: true,
            model: 'foo',
            renderer: {
              name: 'date'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1)
      expectBunsenDateRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when collapsible set to false in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            collapsible: false,
            model: 'foo',
            renderer: {
              name: 'date'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDateRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when form explicitly enabled', function () {
    beforeEach(function () {
      this.set('disabled', false)
      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDateRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when form disabled', function () {
    beforeEach(function () {
      this.set('disabled', true)
      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDateRendererWithState('foo', {
        disabled: true,
        label: 'Foo'
      })
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when property explicitly enabled in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            disabled: false,
            model: 'foo',
            renderer: {
              name: 'date'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDateRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when property disabled in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            disabled: true,
            model: 'foo',
            renderer: {
              name: 'date'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDateRendererWithState('foo', {
        disabled: true,
        label: 'Foo'
      })
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when date is set', function () {
    beforeEach(function () {
      ctx.props.onValidation.reset()
      const interactor = openDatepickerBunsenDateRenderer('foo')
      interactor.selectDate(new Date(2017, 0, 24))
      closePikaday(this)
      return wait()
    })

    it('functions as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDateRendererWithState('foo', {
        hasValue: true,
        label: 'Foo'
      })
      expectOnChangeState(ctx, {foo: '2017-01-24'})
      expectOnValidationState(ctx, {count: 1})
    })

    describe('when date is unset', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        this.set('value', {})
        return wait()
      })

      it('functions as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenDateRendererWithState('foo', {
          label: 'Foo'
        })
        expectOnChangeState(ctx, {})
        expectOnValidationState(ctx, {count: 1})
      })
    })
  })

  describe('when field is required', function () {
    beforeEach(function () {
      ctx.props.onValidation.reset()

      this.set('bunsenModel', {
        properties: {
          foo: {
            type: 'string'
          }
        },
        required: ['foo'],
        type: 'object'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDateRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {
        count: 1,
        errors: [
          {
            code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
            params: ['foo'],
            message: 'Field is required.',
            path: '#/foo',
            isRequiredError: true
          }
        ]
      })
    })

    describe('when date is set', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()

        this.set('value', {
          foo: '2017-01-24'
        })

        return wait()
      })

      it('functions as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenDateRendererWithState('foo', {
          hasValue: true,
          label: 'Foo'
        })
        expectOnChangeState(ctx, {foo: '2017-01-24'})
        expectOnValidationState(ctx, {count: 1})
      })

      describe('when date is unset', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          this.set('value', {})
          return wait()
        })

        it('functions as expected', function () {
          expectCollapsibleHandles(0)
          expectBunsenDateRendererWithState('foo', {label: 'Foo'})
          expectOnChangeState(ctx, {})
          expectOnValidationState(ctx, {
            count: 1,
            errors: [
              {
                code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
                params: ['foo'],
                message: 'Field is required.',
                path: '#/foo',
                isRequiredError: true
              }
            ]
          })
        })
      })
    })

    describe('when showAllErrors is false', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        this.set('showAllErrors', false)
        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenDateRendererWithState('foo', {label: 'Foo'})
        expectOnValidationState(ctx, {count: 0})
      })

      describe('when date is set', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()

          this.set('value', {
            foo: '2017-01-24'
          })

          return wait()
        })

        it('functions as expected', function () {
          expectCollapsibleHandles(0)
          expectBunsenDateRendererWithState('foo', {
            hasValue: true,
            label: 'Foo'
          })
          expectOnChangeState(ctx, {foo: '2017-01-24'})
          expectOnValidationState(ctx, {count: 1})
        })

        describe('when date is unset', function () {
          beforeEach(function () {
            ctx.props.onValidation.reset()
            this.set('value', {})
            return wait()
          })

          it('functions as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenDateRendererWithState('foo', {})
            expectOnChangeState(ctx, {})
            expectOnValidationState(ctx, {
              count: 1,
              errors: [
                {
                  code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
                  params: ['foo'],
                  message: 'Field is required.',
                  path: '#/foo',
                  isRequiredError: true
                }
              ]
            })
          })
        })
      })
    })

    describe('when showAllErrors is true', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        this.set('showAllErrors', true)
        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenDateRendererWithState('foo', {
          error: 'Field is required.',
          label: 'Foo'
        })
        expectOnValidationState(ctx, {count: 0})
      })

      describe('when date is set', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()

          this.set('value', {
            foo: '2017-01-24'
          })

          return wait()
        })

        it('functions as expected', function () {
          expectCollapsibleHandles(0)
          expectBunsenDateRendererWithState('foo', {
            hasValue: true,
            label: 'Foo'
          })
          expectOnChangeState(ctx, {foo: '2017-01-24'})
          expectOnValidationState(ctx, {count: 1})
        })

        describe('when date is unset', function () {
          beforeEach(function () {
            ctx.props.onValidation.reset()
            this.set('value', {})
            return wait()
          })

          it('functions as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenDateRendererWithState('foo', {
              error: 'Field is required.',
              label: 'Foo'
            })
            expectOnChangeState(ctx, {})
            expectOnValidationState(ctx, {
              count: 1,
              errors: [
                {
                  code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
                  params: ['foo'],
                  message: 'Field is required.',
                  path: '#/foo',
                  isRequiredError: true
                }
              ]
            })
          })
        })
      })
    })
  })

  // TODO: enable once https://github.com/ciena-frost/ember-frost-date-picker/issues/43 is resolved
  // MRD 2017-02-24
  describe.skip('when options passed in', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'date',
              options: {
                bar: true,
                baz: 'spam',
                foo: 1,
                isIconVisible: false
              }
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDateRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
      expect($hook('bunsenForm-foo-datePicker-cal')).to.have.length(0)
    })
  })
})
