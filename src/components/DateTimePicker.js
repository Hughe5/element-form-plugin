import Vue from 'vue'
import { DatePicker } from 'element-ui'
import { mixinData, mixinRender } from '../utils'

export default function genDateTimePicker (item) {
  return Vue.component('DateTimePicker', {
    mixins: [ mixinData, mixinRender ],
    computed: {
      theKey () {
        return item.value
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
