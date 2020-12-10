import Vue from 'vue'
import { InputNumber } from 'element-ui'
import { isFunction, renderMixin } from '../utils'

export default function genInputNumber (options) {
  const component = Vue.component('InputNumber', {
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
          tag: InputNumber,
          attrs: {
            ':value': this.theValue,
            '@input': (value) => {
              this.theValue = value
            },
            '@change': isFunction(options.change) ? options.change : function () {},
            class: options.class,
            ':min': options.min,
            ':max': options.max,
            'controls-position': options.controlsPosition
          }
        }
      }
    },
    mounted () {
      this.theValue = options.defaultValue
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
