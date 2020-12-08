import Vue from 'vue'
import { DatePicker } from 'element-ui'
import { isFunction, renderMixin } from '../utils'

export default function genDateTimePicker (options) {
  const component = Vue.component('DateTimePicker', {
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
          tag: DatePicker,
          attrs: {
            ':value': this.theValue,
            '@input': (value) => {
              this.theValue = value
            },
            type: 'datetimerange',
            ':picker-options': { // DateTimePicker的快捷选项
              shortcuts: [
                {
                  text: '最近一周',
                  onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    picker.$emit('pick', [start, end])
                  }
                },
                {
                  text: '最近一个月',
                  onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    picker.$emit('pick', [start, end])
                  }
                },
                {
                  text: '最近三个月',
                  onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                    picker.$emit('pick', [start, end])
                  }
                }
              ]
            },
            'range-separator': '至',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期',
            ':clearable': options.defaultValue === undefined,
            '@change': isFunction(options.change) ? options.change : function () {},
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
  component.isComponent = true
  return component
}
