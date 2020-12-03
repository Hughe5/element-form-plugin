import Vue from 'vue'
import { Input } from 'element-ui'
import { renderMixin } from '../utils'
import genSelect from './Select'

export default function genInput (options) {
  return Vue.component('Input', {
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
            slot: options.slot,
            class: options.class,
          },
          children: options.prepend && options.prepend.tag === 'Select'
            ? [ genSelect({ ...options.prepend, slot: 'prepend' }) ]
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
}
