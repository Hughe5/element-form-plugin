import Vue from 'vue'
import { Select, Option } from 'element-ui'
import { mixinData, mixinRender } from '../utils'

export default function genSelect (item) {
  return Vue.component('Select', {
    mixins: [ mixinData, mixinRender ],
    computed: {
      theKey () {
        return item.value
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
            ':clearable': item.defaultValue === undefined && !(item.options || []).find(e => e.label === '全部' && e.value === undefined),
            '@change': item.change,
            slot: item.slot,
            class: item.class,
          },
          children: (item.options || []).map(option => {
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
