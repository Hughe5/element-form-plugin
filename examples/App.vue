<script>
import { Form, FormItem, DateTimePicker, Select, Option, Input, Cascader, Button, } from 'element-ui'
export default {
  data () {
    return {
      name: '',
      type: '',
    }
  },
  computed: {
    JSON () {
      return {
        tag: Form,
        attrs: {
          class: 'my-form',
          ':inline': this.inline,
          ':model': this.form,
          size: 'small',
          '@submit.native': function (event) {
            event.preventDefault()
          }
        },
        children: this.children
      }
    },
    children () {
      const res = []
      for (let [index, item] of Object.entries(this.items)) {
        if (item.type.toLowerCase() === 'datetimepicker') {
          res.push({
            tag: FormItem,
            attrs: {
              ':label': item.label,
              style: {
                display: (index <= this.position || (index > this.position && !this.hideMore)) && !item.isHidden ? (this.inline ? 'inline-block' : 'block') : 'none'
              }
            },
            children: [
              {
                tag: DateTimePicker,
                attrs: {
                  'v-if': !item.isHidden,
                  ':value': this.form[item.value],
                  type: 'datetimerange',
                  ':picker-options': this.pickerOptions,
                  'range-separator': '至',
                  'start-placeholder': '开始日期',
                  'end-placeholder': '结束日期',
                  ':clearable': item.defaultValue === undefined,
                  '@change': item.change,
                  '@input': (value) => {
                    this.form[item.value] = value
                  }
                }
              }
            ]
          })
        }
        if (item.type.toLowerCase() === 'select') {
          res.push({
            tag: FormItem,
            attrs: {
              ':label': item.label,
              style: {
                display: (index <= this.position || (index > this.position && !this.hideMore)) && !item.isHidden ? (this.inline ? 'inline-block' : 'block') : 'none'
              }
            },
            children: [
              {
                tag: Select,
                attrs: {
                  'v-if': !item.isHidden,
                  ':value': this.form[item.value],
                  placeholder: '请选择',
                  ':clearable': item.defaultValue === undefined && !item.disclearable,
                  '@change': item.change,
                  '@input': (value) => {
                    this.form[item.value] = value
                  }
                },
                children: item.options.map(option => {
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
          })
        }
        if (item.type.toLowerCase() === 'input') {
          res.push({
            tag: FormItem,
            attrs: {
              ':label': item.label,
              style: {
                display: (index <= this.position || (index > this.position && !this.hideMore)) && !item.isHidden ? (this.inline ? 'inline-block' : 'block') : 'none'
              }
            },
            children: [
              {
                tag: Input,
                attrs: {
                  'v-if': !item.isHidden,
                  ':value': this.form[item.value],
                  placeholder: '请输入',
                  ':clearable': item.defaultValue === undefined,
                  '@change': item.change,
                  '@input': (value) => {
                    this.form[item.value] = value
                  }
                },
                children: item.prepend && typeof item.prepend.type === 'string' && item.prepend.type.toLowerCase() === 'select' ?
                  [
                    {
                      tag: Select,
                      attrs: {
                        'v-if': !item.prepend.isHidden,
                        ':value': this.form[item.prepend.value],
                        slot: 'prepend',
                        placeholder: '请选择',
                        class: item.prepend.class,
                        ':clearable': item.prepend.defaultValue === undefined,
                        '@change': item.prepend.change,
                        '@input': (value) => {
                          this.form[item.prepend.value] = value
                        }
                      },
                      children: item.prepend.options.map(option => ({
                          tag: Option,
                          attrs: {
                            ':label': option.label,
                            ':value': option.value
                          }
                        })
                      )
                    }
                  ] :
                  undefined
              }
            ]
          })
        }
        if (item.type.toLowerCase() === 'cascader') {
          res.push({
            tag: FormItem,
            attrs: {
              ':label': item.label,
              style: {
                display: (index <= this.position || (index > this.position && !this.hideMore)) && !item.isHidden ? (this.inline ? 'inline-block' : 'block') : 'none'
              }
            },
            children: [
              {
                tag: Cascader,
                attrs: {
                  'v-if': !item.isHidden,
                  ':value': this.form[item.value],
                  ':options': item.options,
                  ':props': item.props,
                  ':clearable': item.defaultValue === undefined,
                  '@change': item.change,
                  '@input': (value) => {
                    this.form[item.value] = value
                  }
                }
              }
            ]
          })
        }
        if (item.type === 'buttons') {
          const arr = this.$slots.buttons && this.$slots.buttons.length ? this.$slots.buttons : [
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
            },
          ]
          res.push(...arr, {
            tag: 'span',
            attrs: {
              class: 'more-conditions',
              'v-if': this.canHideMore,
              '@click': () => {
                this.hideMore = !this.hideMore
              }
            },
            children: [
              '更多条件',
              {
                tag: 'i',
                attrs: {
                  class: this.hideMore ? 'el-icon-arrow-down el-icon--right' : 'el-icon-arrow-up el-icon--right'
                }
              }
            ]
          }, {
            tag: 'br',
            attrs: {
              'v-if': this.canHideMore
            }
          })
        }
      }
      return res
    },
    VNode () {
      const node = this.$createElement()
      return node.constructor
    }
  },
  render (h) {
    const handler = ({ tag, data, children }) => {
      const node = h(
        tag,
        data,
        Array.isArray(children)
          ? children.filter(child => child !== undefined).map((child, index) => {
            child.data = Object.assign({}, { key: index }, child.data)
            if (child.tag) {
              return handler(child)
            } else if (child.text && !child.isComment) {
              return child.text
            }
            return handler({ children: child.text })
          })
          : children
      )
      if (!tag) node.text = children
      return node
    }
    const AST = this.JSON2AST(this.JSON)
    return handler(AST)
  },
  methods: {
    deletePrefix (str, prefix) {
      const reg = new RegExp(`^${prefix}`)
      return str.replace(reg, '')
    },
    deleteSuffix (str, suffix) {
      return str.replace(`.${suffix}`, '')
    },
    JSON2AST (JSON) {

      if (JSON instanceof this.VNode) return JSON

      const { tag, attrs, children } = Object.assign({ attrs: {} }, JSON)

      if (Object.prototype.hasOwnProperty.call(attrs, 'v-if') && !attrs['v-if']) return

      const AST = {
        tag,
        data: {}
      }

      for (let [key, value] of Object.entries(attrs)) {
        if (key.startsWith(':')) {
          key = this.deletePrefix(key, ':')
          AST.data.props = Object.assign({}, AST.data.props, { [key]: value })
        } else if (key.startsWith('@')) {
          key = this.deletePrefix(key, '@')
          if (key.includes('native')) {
            key = this.deleteSuffix(key, 'native')
            AST.data.nativeOn = Object.assign({}, AST.data.nativeOn, { [key]: value })
          } else {
            AST.data.on = Object.assign({}, AST.data.on, { [key]: value })
          }
        } else if (['class', 'style', 'slot'].includes(key)) {
          AST.data[key] = value
        } else {
          AST.data.attrs = Object.assign({}, AST.data.attrs, { [key]: value })
        }
      }

      AST.children = Array.isArray(children) ? children.map(this.JSON2AST) : children

      return AST
    },
  }
}
</script>

<style lang="less">
.my-select {
  width: 172px;
}
</style>