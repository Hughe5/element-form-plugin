# 表单插件

基于Element，根据配置为网页添加表单

## Features

- 配置Element里的DateTimePicker、Select、Input、Cascader等表单项
- 配置多余的表单项，默认收起，可展开
- 支持“查询”和“重置”
- 给表单项配置默认值
- 动态地显示或隐藏表单项

## 引入

// main.js

``` javascript
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import elementForm from 'element-form-plugin'
import App from './App.vue'

Vue.use(ElementUI)
Vue.use(elementForm)

new Vue({
  render: h => h(App),
}).$mount('#app')
```

// index.vue

``` html
<element-form :initItems="items">
  <template #Buttons>
    <el-button type="primary" @click="save">保存</el-button>
  </template>
</element-form>
<!-- <element-form :initItems="items" :initPosition="position" :inline="true" /> -->
<!-- <element-form :initItems="items" /> -->

<script>
export default {
  data () {
    return {
      items: [], // 详见props
      position: 2 // 详见props
    }
  }
}
</script>
```

## props

### items

- 类型：`Array<object>`

- 默认值：`[]`

- 元素的属性的列表：

| 参数 | 说明 | 类型 | required | 默认值 |
| - | - | - | - | - |
| tag | Element里的表单项的英文名 | string | true | - |
| value | 绑定值 | string | true | - |
| label | 表单项的标签 | string | false | - |
| options | Select或Cascader的选项的列表，详见options | `Array<object>` | false | - |
| isHidden | 被用于v-if，控制表单项是否渲染 | boolean | false | false |
| defaultValue | 表单项的默认值 | any | false | - |
| change | 表单项的值变化时触发 | function | false | - |
| prepend | 复合型输入框，指定前置的内容，详见prepend | object | false | - |
| props | 级联，配置选项，与Element中的一致 | object | false | - |

<p style="color: #e6a23c">！没有传tag和value的元素会被忽略</p>

- options

与Element中的一致，支持异步传入，例：
``` javascript
options: [
  {
    value: 'apple',
    label: '苹果'
  }, 
  {
    value: 'banana',
    label: '香蕉'
  }
]
```

- prepend

<table>
  <tr>
    <td>参数</td>
    <td>说明</td>
    <td>类型</td>
    <td>required</td>
    <td>默认值</td>
  <tr>
  <tr>
    <td>class</td>
    <td>前置内容的class</td>
    <td>string</td>
    <td>false</td>
    <td>-</td>
  <tr>
  <tr>
    <td>tag</td>
    <td colspan="4">与元素的属性的列表内相同</td>
  <tr>
  <tr>
    <td>value</td>
    <td colspan="4">同上</td>
  <tr>
  <tr>
    <td>options</td>
    <td colspan="4">同上</td>
  <tr>
  <tr>
    <td>isHidden</td>
    <td colspan="4">同上</td>
  <tr>
  <tr>
    <td>defaultValue</td>
    <td colspan="4">同上</td>
  <tr>
  <tr>
    <td>change</td>
    <td colspan="4">同上</td>
  <tr>
  <tr>
    <td>props</td>
    <td colspan="4">同上</td>
  <tr>
</table>

<p style="color: #e6a23c">！没有传tag和value的prepend会被忽略</p>

### position

- 指定按钮组（查询、重置、更多条件）插入到表单项列表中的索引值

- 类型：number

- 默认把按钮组插入到表单项列表的末尾

### inline

- 行内表单模式，与Element中的一致

- 类型：boolean

## Events

| 事件名 | 说明 | 参数 | 参数类型 |
| - | - | - | - |
| search | 点击“查询”或“重置”按钮时触发 | 已渲染的所有表单项的值 | object |

例：
``` javascript
// items
[
  {
    tag: 'Select',
    value: 'region',
    label: '活动区域',
    options: [
      {
        value: 'beijing',
        label: '区域一'
      }, 
      {
        value: 'shanghai',
        label: '区域二'
      }
    ]
  }
]

// search事件的参数
{
  region: 'beijing'
}
```

## Methods

| 方法名 | 说明 |
| - | - |
| getFields | 返回表单内各字段的值 |
| resetFields | 重置表单 |

## slot

| name | 说明 |
| - | - |
| Buttons | 插入至表单内的按钮，默认为“查询”和“重置” |
