import Vue from 'vue'
import { Cascader } from 'element-ui'
import { mixinData, mixinRender } from '../utils'

export default function genCascader (item) {
  return Vue.component('Cascader', {
    mixins: [ mixinData, mixinRender ],
    computed: {
      theKey () {
        return item.value
      },
      JSON () {
        return {
          tag: Cascader,
          attrs: {
            ':value': this.theValue,
            '@input': (value) => {
              this.theValue = value
            },
            ':options': item.options,
            ':props': item.props,
            ':clearable': item.defaultValue === undefined,
            '@change': item.change,
            slot: item.slot,
            class: item.class,
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
