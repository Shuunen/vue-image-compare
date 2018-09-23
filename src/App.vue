<template>
    <div id="app">
        <ImageCompare :before="before" :after="after">
            <i slot="icon-left" class="fa fa-angle-left" aria-hidden="true"/>
            <i slot="icon-right" class="fa fa-angle-right" aria-hidden="true"/>
        </ImageCompare>

        <hr>
        <label>Before :</label>
        <input v-model="before">
        <label>After :</label>
        <input v-model="after">
        <br>
        <input v-model="full" type="checkbox">
        <input v-model="hideAfter" type="checkbox">
        <input v-model="isZoomable" type="checkbox">
        <input v-model="isSwitchable" type="checkbox">
        <input v-model="isDraggable" type="checkbox">
        <input v-model="hideHandle" type="checkbox">
        <br>
        <label>Labels :</label>
        <input v-model="labels.after">
        <input v-model="labels.before">

        <br>
        <label>Zoom :</label>
        <input v-model.number="zoom.min">
        <input v-model.number="zoom.max">
    </div>
</template>

<script>
import ImageCompare from 'vue-image-compare2'

export default {
  components: {
      ImageCompare
  },
  name: 'app',
  data() {
    return {
      before: 'assets/before.jpg',
      after: 'assets/after.jpg',
      full: true,
      hideAfter: false,
      isZoomable: true,
      isSwitchable: true,
      isDraggable: true,
      hideHandle: false,
      labels: {
        before: '',
        after: ''
      },
      zoom: {
        min: '',
        max: ''
      }
    }
  }
}
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
}
body {
  margin: 0;
}
</style>
