# Vue Image Compare

[![npm](https://img.shields.io/npm/v/vue-image-compare2.svg?color=informational)](https://www.npmjs.com/package/vue-image-compare2)
[![npm monthly downloads](https://img.shields.io/npm/dm/vue-image-compare2.svg?color=informational)](https://www.npmjs.com/package/vue-image-compare2)
[![vue2](https://img.shields.io/badge/vue-2-brightgreen.svg?color=informational)](https://vuejs.org/)
[![Package Quality](https://npm.packagequality.com/shield/vue-image-compare2.svg)](https://packagequality.com/#?package=vue-image-compare2)
[![GitHub license](https://img.shields.io/github/license/shuunen/vue-image-compare.svg?color=informational)](https://github.com/Shuunen/vue-image-compare/blob/master/LICENSE)

[![Website](https://img.shields.io/website/https/image-compare.netlify.app.svg)](https://image-compare.netlify.app)
[![BCH compliance](https://bettercodehub.com/edge/badge/Shuunen/vue-image-compare?branch=master)](https://bettercodehub.com/)

- [Vue Image Compare](#vue-image-compare)
  - [Purpose of this fork](#purpose-of-this-fork)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Props](#props)
    - [Slots](#slots)
    - [Events](#events)
  - [Development](#development)
  - [Todo](#todo)
  - [Thanks](#thanks)
  - [License](#license)

## Purpose of this fork

**Updates** (original repo seems dead) & new **features** :)

**simple images loading** via drag & drop files into browser, will load images locally (no upload to any server)

- drop 2 files
- drop 1 file on one side to change only one side of the comparison

**better image comparison**  to see details :

- allow click & drag
- allow zoom
- allow middle click to start flickering left image for seconds

You can see the updated features of this fork on : [https://image-compare.netlify.app](https://image-compare.netlify.app)

And still check the original author website : [https://marcincichocki.github.io/vue-image-compare](https://marcincichocki.github.io/vue-image-compare)

## Installation

```bash
yarn add vue-image-compare2
# or
npm i vue-image-compare2 --save
```

## Usage

- register the component **Globally** :

```javascript
import Vue from 'vue'
import imageCompare from 'vue-image-compare2'

new Vue({
    components: {
        imageCompare
    },
    data() {
        return {
            before: '/img/before.jpg',
            after: '/img/after.jpg'
        }
    }
}).$mount('#app')
```

or **locally** :

```javascript
import imageCompare from 'vue-image-compare2'

export default {
   data() {
    return {
      before: '/img/before.jpg',
      after: '/img/after.jpg'
    }
  },
  components: {
    imageCompare
  }
}
```

- Then you can use `image-compare` with a minimal init :

```html
<div id="app">
    <image-compare :before="before" :after="after"/>
</div>
```

or with some optionals params, like in [demo folder](https://github.com/Shuunen/vue-image-compare/tree/master/demo) :

```html
<div id="app">
    <image-compare :before="before" :after="after" full isZoomable isSwitchable isDraggable>
      <i class="fa fa-angle-left" aria-hidden="true" slot="icon-left"></i>
      <i class="fa fa-angle-right" aria-hidden="true" slot="icon-right"></i>
    </image-compare>
</div>
```

### Props

| Name           | Type      | Default                    | Description                 |
| -------------- | --------- | -------------------------- | --------------------------- |
| `before`       | `String`  | `undefined` (**required**) | path to the image *before*  |
| `after`        | `String`  | `undefined` (**required**) | path to the image *after*   |
| `full`         | `Boolean` | `false`                    | stretch images (1)          |
| `padding`      | `Object`  | `{left: 0, right: 0}`      | left and right padding (2)  |
| `hideAfter`    | `Boolean` | `false`                    | hide the after image        |
| `zoom`         | `Object`  | `{min: 0.5, max: 2}`       | scale image by              |
| `reset`        | `Boolean` | `false`                    | reset all to original       |
| `isZoomable`   | `Boolean` | `false`                    | mouse wheel to zoom in/out  |
| `isDraggable`  | `Boolean` | `false`                    | allow moving the comparison |
| `isSwitchable` | `Boolean` | `false`                    | allow drag & drop           |
| `hideHandle`   | `Boolean` | `false`                    | hide vertical handle bar    |
| `labels`       | `Object`  | `{after: '', before: ''}`  | comparison labels           |

(1) : Determines if images are stretched to fill parent element. Can be used with help of CSS object-fit: cover to create full page image comparison

(2) : Set left and right "padding" in pixels, so handle can not reach edge of an image

### Slots

- `icon-left` - element to be placed on the left side of the handle
- `icon-right` - element to be placed on the right side of the handle

Example:

```html
<image-compare before="/img/before.jpg" after="/img/after.jpg">
    <i class="fa fa-angle-left" aria-hidden="true" slot="icon-left"></i>
    <i class="fa fa-angle-right" aria-hidden="true" slot="icon-right"></i>
</image-compare>
```

### Events

- `@movement` - when image/handle is dragged left/right

## Development

To contribute or try this component :

- clone this repo
- install dependencies : `npm install`
- start dev task : `npm run dev`

## Todo

- [ ] submit this app to [ProductHunt](https://www.producthunt.com/)

## Thanks

- [ctf0](https://github.com/ctf0) : for his multiple contributions :heart:
- [FreeIcons.io](https://freeicons.io/material-icons-images/compare-icon-15244): for the logo/icon
- [Github](https://github.com) : for all their great work year after year, pushing OSS forward
- [Netlify](https://netlify.com) : awesome company that offers hosting for OSS
- [Npm-run-all](https://github.com/mysticatea/npm-run-all) : to keep my npm scripts clean & readable
- [Pixabay](https://pixabay.com) : for the free to use images
- [Repo-checker](https://github.com/Shuunen/repo-checker) : eslint cover /src code and this tool the rest ^^
- [Shields.io](https://shields.io) : nice looking badges to be proud of
- [vite-vue2-starter](https://github.com/matt-auckland/vite-vue2-starter): for the vite vue 2 starter pack
- [Vue](https://vuejs.org) : when I need a front framework, this is the one I choose <3

## License

[MIT](/LICENSE)
