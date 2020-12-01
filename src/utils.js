const { assign, entries } = Object
const { toString, hasOwnProperty } = Object.prototype
const R = require('ramda')

function isPlainObj (val) {
  return toString.call(val) === '[object Object]'
}

function isAST (el) {
  return el.constructor.name === 'VNode'
}

function isComponent (el) {
  return el.name === 'VueComponent'
}

// 删除前缀
function deletePrefix (str, prefix) {
  const reg = RegExp(`^${prefix}`)
  return str.replace(reg, '')
}

// 删除后缀
function deleteSuffix (str, suffix) {
  return str.replace(suffix, '')
}

function JSON2AST (JSON = {}) {

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

  const handlers = {
    translateBind ([key, value]) {
      key = deletePrefix(key, ':')
      // v-bind放到props里，兼容AST.data.props为undefined的情况
      AST.data.props = assign({}, AST.data.props, { [key]: value })
    },
    translateNativeOn ([key, value]) {
      key = deletePrefix(key, '@')
      key = deleteSuffix(key, '.native')
      // 原生事件放到nativeOn里
      AST.data.nativeOn = assign({}, AST.data.nativeOn, { [key]: value })
    },
    translateOn ([key, value]) {
      key = deletePrefix(key, '@')
      // 其他事件放到on里
      AST.data.on = assign({}, AST.data.on, { [key]: value })
    },
    translateCommon ([key, value]) { // class style slot
      AST.data[key] = value
    },
    translateOthers ([key, value]) {
      AST.data.attrs = assign({}, AST.data.attrs, { [key]: value })
    }
  }

  const fn = R.cond([
    [([key]) => key.startsWith(':'),                             handlers.translateBind],
    [([key]) => key.startsWith('@') && key.includes('.native'),  handlers.translateNativeOn],
    [([key]) => key.startsWith('@') && !key.includes('.native'), handlers.translateOn],
    [([key]) => ['class', 'style', 'slot', 'ref'].includes(key), handlers.translateCommon],
    [R.T,                                                        handlers.translateOthers]
  ])

  for (let attr of entries(attrs)) {
    fn(attr)
  }

  return AST
}

function render (h, JSON) {

  // 递归
  const handler = ({ tag, data, children = [] } = {}) => {

    const fn = R.cond([
      [child => child.tag,                      handler],
      [child => isComponent(child),             child => handler({tag: child})],
      [child => child.text && !child.isComment, child => child.text]
    ])

    return h(
      tag,
      data,
      children.map(fn)
    )
  }

  const AST = JSON2AST(JSON)

  return handler(AST)
}

const mixinData = {
  data () {
    return {
      theValue: ''
    }
  }
}

const mixinRender = {
  render (h) {
    return render(h, this.JSON)
  }
}

export { isPlainObj, mixinData, mixinRender }
