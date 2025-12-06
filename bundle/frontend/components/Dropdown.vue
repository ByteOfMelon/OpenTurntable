<template>
    <div class="relative" ref="dropdownRef">
        <div @click="toggle" class="cursor-pointer">
            <slot name="trigger"></slot>
        </div>
        <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <div v-if="isOpen" class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#252525] ring-1 ring-black ring-opacity-5 z-50 focus:outline-none">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <slot name="content" :close="() => isOpen = false"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggle = () => {
    isOpen.value = !isOpen.value;
};

const close = (e: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', close);
});

onUnmounted(() => {
    document.removeEventListener('click', close);
});
</script>
