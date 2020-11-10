<script>
import { Form, FormItem, DateTimePicker, Select, Option, Input, Cascader, Button, } from 'element-ui'
import { isPlainObj, render, } from './utils'
export default {
  name: 'element-form',
  props: {
    initItems: {
      type: Array,
      default: function () {
        return []
      },
    },
    initPosition: {
      type: Number
    },
    inline: {
      type: Boolean
    }
  },
  data () {
    return {
      position: this.initPosition,
      hideMore: true,
      form: {},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
    }
  },
  computed: {
    items () {
      return this.buildItems(this.initItems)
    },
    canHideMore () {
      return this.position < this.items.length - 1
    },
    getHandlerByTag () {
      return {
        'select': this.handleSelect,
        'input': this.handleInput,
        'cascader': this.handleCascader,
      }
    },
    JSON () {
      return {
        tag: Form,
        attrs: {
          class: 'element-form',
          ':inline': this.inline,
          ':model': this.form,
          size: 'small',
          '@submit.native': function (event) {
            event.preventDefault()
          }
        },
        children: this.items.map((item, index) => {
          const formItem = {
            tag: FormItem,
            attrs: {
              ':label': item.label,
              style: {
                display: (index <= this.position || (index > this.position && !this.hideMore)) && !item.isHidden
                  ? (this.inline ? 'inline-block' : 'block')
                  : 'none'
              }
            },
            children: this.generateComponentsByTag(item)
          }
          return item.tag.toLowerCase() === 'buttons'
            ? [
                formItem,
                {
                  tag: 'div',
                  attrs: {
                    class: 'more-conditions',
                    'v-if': this.canHideMore,
                    '@click': () => {
                      this.hideMore = !this.hideMore
                    }
                  },
                  children: [
                    {
                      tag: 'span',
                      children: '更多条件'
                    },
                    {
                      tag: 'i',
                      attrs: {
                        class: this.hideMore
                          ? 'el-icon-arrow-down el-icon--right'
                          : 'el-icon-arrow-up el-icon--right'
                      }
                    }
                  ]
                },
                {
                  tag: 'br',
                  attrs: {
                    'v-if': this.canHideMore
                  }
                }
              ]
            : formItem
        }).flat()
      }
    }
  },
  render (h) {
    return render(h, this.JSON)
  },
  methods: {
    generateComponentsByTag (item) {
      switch (item.tag.toLowerCase()) {
        case 'datetimepicker':
          return [{
            tag: DateTimePicker,
            attrs: {
              'v-if': !item.isHidden,
              ':value': this.form[item.value],
              '@input': (value) => {
                this.form[item.value] = value
              },
              type: 'datetimerange',
              ':picker-options': this.pickerOptions,
              'range-separator': '至',
              'start-placeholder': '开始日期',
              'end-placeholder': '结束日期',
              ':clearable': item.defaultValue === undefined,
              '@change': item.change,
            }
          }]
        case 'select':
          return [{
            tag: Select,
            attrs: {
              'v-if': !item.isHidden,
              ':value': this.form[item.value],
              '@input': (value) => {
                this.form[item.value] = value
              },
              placeholder: '请选择',
              ':clearable': item.defaultValue === undefined && !item.disclearable,
              '@change': item.change,
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
          }]
        case 'cascader':
          return [{
            tag: Cascader,
            attrs: {
              'v-if': !item.isHidden,
              ':value': this.form[item.value],
              '@input': (value) => {
                this.form[item.value] = value
              },
              ':options': item.options,
              ':props': item.props,
              ':clearable': item.defaultValue === undefined,
              '@change': item.change,
            }
          }]
        case 'input':
          return [{
            tag: Input,
            attrs: {
              'v-if': !item.isHidden,
              ':value': this.form[item.value],
              '@input': (value) => {
                this.form[item.value] = value
              },
              placeholder: '请输入',
              ':clearable': item.defaultValue === undefined,
              '@change': item.change,
            },
            children: item.prepend && typeof item.prepend.tag === 'string' && item.prepend.tag.toLowerCase() === 'select'
              ? [ this.generateComponentByTag(item.prepend) ]
              : undefined
          }]
        case 'buttons':
          return this.$slots.buttons || [{
            tag: Button,
            attrs: {
              class: 'button',
              '@click': this.onSubmit,
              size: 'small'
            },
            children: '查询'
          }, {
            tag: Button,
            attrs: {
              class: 'button',
              '@click': this.onReset,
              size: 'small'
            },
            children: '重置'
          }]
        default:
          return [{
            tag: 'span',
            children: `暂未支持${item.tag}`
          }]
      }
    },
    handleSelect (item) {
      if (Array.isArray(item.options)) {
        item.disclearable = item.options.find(e => e.label === '全部' && e.value === undefined)
      } else {
        item.options = [] // options没传或传的不是数组就赋初值
      }
    },
    checkRequiredProp (item) {
      return item.tag && typeof item.tag === 'string' && item.value && typeof item.value === 'string'
    },
    handleInput (item) {
      if (item.prepend) {
        this.checkRequiredProp(item.prepend) ? this.handleItem(item.prepend) : delete item.prepend
      }
    },
    handleCascader (item) {
      if (!isPlainObj(item.props)) {
        item.props = {}
      }
    },
    setReactiveProp (item) {
      this.$set(this.form, item.value, item.defaultValue)
    },
    setChangeCallback (item) {
      if (typeof item.change !== 'function') {
        item.change = function () {}
      }
    },
    handleItem (item) {
      const tag = item.tag.toLowerCase()
      const handler = this.getHandlerByTag[tag]
      handler?.(item)
      this.setReactiveProp(item)
      this.setChangeCallback(item)
    },
    buildItems (items) {
      items = items.filter(this.checkRequiredProp)
      items.forEach(this.handleItem)
      this.addButtons(items)
      return items
    },
    handlePosition (items, position = items.length) {
      this.position = Math.max(position, 0)
    },
    addButtons (items) {
      this.handlePosition(items, this.position)
      items.splice(this.position, 0, { tag: 'buttons' })
    },
    getFields () {
      return this.form
    },
    onSubmit () {
      this.$emit('search', this.getFields())
    },
    setDefaultVal () {
      const setVal = item => item.value && this.$set(this.form, item.value, item.defaultValue)
      for (let item of this.items) {
        setVal(item)
        item.prepend && setVal(item.prepend)
      }
    },
    resetFields () {
      this.form = {}
      this.setDefaultVal()
    },
    onReset () {
      this.resetFields()
      this.$emit('search', this.getFields())
    },
  }
}
</script>

<style lang="less" scoped>
  @blue: #4A82F7;
  .element-form {
    background: #fff;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px 10px 0 10px;
  }
  .button {
    background: #fff;
    border: 1px solid @blue;
    color: @blue;
    vertical-align: top; // 去掉垂直方向的间隙
  }
  .more-conditions {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    color: @blue;
    cursor: pointer;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>

<style lang="less">
  @blue: #4A82F7;
  .element-form {
    .el-form-item {
      margin-right: 0;
      margin-bottom: 10px;
      padding-right: 18px;
    }
    .el-range-editor.el-input__inner,
    .el-select,
    .el-input {
      vertical-align: top; // 去掉垂直方向的间隙
    }
    .el-input-group__prepend {
      .el-select {
        vertical-align: baseline;
      }
    }
  }
</style>
