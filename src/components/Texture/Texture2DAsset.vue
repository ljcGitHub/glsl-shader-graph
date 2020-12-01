<template>
  <Node
    title="Texture2D Asset"
    :inputs="inputs"
    :outputs="outputs"
    v-model="value"
  >
    <div style="width: 100%">
      <div class="texture2D-wrapper" @click="fileUpload">
        <img :src="texture2DUrl" class="texture2D-images">
        <span class="texture2D-name">{{fileName}}</span>
      </div>
    </div>
  </Node>
</template>

<script>
import { fileUpload } from 'common/utils/upload'

export default {
  name: 'Texture2DAsset',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      inputs: [],
      outputs: [{
        text: 'Out',
        vec: 2,
        tip: ''
      }],
      texture2DUrl: '',
      fileName: '请选择图片'
    }
  },
  methods: {
    getTexture2DVec() {
      const uid = this.value.uid
      return `${uid}_output_2_i0`
    },
    getCode() {
      const uid = this.value.uid
      return `
        uniform sampler2D ${uid}_output_2_i0;
      `
    },
    getExpression() {
      return ``
    },
    fileUpload() {
      fileUpload((fileObj) => {
        this.texture2DUrl = fileObj.baseData
        this.fileName = fileObj.fileName
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~common/style/variable';

.texture2D-wrapper{
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #414141;
  .texture2D-images{
    margin-right: 10px;
    width: 30px;
    height: 30px;
    background-color: #aaa;
  }
  .texture2D-name{
    font-size: 12px;
    color: #fff;
  }
}
</style>
