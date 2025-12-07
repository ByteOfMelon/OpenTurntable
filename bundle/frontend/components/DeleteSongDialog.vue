<template>
    <Teleport to="body">
        <div class="fixed inset-0 flex items-center justify-center bg-black/70 z-[1000]" @click="$emit('close')">
            <div class="bg-[#252525] p-6 rounded-lg shadow-lg w-[400px] z-[1000]" @click.stop>
                <h2 class="text-xl font-bold mb-4 text-white">Delete Song</h2>
                
                <p class="text-gray-300 mb-4">
                    Are you sure you want to delete <span class="font-bold text-white">"{{ song.Title }}"</span> from your library?
                </p>
                
                <p class="text-gray-400 text-sm mb-6 bg-[#151515] p-3 rounded border border-gray-700">
                    <fa icon="circle-info" class="mr-1"></fa> This will only remove the song from the OpenTurntable library database. The actual file on your disk will <b>NOT</b> be deleted.
                </p>

                <div class="flex justify-end space-x-3">
                    <button @click="$emit('close')" class="px-4 py-2 rounded text-gray-300 hover:bg-[#353535] transition-colors">Cancel</button>
                    <button @click="confirmDelete" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors">Delete</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { database } from '~/wailsjs/go/models';
import { DeleteSong } from '~/wailsjs/go/main/App';

const props = defineProps<{
    song: database.SongWithDetails
}>();

const emit = defineEmits(['close', 'deleted']);

const confirmDelete = async () => {
    try {
        await DeleteSong(props.song.ID);
        emit('deleted');
        emit('close');
    } catch (e) {
        console.error("Failed to delete song:", e);
    }
};
</script>
