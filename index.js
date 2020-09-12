import myForm from './index.vue'

myForm.install = function (Vue) {
  Vue.component(myForm.name, myForm)
}

export default myForm
