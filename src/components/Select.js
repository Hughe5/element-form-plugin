import Vue from 'vue'
import { Select, Option } from 'element-ui'
import { renderMixin } from '../utils'

export default function genSelect (options) {
  const component = Vue.component('Select', {
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
          tag: Select,
          attrs: {
            ':value': this.theValue,
            '@input': (value) => {
              this.theValue = value
            },
            placeholder: '请选择',
            ':clearable': options.defaultValue === undefined && !(options.options || []).find(e => e.label === '全部' && e.value === undefined),
            '@change': options.change,
            class: options.class,
          },
          children: (options.options || []).map(option => {
            return {
              tag: Option,
              attrs: {
                ':label': option.label,
                ':value': option.value
              }
            }
          })
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
