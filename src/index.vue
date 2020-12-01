<script>
import { Form, FormItem, Button } from 'element-ui'
import { mixinRender } from './utils'
import components from './components'

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
    },
    labelPosition: {
      type: String
    }
  },
  data () {
    return {
      position: this.initPosition,
      hideMore: true, // 点击“更多条件”时，切换的变量
    }
  },
  computed: {
    items () {
      return this.buildItems(this.initItems)
    },
    canHideMore () { // 是否显示“更多条件”
      return this.position < this.items.length - 1
    },
    JSON () { // 用于生成页面的JSON
      return {
        tag: Form,
        attrs: {
          class: 'element-form',
          ':inline': this.inline,
          'label-position': this.labelPosition,
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
            children: this.genComponentsByTag(item)
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
                      children: [
                        {
                          text: '更多条件'
                        }
                      ]
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
  mixins: [ mixinRender ],
  methods: {
    // 根据tag生成组件
    genComponentsByTag (item) {
      if (['Input', 'InputNumber', 'Select', 'Cascader', 'DateTimePicker'].includes(item.tag)) {
        return [ item.isHidden ? undefined : components[`gen${item.tag}`](item) ]
      } else if (item.tag === 'Buttons') {
        return this.$slots.Buttons || [ // 插槽
          {
            tag: Button,
            attrs: {
              class: 'button',
              '@click': this.onSubmit,
              size: 'small'
            },
            children: [
              {
                text: '查询'
              }
            ]
          },
          {
            tag: Button,
            attrs: {
              class: 'button',
              '@click': this.onReset,
              size: 'small'
            },
            children: [
              {
                text: '重置'
              }
            ]
          }
        ]
      }
      return [
        {
          tag: 'span',
          children: [
            {
              text: `暂未支持${item.tag}`
            }
          ]
        }
      ]
    },
    // 检查必要的属性
    checkRequiredProp (item) {
      return item.tag && typeof item.tag === 'string' && item.value && typeof item.value === 'string'
    },
    // 设置change事件的回调
    setChangeCallback (item) {
      if (typeof item.change !== 'function') {
        item.change = function () {}
      }
    },
    // 处理表单项
    handleItem (item) {
      this.setChangeCallback(item)
      if (item.prepend) { // 前置内容
        this.checkRequiredProp(item.prepend) ? this.handleItem(item.prepend) : delete item.prepend
      }
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
      const fields = {}
      const recursion = (node) => {
        node.$children.forEach(recursion)
        if (node.theKey) {
          fields[node.theKey] = node.theValue
        }
      }
      recursion(this)
      return fields
    },
    // 点击“查询”按钮
    onSubmit () {
      this.$emit('search', this.getFields())
    },
    // 重置
    resetFields () {
      const recursion = (node) => {
        node.$children.forEach(recursion)
        node.reset && node.reset()
      }
      recursion(this)
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
