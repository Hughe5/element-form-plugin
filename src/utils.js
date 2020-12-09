const { assign, entries } = Object
const { toString, hasOwnProperty } = Object.prototype
const R = require('ramda')

const isPlainObj = (val) => {
  return toString.call(val) === '[object Object]'
}

const isFunction = (val) => {
  return toString.call(val) === '[object Function]'
}

const isAST = (el) => {
  return el.constructor.name === 'VNode'
}

const isComponent = (el) => {
  return el.isComponent
}

// 删除前缀
const deletePrefix = (str, prefix) => {
  const reg = RegExp(`^${prefix}`)
  return str.replace(reg, '')
}

const JSON2AST = (JSON = {}) => {

  if (isAST(JSON) || isComponent(JSON)) return JSON

  // 解构JSON和赋默认值
  const { tag, attrs, children, text } = assign({ attrs: {}, children: [] }, JSON)

  // 处理v-if
  if (hasOwnProperty.call(attrs, 'v-if') && !attrs['v-if']) return

  // 定义返回值
  const AST = {
    tag,
    data: {},
    children: children.map(JSON2AST),
    text
  }

  const bind = (key, value) => {
    key = deletePrefix(key, ':')
    AST.data.props = assign({}, AST.data.props, { [key]: value })
  }

  const on = (key, value) => {
    key = deletePrefix(key, '@')

    const fn = R.cond([
      [
        key => key.includes('.native'), 
        (key, value) => {
          key = key.split('.').shift()
          AST.data.nativeOn = assign({}, AST.data.nativeOn, { [key]: value })
        }
      ],
      [
        R.T,
        (key, value) => {
          AST.data.on = assign({}, AST.data.on, { [key]: value })
        }
      ]
    ])

    fn(key, value)
  }

  const fn = R.cond([
    [
      key => ['class', 'style', 'slot', 'ref'].includes(key),
      (key, value) => {
        AST.data[key] = value
      }
    ],
    [
      key => key.startsWith(':'),
      bind
    ],
    [
      key => key.startsWith('@'),
      on
    ],
    [
      R.T,
      (key, value) => {
        AST.data.attrs = assign({}, AST.data.attrs, { [key]: value })
      }
    ]
  ])

  for (let [key, value] of entries(attrs)) {
    fn(key, value)
  }

  return AST
}

const renderMixin = {

  render (h) {

    const handler = ({ tag, data, children = [] } = {}) => {

      const fn = R.cond([
        [
          child => child.tag,
          handler
        ],
        [
          child => isComponent(child),
          child => handler({ tag: child })
        ],
        [
          child => child.text && !child.isComment,
          child => child.text
        ]
      ])

      return h(tag, data, children.map(fn))
    }

    return handler(JSON2AST(this.JSON))
  }
}

export { isPlainObj, isFunction, renderMixin }
