const { assign, entries } = Object
const { toString, hasOwnProperty } = Object.prototype

function isPlainObj (val) {
  return toString.call(val) === '[object Object]'
}

// 删除前缀
function deletePrefix (str, prefix) {
  const reg = new RegExp(`^${prefix}`)
  return str.replace(reg, '')
}

// 删除后缀
function deleteSuffix (str, suffix) {
  return str.replace(`.${suffix}`, '')
}

// JSON转AST
function JSON2AST (JSON) {

  // 是AST则直接返回
  if (JSON.constructor.name === 'VNode') return JSON

  // 给attrs赋默认值，解构JSON
  const { tag, attrs, children } = assign({ attrs: {} }, JSON)

  // 处理v-if
  if (hasOwnProperty.call(attrs, 'v-if') && !attrs['v-if']) return

  // 定义返回值
  const AST = {
    tag,
    data: {}
  }

  for (let [key, value] of entries(attrs)) {
    if (key.startsWith(':')) { // 处理v-bind
      key = deletePrefix(key, ':')
      // v-bind放到props里，兼容AST.data.props为undefined的情况
      AST.data.props = assign({}, AST.data.props, { [key]: value })
    } else if (key.startsWith('@')) { // 处理v-on
      key = deletePrefix(key, '@')
      if (key.includes('native')) { // 处理.native修饰符
        key = deleteSuffix(key, 'native')
        // 原生事件放到nativeOn里
        AST.data.nativeOn = assign({}, AST.data.nativeOn, { [key]: value })
      } else {
        // 其他事件放到on里
        AST.data.on = assign({}, AST.data.on, { [key]: value })
      }
    } else if (['class', 'style', 'slot'].includes(key)) { // 处理class、style、slot
      AST.data[key] = value
    } else {
      AST.data.attrs = assign({}, AST.data.attrs, { [key]: value })
    }
  }

  // 递归
  AST.children = Array.isArray(children) ? children.map(JSON2AST) : children

  return AST
}

function render (h, JSON) {
  // 递归
  const handler = ({ tag, data, children }) => {
    const node = h(
      tag,
      data,
      Array.isArray(children)
        ? children
            .filter(child => child !== undefined) // 过滤，v-if产生undefined
            .map((child, index) => {
              child.data = assign({}, { key: index }, child.data) // 加key，有则不加
              if (child.tag) { // 标签节点
                return handler(child)
              } else if (child.text && !child.isComment) { // 文本节点
                return child.text
              }
              return handler({ children: child.text }) // 注释节点
            })
        : children // 文本节点
    )
    if (!tag) node.text = children // 注释节点
    return node
  }
  const AST = JSON2AST(JSON)
  return handler(AST)
}

export { isPlainObj, render, }
