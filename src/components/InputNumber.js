import Vue from 'vue'
import { InputNumber } from 'element-ui'
import { renderMixin } from '../utils'

export default function genInputNumber (options) {
  return Vue.component('InputNumber', {
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
            '@change': options.change,
            class: options.class,
            ':min': options.min,
            ':max': options.max,
            'controls-position': options.controlsPosition
          }
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
}
