<template>
  <el-form class="my-form" :inline="inline" :model="form" size="small" @submit.native.prevent>
    <template v-for="(item, index) in items">
      <el-form-item :key="2 * index" :label="item.label" v-show="(index <= position || (index > position && !hideMore)) && !item.isHidden">
        <el-date-picker v-if="item.type.toLowerCase() === 'datetimepicker' && !item.isHidden" v-model="form[item.value]" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="item.defaultValue === undefined" @change="item.change"></el-date-picker>
        <el-select v-if="item.type.toLowerCase() === 'select' && !item.isHidden" v-model="form[item.value]" :placeholder="item.placeholder || '请选择'" :clearable="item.defaultValue === undefined && !item.disclearable" @change="item.change">
          <el-option v-for="(option, i) in item.options" :key="i" :label="option.label" :value="option.value"></el-option>
        </el-select>
        <el-input v-if="item.type.toLowerCase() === 'input' && !item.isHidden" :placeholder="item.placeholder || '请输入'" v-model="form[item.value]" :clearable="item.defaultValue === undefined" @change="item.change">
          <el-select v-if="item.prepend && typeof item.prepend.type === 'string' && item.prepend.type.toLowerCase() === 'select' && !item.prepend.isHidden" v-model="form[item.prepend.value]" slot="prepend" :placeholder="item.placeholder || '请选择'" :class="item.prepend.class" :clearable="item.prepend.defaultValue === undefined" @change="item.prepend.change">
            <el-option v-for="(option, i) in item.prepend.options" :key="i" :label="option.label" :value="option.value"></el-option>
          </el-select>
        </el-input>
        <el-cascader v-if="item.type.toLowerCase() === 'cascader' && !item.isHidden" v-model="form[item.value]" :options="item.options" :props="item.props" :clearable="item.defaultValue === undefined" @change="item.change"></el-cascader>
        <el-input-number v-if="item.type.toLowerCase() === 'inputnumber' && !item.isHidden" v-model="form[item.value]" :controls-position="item.controlsPosition" :min="item.min" :max="item.max" @change="item.change"></el-input-number>
        <template v-if="item.type === 'buttons'">
          <slot name="buttons">
            <el-button class="button" @click="onSubmit">查询</el-button>
            <el-button class="button" @click="onReset">重置</el-button>
          </slot>
          <span class="more-conditions" v-if="canHideMore" @click="hideMore = !hideMore">更多条件<i :class="hideMore ? 'el-icon-arrow-down el-icon--right' : 'el-icon-arrow-up el-icon--right'"></i></span>
        </template>
      </el-form-item>
      <br :key="2 * index + 1" v-if="canHideMore && index === position" />
    </template>
  </el-form>
</template>

<script>
const defaultConfig = {
  items: [],
}
export default {
  name: 'my-form',
  props: {
    initItems: {
      type: Array,
      default: function () {
        return defaultConfig.items
      },
    },
    initPosition: {
      type: Number
    },
    inline: {
      type: Boolean
    }
  },
  data () {
    return {
      position: this.initPosition,
      hideMore: true,
      form: {},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
    }
  },
  computed: {
    items () {
      return this.buildItems(this.initItems)
    },
    canHideMore () {
      return this.position < this.items.length - 1
    },
    getHandlerByType () {
      return {
        select: this.handleSelect,
        input: this.handleInput,
        cascader: this.handleCascader,
      }
    }
  },
  methods: {
    isPlainObj (val) {
      return Object.prototype.toString.call(val) === '[object Object]'
    },
    handleSelect (item) {
      if (Array.isArray(item.options)) {
        item.disclearable = item.options.find(e => e.label === '全部' && e.value === undefined)
      } else {
        item.options = [] // options没传或传的不是数组就赋初值
      }
    },
    checkRequiredProp (item) {
      return item.type && typeof item.type === 'string' && item.value && typeof item.value === 'string'
    },
    handleInput (item) {
      if (item.prepend) {
        this.checkRequiredProp(item.prepend) ? this.handleItem(item.prepend) : delete item.prepend
      }
    },
    handleCascader (item) {
      if (!this.isPlainObj(item.props)) {
        item.props = {}
      }
    },
    setChangeCallback (item) {
      if (typeof item.change !== 'function') {
        item.change = function () {}
      }
    },
    handleItem (item) {
      const type = item.type.toLowerCase()
      const handler = this.getHandlerByType[type]
      handler?.(item)
      this.setChangeCallback(item)
    },
    buildItems (items) {
      items = items.filter(this.checkRequiredProp)
      items.forEach(this.handleItem)
      this.addButtons(items)
      this.setDefaultVal(items)
      return items
    },
    handlePosition (items, position = items.length) {
      this.position = Math.max(position, 0)
    },
    addButtons (items) {
      this.handlePosition(items, this.position)
      items.splice(this.position, 0, { type: 'buttons' })
    },
    setDefaultVal (items) {
      const setVal = item => item.defaultValue !== undefined && this.$set(this.form, item.value, item.defaultValue)
      for (let item of items) {
        setVal(item)
        item.prepend && setVal(item.prepend)
      }
    },
    getFields () {
      return this.form
    },
    onSubmit () {
      this.$emit('search', this.getFields())
    },
    resetFields () {
      this.form = {}
      this.setDefaultVal()
    },
    onReset () {
      this.resetFields()
      this.$emit('search', this.getFields())
    },
  }
}
</script>

<style lang="less" scoped>
  @blue: #4A82F7;
  .my-form {
    background: #fff;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px 10px 0 10px;
  }
  .button {
    background: #fff;
    border: 1px solid @blue;
    color: @blue;
    vertical-align: top; // 去掉垂直方向的间隙
  }
  .more-conditions {
    margin-left: 10px;
    color: @blue;
    cursor: pointer;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>

<style lang="less">
  @blue: #4A82F7;
  .my-form {
    .el-form-item {
      margin-right: 0;
      margin-bottom: 10px;
      padding-right: 18px;
    }
    .el-range-editor.el-input__inner,
    .el-select,
    .el-input {
      vertical-align: top; // 去掉垂直方向的间隙
    }
    .el-input-group__prepend {
      .el-select {
        vertical-align: baseline;
      }
    }
  }
</style>
