<template>
  <div>
    <template v-for="(item, index) in options">
      <template v-if="values.includes(item.dictValue)">
        <span
          v-if="item.listClass == 'default' || item.listClass == ''"
          :key="item.dictValue"
          :index="index"
          :class="item.cssClass"
          >{{ item.dictLabel }}</span
        >
        <el-tag
          v-else
          :key="item.dictValue"
          :index="index"
          :type="item.listClass == 'primary' ? '' : item.listClass"
          :class="item.cssClass"
        >
          {{ item.dictLabel }}
        </el-tag>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "DictTag",
  props: {
    options: {
      type: Array,
      default: null,
    },
    value: [String, Array, Number],
  },
  computed: {
    values() {
      let value = this.value
      // value为number类型时 变成字符串 0 --> '0'
      if (typeof value === 'number') {
        value = String(value)
      }
      if (value) {
        return Array.isArray(value) ? value : [ value ];
      } else {
        return [];
      }
    },
  },
};
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
