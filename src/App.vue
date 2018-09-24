<template>
    <div id="app">
        <image-compare :before="before" :after="after"
                       :full="full"
                       :hide-after="hideAfter"
                       :is-zoomable="isZoomable"
                       :is-switchable="isSwitchable"
                       :is-draggable="isDraggable"
                       :hide-handle="hideHandle"
                       :zoom="{min: zoom.min, max: zoom.max}"
                       :labels="{before: labels.before, after: labels.after}">

            <i slot="icon-left" class="fa fa-angle-left" aria-hidden="true"/>
            <i slot="icon-right" class="fa fa-angle-right" aria-hidden="true"/>
        </image-compare>

        <div class="options">
            <div class="wrapper">
                <label>Before :</label>
                <input v-model="before">
                <label>After :</label>
                <input v-model="after">
            </div>
            
            <div class="wrapper">
                <label>full : <input v-model="full" type="checkbox"></label>
                <label>hideAfter : <input v-model="hideAfter" type="checkbox"></label>
                <label>isZoomable : <input v-model="isZoomable" type="checkbox"></label>
                <label>isSwitchable : <input v-model="isSwitchable" type="checkbox"></label>
                <label>isDraggable : <input v-model="isDraggable" type="checkbox"></label>
                <label>hideHandle : <input v-model="hideHandle" type="checkbox"></label>
            </div>
            
            <div class="wrapper">
                <label>Labels :</label>
                <input v-model="labels.after">
                <input v-model="labels.before">
            </div>
            
            <div class="wrapper">
                <label>Zoom :</label>
                <input v-model.number="zoom.min" type="number">
                <input v-model.number="zoom.max" type="number">
            </div>
        </div>
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
                before: 'BEFORE',
                after: 'AFTER'
            },
            zoom: {
                min: 0.5,
                max: 2
            }
        }
    }
}
</script>

<style>
    html,
    body,
    #app {
        height: 100%;
    }

    .options {
        border-top: 1px solid black;
        padding: 1rem;
    }

    .wrapper {
        margin-bottom: 1rem;
    }

    body {
        margin: 0;
    }
</style>
