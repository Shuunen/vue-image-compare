<template>
  <figure :class="{ full }" class="image-compare" @mousemove.prevent="onMouseMove" @click.prevent="onMouseMove($event, true)">
    <div :class="{ visible: showDropzone }" class="drop-zone">Drop 1 or 2 images here !</div>

    <div v-show="!hideAfter && showAfter" :style="{ width: posX + 'px' }" class="wrapper" @mousedown.prevent="onMouseDownImage">
      <img :src="mutableAfter" :style="dimensions" alt="after" />
      <div v-show="afterLabel" class="after-name">
        {{ afterLabel }}
        <div v-show="afterSize" class="size">{{ afterSize }}</div>
      </div>
    </div>

    <img :src="mutableBefore" :style="dimensions" alt="before" @mousedown.prevent="onMouseDownImage" />

    <div v-if="!hideHandle" v-show="!hideAfter" :style="{ left: posX + 'px' }" class="handle" @mousedown.prevent="onMouseDownHandle">
      <span class="handle-icon left">
        <slot name="icon-left" />
      </span>
      <span class="handle-icon right">
        <slot name="icon-right" />
      </span>
    </div>

    <div v-show="beforeLabel" class="before-name">
      {{ beforeLabel }}
      <div v-show="beforeSize" class="size">{{ beforeSize }}</div>
    </div>
  </figure>
</template>

<script>
export default {
  props: {
    before: {
      type: String,
      default: '/assets/before.svg',
    },
    after: {
      type: String,
      default: '/assets/after.svg',
    },
    full: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: Object,
      required: false,
      default () {
        return {
          left: 0,
          right: 0,
        }
      },
    },
    hideAfter: {
      type: Boolean,
      default: false,
      required: false,
    },
    zoom: {
      type: Object,
      required: false,
      default () {
        return {
          min: 0.5,
          max: 2,
        }
      },
    },
    isZoomable: {
      type: Boolean,
      default: false,
      required: false,
    },
    isDraggable: {
      type: Boolean,
      default: false,
      required: false,
    },
    isSwitchable: {
      type: Boolean,
      default: false,
      required: false,
    },
    hideHandle: {
      type: Boolean,
      default: false,
      required: false,
    },
    reset: {
      type: Boolean,
      default: false,
      required: false,
    },
    labels: {
      type: Object,
      required: false,
      default () {
        return {
          after: '',
          before: '',
        }
      },
    },
  },
  data () {
    return {
      width: undefined,
      height: undefined,
      pageX: undefined,
      pageY: undefined,
      posX: undefined,
      isDraggingHandle: false,
      isDraggingImage: false,
      allowNextFrame: true,
      diffX: 0,
      diffY: 0,
      shiftX: 0,
      shiftY: 0,
      mutableZoom: 1,
      mutableBefore: this.before,
      mutableAfter: this.after,
      showDropzone: false,
      showAfter: true,
      beforeName: '',
      beforeSize: '',
      afterName: '',
      afterSize: '',
    }
  },
  computed: {
    afterLabel () {
      return this.afterName || this.labels.after
    },
    beforeLabel () {
      return this.beforeName || this.labels.before
    },
    isDragging () {
      return this.isDraggingImage || this.isDraggingHandle
    },
    dimensions () {
      const zoom = Number.parseFloat(this.mutableZoom.toFixed(2))
      return {
        width: `${this.width}px`,
        height: this.full ? `${this.height}px` : 'auto',
        transform: `scale(${zoom}) translate(${this.shiftX}px, ${this.shiftY}px)`,
      }
    },
    paddingTotal () {
      return this.padding.left + this.padding.right
    },
  },
  watch: {
    reset () {
      this.shiftX = 0
      this.shiftY = 0
      this.setInitialPosX()
    },
    paddingTotal () {
      this.setInitialPosX()
    },
  },
  created () {
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('resize', this.onResize)
    window.addEventListener('contextmenu', this.onRightClick)
    window.addEventListener('dragenter', this.onDragEnter)
    window.addEventListener('dragover', this.onDragOver)
    window.addEventListener('drop', this.onDrop)
  },
  mounted () {
    this.$el.addEventListener('wheel', this.onWheel)
    this.onResize()
  },
  beforeDestroy () {
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('resize', this.onResize)
    this.$el.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('contextmenu', this.onRightClick)
    window.removeEventListener('dragenter', this.onDragEnter)
    window.removeEventListener('dragover', this.onDragOver)
    window.removeEventListener('drop', this.onDrop)
  },
  methods: {
    onResize () {
      this.width = this.$el.clientWidth
      this.height = this.$el.clientHeight
      this.setInitialPosX()
    },
    onMouseDownHandle () {
      this.$emit('movement')
      this.isDraggingHandle = true
    },
    onMouseDownImage () {
      if (!this.isDraggable) return
      this.isDraggingImage = true
      this.$emit('movement')
    },
    onMouseUp (event) {
      event.preventDefault()
      this.isDraggingHandle = false
      this.isDraggingImage = false
      this.pageX = undefined
      this.pageY = undefined
      if (event.button === 1) this.onWheelClick()
    },
    onMouseMove (event, isDragging = false) {
      this.$emit('movement')
      if (event && event.type === 'click' && this.isDraggable) return
      if (event && this.allowNextFrame && (this.isDragging || isDragging)) {
        this.allowNextFrame = false
        let pageX = event.pageX
        let pageY = event.pageY
        if (event.targetTouches) {
          pageX = event.targetTouches[0].pageX
          pageY = event.targetTouches[0].pageY
        } else if (event.originalEvent && event.originalEvent.targetTouches) {
          pageX = event.originalEvent.targetTouches[0].pageX
          pageY = event.originalEvent.targetTouches[0].pageY
        }
        this.diffX = this.pageX ? pageX - this.pageX : 0
        this.diffY = this.pageY ? pageY - this.pageY : 0
        this.pageX = pageX
        this.pageY = pageY
        window.requestAnimationFrame(this.updatePosition)
      }
    },
    updatePosition () {
      if (!this.isDraggable || (this.isDraggable && this.isDraggingHandle)) {
        let posX = this.pageX - this.$el.getBoundingClientRect().left
        const pr = this.padding.right
        const pl = this.padding.left
        if (posX < pl) {
          posX = pl
        } else if (posX > this.width - pr) {
          posX = this.width - pr
        }
        this.posX = posX
      }
      if (this.isDraggingImage) {
        this.shiftX += this.diffX / this.mutableZoom
        this.shiftY += this.diffY / this.mutableZoom
      }
      this.allowNextFrame = true
    },
    setInitialPosX () {
      if (this.paddingTotal >= this.width) return console.error('Sum of paddings is wider then parent element!')
      this.posX = (this.width + this.padding.left - this.padding.right) / 2
    },
    onWheel (event) {
      if (!this.isZoomable) return
      this.mutableZoom += -event.deltaY / 1000
      this.$nextTick(() => {
        if (this.mutableZoom >= this.zoom.max) {
          this.mutableZoom = this.zoom.max
        } else if (this.mutableZoom <= this.zoom.min) {
          this.mutableZoom = this.zoom.min
        }
      })
    },
    onWheelClick () {
      // will flick images quickly
      let index = 0
      for (index = 0; index < 10; index++) setTimeout(this.switchImages, index * 100)
      setTimeout(() => (this.showAfter = true), index * 100) // reset after visibility
    },
    onRightClick (event) {
      event.preventDefault()
      this.switchImages()
    },
    switchImages () {
      this.showAfter = !this.showAfter
    },
    onDragEnter () {
      if (!this.isSwitchable) return
      this.showDropzone = true
    },
    onDragOver (event) {
      if (!this.isSwitchable) return
      event.preventDefault()
    },
    onDrop (event) {
      if (this.isSwitchable) {
        event.preventDefault()
        this.showDropzone = false
        const files = event.dataTransfer.files
        if (files.length === 1) {
          console.log('drop file :', files[0])
          const x = event.x
          const half = Math.round(window.outerWidth / 2)
          const leftSide = x <= half
          console.log('x ?', x)
          console.log('half ?', half)
          console.log('was on left side ?', leftSide)
          this.loadFile(files[0], leftSide)
        } else {
          console.log('drop files :', files)
          this.loadFile(files[0], true)
          this.loadFile(files[1], false)
        }
        this.mutableZoom = 1 // reset zoom
        this.showAfter = true // reset after visibility
        this.onResize()
      }
    },
    getFileName (file) {
      return file.name
    },
    getFileSize (file) {
      return '(' + Math.round(file.size / 1024) + ' Ko)'
    },
    loadFile (file, leftSide) {
      const reader = new FileReader()
      reader.addEventListener('load', (event) => {
        if (leftSide) {
          this.afterName = this.getFileName(file)
          this.afterSize = this.getFileSize(file)
          this.mutableAfter = event.target.result
        } else {
          this.beforeName = this.getFileName(file)
          this.beforeSize = this.getFileSize(file)
          this.mutableBefore = event.target.result
        }
      })
      reader.readAsDataURL(file)
    },
  },
}
</script>

<style scoped src="./vue-image-compare.css"></style>
