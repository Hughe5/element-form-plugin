<script>
import { Form, FormItem, DatePicker, Select, Option, Input, Cascader, Button, InputNumber, } from 'element-ui'
import { isPlainObj, render, } from './utils'
export default {
  name: 'element-form',
  props: {
    initItems: { // 表单项
      type: Array,
      default: function () {
        return []
      },
    },
    initPosition: { // Buttons的位置
      type: Number
    },
    inline: { // 是否换行
      type: Boolean
    }
  },
  data () {
    return {
      position: this.initPosition,
      hideMore: true, // 点击“更多条件”时，切换的变量
      form: {}, // 表单的数据
      pickerOptions: { // DateTimePicker的快捷选项
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
    canHideMore () { // 是否显示“更多条件”
      return this.position < this.items.length - 1
    },
    getHandlerByTag () { // 表单项对应的处理器
      return {
        'Select': this.handleSelect,
        'Input': this.handleInput,
        'Cascader': this.handleCascader,
      }
    },
    JSON () { // 用于生成页面的JSON
      return {
        tag: Form,
        attrs: {
          class: 'element-form',
          ':inline': this.inline,
          ':model': this.form,
          size: 'small',
          '@submit.native': function (event) { // 只有一个输入框时，阻止在输入框中按下回车提交表单
            event.preventDefault()
          }
        },
        children: this.items.map((item, index) => {
          const el = { // 每个表单项都用FormItem包一层
            tag: FormItem,
            attrs: {
              ':label': item.label,
              style: {
                // 可以在插件外用isHidden控制表单项的显隐
                display: (index <= this.position || (index > this.position && !this.hideMore)) && !item.isHidden
                  ? (this.inline ? 'inline-block' : 'block')
                  : 'none' // v-show
              }
            },
            children: this.generateComponentsByTag(item)
          }
          return item.tag === 'Buttons' && this.canHideMore
            ? [ // 表单项后加上操作按钮
                el,
                {
                  tag: 'div',
                  attrs: {
                    class: 'more-conditions',
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
                  tag: 'br'
                }
              ]
            : el
        }).flat() // map搭配flat实现返回比源数组更长的新数组
      }
    }
  },
  render (h) {
    return render(h, this.JSON)
  },
  methods: {
    // 根据tag生成组件
    generateComponentsByTag (item) {
      switch (item.tag) {
        case 'DateTimePicker':
          return item.isHidden ? [] : [
            {
              tag: DatePicker,
              attrs: {
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
                slot: item.slot,
                class: item.class,
              }
            }
          ]
        case 'Select':
          return item.isHidden ? [] : [
            {
              tag: Select,
              attrs: {
                ':value': this.form[item.value],
                '@input': (value) => {
                  this.form[item.value] = value
                },
                placeholder: '请选择',
                ':clearable': item.defaultValue === undefined && !item.disclearable,
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
          ]
        case 'Cascader':
          return item.isHidden ? [] : [
            {
              tag: Cascader,
              attrs: {
                ':value': this.form[item.value],
                '@input': (value) => {
                  this.form[item.value] = value
                },
                ':options': item.options,
                ':props': item.props,
                ':clearable': item.defaultValue === undefined,
                '@change': item.change,
                slot: item.slot,
                class: item.class,
              }
            }
          ]
        case 'Input':
          return item.isHidden ? [] : [
            {
              tag: Input,
              attrs: {
                ':value': this.form[item.value],
                '@input': (value) => {
                  this.form[item.value] = value
                },
                placeholder: '请输入',
                ':clearable': item.defaultValue === undefined,
                '@change': item.change,
                slot: item.slot,
                class: item.class,
              },
              children: item.prepend && item.prepend.tag === 'Select'
                ? this.generateComponentsByTag({ ...item.prepend, slot: 'prepend' })
                : undefined
            }
          ]
        case 'InputNumber':
          return item.isHidden ? [] : [
            {
              tag: InputNumber,
              attrs: {
                ':value': this.form[item.value],
                '@input': (value) => {
                  this.form[item.value] = value
                },
                '@change': item.change,
                class: item.class,
                ':min': item.min,
                ':max': item.max,
                'controls-position': item.controlsPosition
              }
            }
          ]
        case 'Buttons':
          return this.$slots.Buttons || [ // 插槽
            {
              tag: Button,
              attrs: {
                class: 'button',
                '@click': this.onSubmit,
                size: 'small'
              },
              children: '查询'
            },
            {
              tag: Button,
              attrs: {
                class: 'button',
                '@click': this.onReset,
                size: 'small'
              },
              children: '重置'
            }
          ]
        default:
          return [
            {
              tag: 'span',
              children: `暂未支持${item.tag}`
            }
          ]
      }
    },
    handleSelect (item) {
      if (Array.isArray(item.options)) {
        // 有“全部”默认选项时没有清空功能
        item.disclearable = item.options.find(e => e.label === '全部' && e.value === undefined)
      } else {
        item.options = [] // options没传或传的不是数组就赋初值
      }
    },
    // 检查必要的属性
    checkRequiredProp (item) {
      return item.tag && typeof item.tag === 'string' && item.value && typeof item.value === 'string'
    },
    // 处理输入框
    handleInput (item) {
      if (item.prepend) { // 前置内容
        this.checkRequiredProp(item.prepend) ? this.handleItem(item.prepend) : delete item.prepend
      }
    },
    // 处理级联
    handleCascader (item) {
      if (!isPlainObj(item.props)) {
        item.props = {}
      }
    },
    // 把表单项绑定的字段加到form上，变成响应式的
    setReactiveProp (item) {
      Object.prototype.hasOwnProperty.call(this.form, item.value) || this.$set(this.form, item.value, item.defaultValue)
    },
    // 设置change事件的回调
    setChangeCallback (item) {
      if (typeof item.change !== 'function') {
        item.change = function () {}
      }
    },
    // 处理表单项
    handleItem (item) {
      const tag = item.tag
      const handler = this.getHandlerByTag[tag] // 获取到表单项对应的处理器
      handler?.(item) // 有则执行
      this.setReactiveProp(item)
      this.setChangeCallback(item)
    },
    // 处理表单项
    buildItems (items) {
      items = items.filter(this.checkRequiredProp) // 过滤掉没有必要属性的表单项
      items.forEach(this.handleItem)
      this.addButtons(items)
      return items
    },
    // 处理Buttons的位置
    handlePosition (items, position = items.length) { // 默认把Buttons放在末尾
      this.position = Math.max(position, 0) // 传入负数则按0来处理，即把Buttons放在开头
    },
    // 添加Buttons
    addButtons (items) {
      this.handlePosition(items, this.position)
      items.splice(this.position, 0, { tag: 'Buttons' })
    },
    // 获取表单的数据
    getFields () {
      return this.form
    },
    // 点击“查询”按钮
    onSubmit () {
      this.$emit('search', this.getFields())
    },
    // 设置默认值
    setDefaultVal () {
      const setVal = item => item.value && this.$set(this.form, item.value, item.defaultValue)
      for (let item of this.items) {
        setVal(item)
        item.prepend && setVal(item.prepend)
      }
    },
    // 重置
    resetFields () {
      this.form = {}
      this.setDefaultVal()
    },
    // 点击“重置”按钮
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
