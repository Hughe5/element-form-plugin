<template>
  <element-form :initItems="items" :initPosition="3" @search="test" labelPosition="top"></element-form>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          tag: 'Input',
          label: '问题描述',
          value: 'value6',
          defaultValue: '9',
          prepend: {
            tag: 'Select',
            class: 'my-select',
            value: 'yu',
            options: [
              {
                label: 'a',
                value: '1'
              },
              {
                label: 'b',
                value: '2'
              }
            ]
          }
        },
        {
          id: 'tt',
          tag: 'InputNumber',
          value: 'abc',
          controlsPosition: 'right',
          min: 4,
          max: 12
        },
        {
          tag: 'Select',
          label: '工单类型', // 。。。。。。。。带全选选项的
          value: 'workOrderTypeId',
          options: [
            {
              label: '全部'
            },
            {
              label: '售前咨询', // 非必传，若没传则与value相同
              value: '1', // 必传
            },
            {
              label: '售后咨询',
              value: '2',
            },
            {
              label: '售前业务投诉',
              value: '4',
            },
            {
              label: '售后业务投诉',
              value: '3',
            },
            {
              label: '售后技术投诉',
              value: '5',
            },
            {
              label: '其他',
              value: '6',
            }
          ],
        },
      ]
    }
  },
  methods: {
    test (res) {
      console.log(res)
    }
  }
}
</script>

<style lang="less">
  .my-select {
    width: 172px;
  }
</style>
