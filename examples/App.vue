<script>
import { Input, Select, Option } from 'element-ui'
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
        tag: Input,
        attrs: {
          placeholder: '请输入',
          ':value': this.name,
          '@change': (value) => {
            console.log(value)
          },
          '@input': (value) => {
            this.name = value
          }
        },
        children: [
          {
            tag: Select,
            attrs: {
              slot: 'prepend',
              ':value': this.type,
              class: 'my-select',
              '@input': (value) => {
                this.type = value
              }
            },
            children: [
              {
                tag: Option,
                attrs: {
                  label: 'a',
                  value: '1'
                }
              },
              {
                tag: Option,
                attrs: {
                  label: 'b',
                  value: '2'
                }
              },
            ]
          }
        ]
      }
    }
  },
  render (h) {
    const AST = this.JSON2AST(this.JSON)
    const handler = (AST) => {
      return h(
        AST.tag,
        AST.data,
        Array.isArray(AST.children) ?
        AST.children.map((child, index) => {
          child.data = Object.assign({}, { key: index }, child.data)
          return handler(child)
        }) :
        AST.children
      )
    }
    return handler(AST)
  },
  methods: {
    deletePrefix (str, prefix) {
      const reg = new RegExp(`^${prefix}`)
      return str.replace(reg, '')
    },
    JSON2AST ({ tag, attrs = {}, children }) {
      
      const AST = {
        tag,
        data: {
          attrs: {},
          props: {},
          on: {},
        }
      }

      for (let [key, value] of Object.entries(attrs)) {
        if (key.startsWith(':')) {
          key = this.deletePrefix(key, ':')
          AST.data.props[key] = value
        } else if (key.startsWith('@')) {
          key = this.deletePrefix(key, '@')
          AST.data.on[key] = value
        } else if (['slot', 'class'].includes(key)) {
          AST.data[key] = value
        } else {
          AST.data.attrs[key] = value
        }
      }

      AST.children = Array.isArray(children) ?
        children.map(this.JSON2AST) :
        children

      return AST
    }
  }
}
</script>

<style lang="less">
.my-select {
  width: 172px;
}
</style>