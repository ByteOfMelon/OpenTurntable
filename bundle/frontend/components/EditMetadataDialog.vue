<template>
    <Teleport to="body">
        <div class="fixed inset-0 flex items-center justify-center bg-black/70 z-[1000]" @click="$emit('close')">
            <div class="bg-[#252525] p-6 rounded-lg shadow-lg w-[500px] z-[1000]" @click.stop>
                <h2 class="text-xl font-bold mb-4 text-white">Edit Metadata</h2>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Title</label>
                        <input v-model="form.title" type="text" class="w-full bg-[#151515] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Artist</label>
                        <input v-model="form.artist" type="text" class="w-full bg-[#151515] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Album</label>
                        <input v-model="form.album" type="text" class="w-full bg-[#151515] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Genre</label>
                            <input v-model="form.genre" type="text" class="w-full bg-[#151515] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Year</label>
                            <input v-model="form.year" type="text" class="w-full bg-[#151515] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 mt-6">
                    <button @click="$emit('close')" class="px-4 py-2 rounded text-gray-300 hover:bg-[#353535] transition-colors">Cancel</button>
                    <button @click="save" class="px-4 py-2 rounded bg-primary text-white hover:bg-[#d42046] transition-colors">Save</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { database } from '~/wailsjs/go/models';
import { UpdateSongMetadata } from '~/wailsjs/go/main/App';

const props = defineProps<{
    song: database.SongWithDetails
}>();

const emit = defineEmits(['close', 'saved']);

const form = reactive({
    title: props.song.Title,
    artist: props.song.ArtistName.String || '',
    album: props.song.AlbumName.String || '',
    genre: props.song.Genre.String || '',
    year: props.song.Year.String === "0" ? "" : (props.song.Year.String || '')
});

const save = async () => {
    try {
        await UpdateSongMetadata(
            props.song.ID,
            form.title,
            form.artist,
            form.album,
            form.genre,
            form.year
        );
        emit('saved');
        emit('close');
    } catch (e) {
        console.error("Failed to update metadata:", e);
    }
};
</script>
