import Vue from 'vue'
import { Input } from 'element-ui'
import { renderMixin } from '../utils'
import genSelect from './Select'
const R = require('ramda')

const fn = R.cond([
  [JSON => JSON.tag === 'Select', genSelect]
])

export default function genInput (options) {
  const component = Vue.component('Input', {
    mixins: [ renderMixin ],
    data () {
      return {
        theValue: ''
      }
    },
    computed: {
      theKey () {
        return options.value
      },
      JSON () {
        return {
          tag: Input,
          attrs: {
            ':value': this.theValue,
            '@input': (value) => {
              this.theValue = value
            },
            placeholder: '请输入',
            ':clearable': options.defaultValue === undefined,
            '@change': options.change,
            class: options.class,
          },
          children: options.prepend
            ? [
                {
                  tag: 'div',
                  attrs: {
                    slot: 'prepend'
                  },
                  children: [ fn(options.prepend) ]
                }
              ]
            : []
        }
      }
    },
    mounted () {
      if (options.defaultValue !== undefined) {
        this.theValue = options.defaultValue
      }
    },
    methods: {
      reset () {
        this.theValue = options.defaultValue
      }
    }
  })
  component.isComponent = true
  return component
}
