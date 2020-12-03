import Vue from 'vue'
import { Cascader } from 'element-ui'
import { renderMixin } from '../utils'

export default function genCascader (options) {
  return Vue.component('Cascader', {
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
          tag: Cascader,
          attrs: {
            ':value': this.theValue,
            '@input': (value) => {
              this.theValue = value
            },
            ':options': options.options,
            ':props': options.props,
            ':clearable': options.defaultValue === undefined,
            '@change': options.change,
            slot: options.slot,
            class: options.class,
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
