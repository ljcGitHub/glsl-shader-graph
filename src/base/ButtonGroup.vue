<template>
  <div class="button">
    <div class="button-item" v-for="(item, $index) in data" :key="$index">
      <span>{{ item.title }}</span>
      <div class="button-nav" v-if="show">
        <div
          class="button-nav-item"
          v-for="(l, $$index) in item.list"
          :key="$$index"
          @click="itemClick(l)"
        >
          <span>{{ l.text }}</span>
          <span>{{ l.shortcuts }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonGroup',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      show: true
    }
  },
  methods: {
    itemClick(item) {
      this.show = false
      setTimeout(() => {
        this.show = true
      }, 400)
      item.onClick && item.onClick()
    }
  }
}

</script>

<style scoped lang="stylus">
@import '~common/style/variable';

.button {
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
}

.button-item {
  position: relative;
  display: inline-block;
  padding: 0 10px;
  line-height: 32px;
  font-size: 12px;
  color: #d8d8d8;
  transition: all 0.3s;

  &:hover {
    cursor: pointer;
    background-color: #547ab5;

    .button-nav {
      display: block;
    }
  }

  .button-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: -1px;
    background-color: rgba(31, 31, 31, .8);
    border: 1px solid #3d3d3d;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    z-index: 100;
  }

  .button-nav-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 6px 8px 12px;
    width: 220px;
    line-height: 1;
    color: #fff;
    font-size: 12px;

    &:hover {
      cursor: pointer;
      background-color: #547ab5;
    }
  }
}
</style>
