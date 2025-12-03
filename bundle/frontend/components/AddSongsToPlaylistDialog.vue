<template>
	<div class="flex justify-center items-center min-h-screen z-1000">
		<div class="fixed inset-0 flex items-center justify-center bg-black/70 z-1000">
			<div class="bg-[#252525] p-6 rounded-lg shadow-lg w-[600px] max-h-[80vh] flex flex-col z-1000">
                <div class="flex flex-row items-center mb-4">
				    <h2 class="text-xl font-semibold">{{ $t('playlists.add_songs_title') }}</h2>
                    <div class="flex-grow"></div>
                    <fa icon="x" @click="emit('close')" class="cursor-pointer"></fa>
                </div>

                <div class="mb-4">
                    <input type="text" :placeholder="$t('general.search_placeholder')" v-model="searchQuery" class="w-full" />
                </div>

                <div class="flex-1 overflow-y-auto min-h-0 mb-4 border border-gray-700 rounded p-2">
                    <div v-if="filteredSongs.length === 0" class="text-center text-gray-500 py-4">
                        {{ $t('library.no_songs_found') }}
                    </div>
                    <div v-for="song in filteredSongs" :key="song.ID" class="flex items-center p-2 hover:bg-secondary rounded cursor-pointer" @click="toggleSelection(song.ID)">
                        <input type="checkbox" :checked="selectedSongIds.has(song.ID)" class="mr-3" @click.stop="toggleSelection(song.ID)" />
                        <div class="flex flex-col overflow-hidden">
                            <span class="truncate font-medium">{{ song.Title }}</span>
                            <span class="truncate text-sm text-gray-400">{{ song.ArtistName.String || $t('defaults.artist') }} - {{ song.AlbumName.String || $t('defaults.album') }}</span>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3">
                    <button @click="emit('close')" class="px-6 py-3 rounded-full bg-secondary hover:bg-secondary/80 cursor-pointer">
                        {{ $t('general.cancel') }}
                    </button>
                    <button @click="addSongs()" class="px-6 py-3 rounded-full bg-primary hover:bg-primary/80 disabled:opacity-50 cursor-pointer" :disabled="selectedSongIds.size === 0">
                        {{ $t('playlists.add_n_songs', { n: selectedSongIds.size }) }}
                    </button>
                </div>
			</div>
		</div>
	</div>
</template>

<style lang="css" scoped>
    input[type="text"] {
        background: #151515;
        padding: 8px;
        outline: none;
        border-radius: 5px;
    }
</style>

<script setup lang="ts">
import { useSongsStore } from '~/stores/songs.stores';
import { usePlaylistsStore } from '~/stores/playlists.stores';

const props = defineProps<{
    playlistId: number
}>();

const emit = defineEmits(['close']);
const songsStore = useSongsStore();
const playlistsStore = usePlaylistsStore();

const searchQuery = ref("");
const selectedSongIds = reactive(new Set<number>());

onMounted(async () => {
    if (!songsStore.songs) {
        await songsStore.getAllSongs();
    }
});

const filteredSongs = computed(() => {
    if (!songsStore.songs) return [];

    // Get IDs of songs already in the playlist
    const existingSongIds = new Set<number>();
    if (playlistsStore.currentPlaylist && playlistsStore.currentPlaylist.Playlist.ID === props.playlistId) {
        if (playlistsStore.currentPlaylist.Entries) {
            playlistsStore.currentPlaylist.Entries.forEach(entry => {
                existingSongIds.add(entry.Song.ID);
            });
        }
    }

    let songs = songsStore.songs.filter(song => !existingSongIds.has(song.ID));

    const query = searchQuery.value.toLowerCase();
    if (!query) return songs;
    
    return songs.filter(song => {
        return (
            song.Title.toLowerCase().includes(query) ||
            (song.ArtistName.String && song.ArtistName.String.toLowerCase().includes(query)) ||
            (song.AlbumName.String && song.AlbumName.String.toLowerCase().includes(query))
        );
    });
});

const toggleSelection = (id: number) => {
    if (selectedSongIds.has(id)) {
        selectedSongIds.delete(id);
    } else {
        selectedSongIds.add(id);
    }
};

const addSongs = async () => {
    if (selectedSongIds.size === 0) return;
    
    await playlistsStore.addSongsToPlaylist(props.playlistId, Array.from(selectedSongIds));
    emit('close');
};
</script>
