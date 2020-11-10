import { createLocalVue, shallowMount } from '@vue/test-utils'
import ElementUI from 'element-ui'
import elementForm from '../../src/index.vue'

const localVue = createLocalVue()

localVue.use(ElementUI)

describe('elementForm', () => {
  it('renders props.msg when passed', () => {
    const wrapper = shallowMount(elementForm, {
      localVue
    })
    expect(wrapper.vm.isPlainObj({})).toBeTruthy()
  })
})
