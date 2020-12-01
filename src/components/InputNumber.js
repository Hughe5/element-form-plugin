import Vue from 'vue'
import { InputNumber } from 'element-ui'
import { mixinData, mixinRender } from '../utils'

export default function genInputNumber (item) {
  return Vue.component('InputNumber', {
    mixins: [ mixinData, mixinRender ],
    computed: {
      theKey () {
        return item.value
      },
      JSON () {
        return {
          tag: InputNumber,
          attrs: {
            ':value': this.theValue,
            '@input': (value) => {
              this.theValue = value
            },
            '@change': item.change,
            class: item.class,
            ':min': item.min,
            ':max': item.max,
            'controls-position': item.controlsPosition
          }
        }
      }
    },
    mounted () {
      if (item.defaultValue !== undefined) {
        this.theValue = item.defaultValue
      }
    },
    methods: {
      reset () {
        this.theValue = item.defaultValue
      }
    }
  })
}
