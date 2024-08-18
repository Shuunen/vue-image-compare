<template>
  <figure :class="{ full }" @click.prevent="onMouseMove($event, true)" @mousemove.prevent="onMouseMove" class="image-compare">
    <div :class="{ visible: showDropzone }" class="drop-zone">Drop 1 or 2 images here !</div>

    <div :style="{ width: posX + 'px' }" @mousedown.prevent="onMouseDownImage" class="wrapper" v-show="!hideAfter && showAfter">
      <img :src="mutableAfter" :style="dimensions" alt="after">
      <div class="after-name" v-show="afterLabel">
        {{ afterLabel }}
        <div class="size" v-show="afterSize">{{ afterSize }}</div>
      </div>
    </div>

    <img :src="mutableBefore" :style="dimensions" @mousedown.prevent="onMouseDownImage" alt="before">

    <div :style="{ left: posX + 'px' }" @mousedown.prevent="onMouseDownHandle" class="handle" v-if="!hideHandle" v-show="!hideAfter">
      <span class="handle-icon left">
        <slot name="icon-left" />
      </span>
      <span class="handle-icon right">
        <slot name="icon-right" />
      </span>
    </div>

    <div class="before-name" v-show="beforeLabel">
      {{ beforeLabel }}
      <div class="size" v-show="beforeSize">{{ beforeSize }}</div>
    </div>
  </figure>
</template>

<script>
/* eslint-disable max-lines */
import { Logger } from 'shuutils'

const logger = new Logger()

logger.info('Vue Image Compare start ^^')

const nbDecimals = 2

export default {
  beforeUnmount () {
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('resize', this.onResize)
    this.$el.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('contextmenu', this.onRightClick)
    window.removeEventListener('dragenter', this.onDragEnter)
    window.removeEventListener('dragover', this.onDragOver)
    window.removeEventListener('drop', this.onDrop)
  },
  computed: {
    afterLabel () {
      return this.afterName || this.labels.after
    },
    beforeLabel () {
      return this.beforeName || this.labels.before
    },
    dimensions () {
      const zoom = Number.parseFloat(this.mutableZoom.toFixed(nbDecimals))
      return {
        height: this.full ? `${this.height}px` : 'auto',
        transform: `scale(${zoom}) translate(${this.shiftX}px, ${this.shiftY}px)`,
        width: `${this.width}px`,
      }
    },
    isDragging () {
      return this.isDraggingImage || this.isDraggingHandle
    },
    paddingTotal () {
      return this.padding.left + this.padding.right
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
  data () {
    return {
      afterName: '',
      afterSize: '',
      allowNextFrame: true,
      beforeName: '',
      beforeSize: '',
      diffX: 0,
      diffY: 0,
      height: undefined,
      isDraggingHandle: false,
      isDraggingImage: false,
      mutableAfter: this.after,
      mutableBefore: this.before,
      mutableZoom: 1,
      pageX: undefined,
      pageY: undefined,
      posX: undefined,
      shiftX: 0,
      shiftY: 0,
      showAfter: true,
      showDropzone: false,
      width: undefined,
    }
  },
  emits: ['movement'],
  methods: {
    getFileName (file) {
      return file.name
    },
    getFileSize (file) {
      const nbInKo = 1024
      return `(${Math.round(file.size / nbInKo)} Ko)`
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
    onDragEnter () {
      if (!this.isSwitchable) return
      this.showDropzone = true
    },
    onDragOver (event) {
      if (!this.isSwitchable) return
      event.preventDefault()
    },
    // eslint-disable-next-line max-statements
    onDrop (event) {
      if (this.isSwitchable) {
        event.preventDefault()
        this.showDropzone = false
        const files = event.dataTransfer.files
        if (files.length === 1) {
          logger.debug('drop file :', files[0])
          const x = event.x // eslint-disable-line id-length
          const half = Math.round(window.outerWidth / nbDecimals)
          const leftSide = x <= half
          logger.debug('x ?', x)
          logger.debug('half ?', half)
          logger.debug('was on left side ?', leftSide)
          this.loadFile(files[0], leftSide)
        } else {
          logger.debug('drop files :', files)
          this.loadFile(files[0], true)
          this.loadFile(files[1], false)
        }
        this.mutableZoom = 1 // reset zoom
        this.showAfter = true // reset after visibility
        this.onResize()
      }
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
    // eslint-disable-next-line complexity, max-statements
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
    onMouseUp (event) {
      event.preventDefault()
      this.isDraggingHandle = false
      this.isDraggingImage = false
      this.pageX = undefined
      this.pageY = undefined
      if (event.button === 1) this.onWheelClick()
    },
    onResize () {
      this.width = this.$el.clientWidth
      this.height = this.$el.clientHeight
      this.setInitialPosX()
    },
    onRightClick (event) {
      event.preventDefault()
      this.switchImages()
    },
    onWheel (event) {
      if (!this.isZoomable) return
      const thousand = 1000
      this.mutableZoom += -event.deltaY / thousand
      this.$nextTick(() => {
        if (this.mutableZoom >= this.zoom.max) this.mutableZoom = this.zoom.max
        else if (this.mutableZoom <= this.zoom.min) this.mutableZoom = this.zoom.min
      })
    },
    onWheelClick () {
      // will flick images quickly
      const nbFlicks = 10
      const delayBetweenFlicks = 100
      // eslint-disable-next-line no-useless-assignment
      let index = 0
      for (index = 0; index < nbFlicks; index += 1) setTimeout(this.switchImages, index * delayBetweenFlicks)
      setTimeout(() => (this.showAfter = true), index * delayBetweenFlicks) // reset after visibility
    },
    setInitialPosX () {
      if (this.paddingTotal >= this.width) { logger.error('Sum of paddings is wider then parent element!'); return }
      const half = 2
      this.posX = (this.width + this.padding.left - this.padding.right) / half
    },
    switchImages () {
      this.showAfter = !this.showAfter
    },
    updatePosition () {
      if (!this.isDraggable || (this.isDraggable && this.isDraggingHandle)) {
        let posX = this.pageX - this.$el.getBoundingClientRect().left
        const pr = this.padding.right
        const pl = this.padding.left
        if (posX < pl) posX = pl
        else if (posX > this.width - pr) posX = this.width - pr
        this.posX = posX
      }
      if (this.isDraggingImage) {
        this.shiftX += this.diffX / this.mutableZoom
        this.shiftY += this.diffY / this.mutableZoom
      }
      this.allowNextFrame = true
    },
  },
  mounted () {
    this.$el.addEventListener('wheel', this.onWheel)
    this.onResize()
  },
  props: {
    after: {
      default: '/assets/after.svg',
      type: String,
    },
    before: {
      default: '/assets/before.svg',
      type: String,
    },
    full: {
      default: false,
      type: Boolean,
    },
    hideAfter: {
      default: false,
      required: false,
      type: Boolean,
    },
    hideHandle: {
      default: false,
      required: false,
      type: Boolean,
    },
    isDraggable: {
      default: false,
      required: false,
      type: Boolean,
    },
    isSwitchable: {
      default: false,
      required: false,
      type: Boolean,
    },
    isZoomable: {
      default: false,
      required: false,
      type: Boolean,
    },
    labels: {
      default () {
        return {
          after: '',
          before: '',
        }
      },
      required: false,
      type: Object,
    },
    padding: {
      default () {
        return {
          left: 0,
          right: 0,
        }
      },
      required: false,
      type: Object,
    },
    reset: {
      default: false,
      required: false,
      type: Boolean,
    },
    zoom: {
      default () {
        return {
          max: 2,
          min: 0.5,
        }
      },
      required: false,
      type: Object,
    },
  },
  watch: {
    paddingTotal () {
      this.setInitialPosX()
    },
    reset () {
      this.shiftX = 0
      this.shiftY = 0
      this.setInitialPosX()
    },
  },
}
</script>

<style scoped src="./vue-image-compare.css"></style>
