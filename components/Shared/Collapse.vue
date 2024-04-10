<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
    open: Boolean
})

const state = computed(() => {
    return props.open
})

const transition = ref({
    enterActiveClass: 'overflow-hidden transition-[height] duration-200 ease-out',
    leaveActiveClass: 'overflow-hidden transition-[height] duration-200 ease-out'
})

function onEnter(el: any) {
    el.style.height = '0'
    el.style.height = el.scrollHeight + 'px'
}

function onAfterEnter(el: any) {
    el.style.height = 'auto'
}

function onBeforeLeave(el: any) {
    el.style.height = el.scrollHeight + 'px'
}

function onLeave(el: any) {
    el.style.height = '0'
}
</script>

<template>
    <Transition
        name="collapse"
        v-bind="transition"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
    >
        <div v-show="state" class="collapse-root" :class="{'opened':state, 'closed':!state}">
            <slot />
        </div>
    </Transition>
</template>
