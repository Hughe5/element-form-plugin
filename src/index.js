import elementForm from './index.vue'

elementForm.install = function (Vue) {
  Vue.component(elementForm.name, elementForm)
}

export default elementForm
