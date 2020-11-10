function isPlainObj (val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

function deletePrefix (str, prefix) {
  const reg = new RegExp(`^${prefix}`)
  return str.replace(reg, '')
}

function deleteSuffix (str, suffix) {
  return str.replace(`.${suffix}`, '')
}

function JSON2AST (JSON) {

  if (JSON.constructor.name === 'VNode') return JSON

  const { tag, attrs, children } = Object.assign({ attrs: {} }, JSON)

  if (Object.prototype.hasOwnProperty.call(attrs, 'v-if') && !attrs['v-if']) return

  const AST = {
    tag,
    data: {}
  }

  for (let [key, value] of Object.entries(attrs)) {
    if (key.startsWith(':')) {
      key = deletePrefix(key, ':')
      AST.data.props = Object.assign({}, AST.data.props, { [key]: value })
    } else if (key.startsWith('@')) {
      key = deletePrefix(key, '@')
      if (key.includes('native')) {
        key = deleteSuffix(key, 'native')
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

  AST.children = Array.isArray(children) ? children.map(JSON2AST) : children

  return AST
}

function render (h, JSON) {
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
  const AST = JSON2AST(JSON)
  return handler(AST)
}

export { isPlainObj, render, }
