import { createLocalVue, shallowMount } from '@vue/test-utils'
import ElementUI from 'element-ui'
import myForm from '../../src/index.vue'

const localVue = createLocalVue()

localVue.use(ElementUI)

describe('myForm', () => {
  it('renders props.msg when passed', () => {
    const wrapper = shallowMount(myForm, {
      localVue
    })
    expect(wrapper.vm.isPlainObj({})).toBeTruthy()
  })
})
