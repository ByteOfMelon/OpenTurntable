<template>
    <div class="flex flex-col w-full h-screen">
        <ImportDialog v-if="songs.importing" :currentlyImporting="currentlyImporting" />
        <MainBar />
        <slot />
        <NowPlayingBar />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { EventsOn } from '~/wailsjs/runtime';
import ImportDialog from '~/components/ImportDialog.vue';

const songs = useSongsStore();
const currentlyImporting = ref("");

onMounted(() => {
    EventsOn("toggleImporting", async () => {
        songs.importing = !songs.importing;
    });
    
    EventsOn("currentImportFileWorking", async (path: string) => {
        currentlyImporting.value = path;
    });
});
</script>