import Vue from 'vue'
import { Input } from 'element-ui'
import { mixinData, mixinRender } from '../utils'
import genSelect from './Select'

export default function genInput (item) {
  return Vue.component('Input', {
    mixins: [ mixinData, mixinRender ],
    computed: {
      theKey () {
        return item.value
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
            ':clearable': item.defaultValue === undefined,
            '@change': item.change,
            slot: item.slot,
            class: item.class,
          },
          children: item.prepend && item.prepend.tag === 'Select'
            ? [ genSelect({ ...item.prepend, slot: 'prepend' }) ]
            : []
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
