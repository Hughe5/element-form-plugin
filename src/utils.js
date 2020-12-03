const { assign, entries } = Object
const { toString, hasOwnProperty } = Object.prototype
const R = require('ramda')

const isPlainObj = (val) => {
  return toString.call(val) === '[object Object]'
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

// 删除后缀
const deleteSuffix = (str, suffix) => {
  return str.replace(suffix, '')
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

  const handleBind = (key, value) => {
    key = deletePrefix(key, ':')
    AST.data.props = assign({}, AST.data.props, { [key]: value }) // v-bind放到props里，兼容AST.data.props为undefined的情况
  }

  const handleNativeOn = (key, value) => {
    key = deleteSuffix(key, '.native')
    AST.data.nativeOn = assign({}, AST.data.nativeOn, { [key]: value })
  }

  const handleCommonOn = (key, value) => {
    AST.data.on = assign({}, AST.data.on, { [key]: value })
  }

  const handleOn = (key, value) => {
    key = deletePrefix(key, '@')
    const fn = R.cond([
      [key => key.includes('.native'), handleNativeOn],
      [R.T,                            handleCommonOn]
    ])
    fn(key, value)
  }

  const handleCommon = (key, value) => {
    AST.data[key] = value
  }

  const handleOthers = (key, value) => {
    AST.data.attrs = assign({}, AST.data.attrs, { [key]: value })
  }

  const fn = R.cond([
    [key => key.startsWith(':'),                             handleBind],
    [key => key.startsWith('@'),                             handleOn],
    [key => ['class', 'style', 'slot', 'ref'].includes(key), handleCommon],
    [R.T,                                                    handleOthers]
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
        [child => child.tag,                      handler],
        [child => isComponent(child),             child => handler({ tag: child })],
        [child => child.text && !child.isComment, child => child.text]
      ])

      return h(tag, data, children.map(fn))
    }

    const AST = JSON2AST(this.JSON)

    return handler(AST)
  }
}

export { isPlainObj, renderMixin }
