<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <div id="app">
    <div @click="toggleInstructions" class="instructions" v-if="showInstructions" />
    <image-compare :after="after" :before="before" :full="full" :hide-after="hideAfter" :hide-handle="hideHandle" :is-draggable="isDraggable"
      :is-switchable="isSwitchable" :is-zoomable="isZoomable" :labels="{ before: labels.before, after: labels.after }"
      :zoom="{ min: zoom.min, max: zoom.max }">
      <template #icon-left>
        <i aria-hidden="true" class="fas fa-angle-left" />
      </template>
      <template #icon-right>
        <i aria-hidden="true" class="fas fa-angle-right" />
      </template>
    </image-compare>

    <i @click="toggleOptions" aria-hidden="true" class="show-options fas fa-sliders-h" title="Show options" />

    <div @click="showOptions = false" class="backdrop" v-show="showOptions" />
    <div class="options" v-show="showOptions">
      <div class="columns">
        <div class="column has-text-centered">
          <h1 class="title">{{ pkg.displayName }}</h1>
          <h2 class="subtitle">__unique-mark__</h2>
          <a :href="pkg.homepage" target="_blank">
            Project, sources & documentation on GitHub
            <i aria-hidden="true" class="fab fa-github" />
          </a>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">After image</label>
            <div class="control">
              <input class="input" placeholder="after image" type="text" v-model="after">
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">Before image</label>
            <div class="control">
              <input class="input" placeholder="before image" type="text" v-model="before">
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">After label</label>
            <div class="control">
              <input class="input" placeholder="after label" type="text" v-model="labels.after">
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">Before label</label>
            <div class="control">
              <input class="input" placeholder="before label" type="text" v-model="labels.before">
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Zoom scale min</label>
            <div class="control">
              <input :max="zoom.max" class="input" min="0" type="number" v-model.number="zoom.min">
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">Zoom scale max</label>
            <div class="control">
              <input :min="zoom.min" class="input" max="1000" type="number" v-model.number="zoom.max">
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column field">
          <div class="control">
            <label class="checkbox">
              full ?
              <input type="checkbox" v-model="full">
            </label>
          </div>
        </div>
        <div class="column field">
          <div class="control">
            <label class="checkbox">
              hideAfter ?
              <input type="checkbox" v-model="hideAfter">
            </label>
          </div>
        </div>
        <div class="column field">
          <div class="control">
            <label class="checkbox">
              isZoomable ?
              <input type="checkbox" v-model="isZoomable">
            </label>
          </div>
        </div>
        <div class="column field">
          <div class="control">
            <label class="checkbox">
              isSwitchable ?
              <input type="checkbox" v-model="isSwitchable">
            </label>
          </div>
        </div>
        <div class="column field">
          <div class="control">
            <label class="checkbox">
              isDraggable ?
              <input type="checkbox" v-model="isDraggable">
            </label>
          </div>
        </div>
        <div class="column field">
          <div class="control">
            <label class="checkbox">
              hideHandle ?
              <input type="checkbox" v-model="hideHandle">
            </label>
          </div>
        </div>
      </div>
      <hr>
      <div class="columns is-centered">
        <button @click="toggleOptions" class="button is-info">Hide options</button>
      </div>
    </div>
  </div>
</template>

<script>
import packageJson from '../package.json'
import ImageCompare from './vue-image-compare.vue'

export default {
  beforeUnmount () {
    window.removeEventListener('drop', this.onDrop)
  },
  components: {
    ImageCompare,
  },
  data () {
    return {
      after: './assets/after.svg',
      before: './assets/before.svg',
      full: true,
      hideAfter: false,
      hideHandle: false,
      isDraggable: true,
      isSwitchable: true,
      isZoomable: true,
      labels: {
        after: 'After',
        before: 'Before',
      },
      pkg: packageJson,
      showInstructions: true,
      showOptions: false,
      zoom: {
        max: 4,
        min: 0.5,
      },
    }
  },
  methods: {
    onDrop () {
      if (this.showInstructions) this.showInstructions = false
    },
    toggleInstructions () {
      this.showInstructions = !this.showInstructions
    },
    toggleOptions () {
      this.showOptions = !this.showOptions
    },
  },
  mounted () {
    window.addEventListener('drop', this.onDrop)
  },
}
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.min.css");

html,
body,
#app {
  height: 100%;
  overflow: hidden;
  --options-width: 900px;
}

.instructions {
  background-image: url("/assets/instructions.svg");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: inset 0 0 20vh black;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.options,
.show-options {
  z-index: 100;
  border: 2px solid currentColor;
  transition: all 0.3s;
  background-color: whitesmoke;
  border-radius: 5px;
}

.options {
  padding: 2rem 2rem 3rem;
  position: absolute;
  top: calc(50% - 300px);
  width: var(--options-width);
  left: calc(50% - var(--options-width) / 2);
  z-index: 300;
}

body {
  margin: 0;
}

.show-options {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 36px;
  color: grey;
  padding: 4px 6px;
  cursor: pointer;
}

.show-options:hover {
  transform: scale(1.1);
  color: #333;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
}
</style>
