<template>
    <div class="flex flex-1 overflow-hidden h-full">
        <NewPlaylistDialog v-if="state.newPlaylistDialog" @close="closeNewPlaylistDialog()" />
        <AddSongsToPlaylistDialog v-if="state.addSongsDialog && selectedPlaylistId" :playlistId="selectedPlaylistId" @close="closeAddSongsDialog()" />

        <!-- Sidebar -->
        <div class="w-64 bg-[#1a1a1a] flex flex-col shadow-md">
            <div class="p-4 flex justify-between items-center">
                <h2 class="font-bold text-lg">Playlists</h2>
                <button class="text-gray-400 hover:text-white" @click="state.newPlaylistDialog = true" title="New Playlist">
                    <fa icon="plus" class="cursor-pointer" />
                </button>
            </div>
            <div class="flex-1 overflow-y-auto">
                <div v-if="state.isLoading" class="p-4 text-center text-gray-500">
                    {{ $t('library.loading') }}
                </div>
                <div v-else-if="!playlistStore.playlists || playlistStore.playlists.length === 0" class="p-4 text-center text-gray-500">
                    {{ $t('playlists.no_playlists') }}
                </div>
                <div v-else>
                    <div 
                        v-for="p in playlistStore.playlists" 
                        :key="p.ID"
                        class="p-4 py-3 cursor-pointer items-center hover:bg-primary transition-colors"
                        :class="{ 'bg-primary': selectedPlaylistId === p.ID }"
                        @click="selectPlaylist(p.ID)"
                    >
                        <div class="font-medium truncate">{{ p.Name }}</div>
                        <div class="text-xs opacity-50 truncate">{{ p.Description }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden bg-[#151515]">
            <div v-if="selectedPlaylistId !== null && playlistStore.currentPlaylist" class="flex flex-col h-full">
                <!-- Header -->
                <div class="p-6 bg-gradient-to-b from-primary to-[#151515]">
                    <div class="flex space-x-6">
                        <div class="w-40 h-40 bg-secondary shadow-lg flex items-center justify-center overflow-hidden rounded">
                            <img :src="defaultArtwork" class="w-full h-full object-cover" draggable="false" />
                        </div>
                        <div class="flex flex-col">
                            <h1 class="text-5xl font-bold mb-4">{{ playlistStore.currentPlaylist.Playlist.Name }}</h1>
                            <p class="text-gray-400 text-sm mb-4">{{ playlistStore.currentPlaylist.Playlist.Description || $t('playlists.no_description') }}</p>
                            <div class="flex-grow"></div>
                            <div class="flex items-center space-x-4">
                                <button class="px-8 py-3 bg-primary text-white shadow-md font-bold rounded-full cursor-pointer" @click="playback.beginPlayback(playlistStore.currentPlaylist.Entries[0].Song, PlaybackSourceType.Playlist)">
                                    <fa icon="play" class="mr-2" /> {{ $t('general.play') }}
                                </button>
                                <button @click="state.addSongsDialog = true" class="px-8 py-3 bg-secondary text-white shadow-md font-bold rounded-full cursor-pointer">
                                    {{ $t('playlists.add_songs') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Song List -->
                <div class="flex-1 overflow-y-auto p-6">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="text-gray-400 border-b border-gray-800 text-sm uppercase">
                                <th class="pb-2 w-12 cursor-pointer" @click="rearrangePlaylist('list_order')">
                                    <div class="flex flex-row items-center space-x-2">
                                        <span>#</span>
                                        <SortIcon :ascending="playlistStore.arrangement.asc" v-if="playlistStore.arrangement.key === 'list_order'" />
                                    </div>
                                </th>
                                <th class="pb-2 cursor-pointer" @click="rearrangePlaylist('title')">
                                    <div class="flex flex-row items-center space-x-2">
                                        <span>{{ $t('general.title') }}</span>
                                        <SortIcon :ascending="playlistStore.arrangement.asc" v-if="playlistStore.arrangement.key === 'title'" />
                                    </div>
                                </th>
                                <th class="pb-2 cursor-pointer" @click="rearrangePlaylist('artist')">
                                    <div class="flex flex-row items-center space-x-2">
                                        <span>{{ $t('general.artist') }}</span>
                                        <SortIcon :ascending="playlistStore.arrangement.asc" v-if="playlistStore.arrangement.key === 'artist'" />
                                    </div>
                                </th>
                                <th class="pb-2 cursor-pointer" @click="rearrangePlaylist('album')">
                                    <div class="flex flex-row items-center space-x-2">
                                        <span>{{ $t('general.album') }}</span>
                                        <SortIcon :ascending="playlistStore.arrangement.asc" v-if="playlistStore.arrangement.key === 'album'" />
                                    </div>
                                </th>
                                <th class="pb-2 w-16 cursor-pointer" @click="rearrangePlaylist('duration')">
                                    <div class="flex flex-row items-center space-x-2">
                                        <fa icon="clock" />
                                        <SortIcon :ascending="playlistStore.arrangement.asc" v-if="playlistStore.arrangement.key === 'duration'" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr 
                                v-for="(entry, index) in (playlistStore.currentPlaylist.Entries || [])" 
                                :key="entry.ID"
                                class="group hover:bg-secondary rounded-md"
                            >
                                <td class="py-3 pl-2 text-gray-400 group-hover:text-white play-btn">
                                    <span class="id-label">{{ index + 1 }}</span>
                                    <div class="play-button-icon">
                                        <fa icon="circle-play" class="text-white cursor-pointer text-xl" @click="playback.beginPlayback(entry.Song, PlaybackSourceType.Playlist)"></fa>
                                    </div>
                                </td>
                                <td class="py-3 text-white font-medium">
                                    <div class="flex flex-row space-x-3 items-center">
                                        <div class="w-[32px] min-w-[32px]">
                                            <img class="w-[32px] shadow rounded" draggable="false" :src="entry.Song.AlbumArt.String ? entry.Song.AlbumArt.String : defaultArtwork" />
                                        </div>
                                        <span>{{ entry.Song.Title }}</span>
                                    </div>
                                </td>
                                <td class="py-3 text-gray-400 group-hover:text-white">{{ entry.Song.ArtistName.String || 'Unknown' }}</td>
                                <td class="py-3 text-gray-400 group-hover:text-white">{{ entry.Song.AlbumName.String || 'Unknown' }}</td>
                                <td class="py-3 text-gray-400">{{ SecondsToDuration(entry.Song.Duration) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="!playlistStore.currentPlaylist.Entries || playlistStore.currentPlaylist.Entries.length === 0" class="text-center text-gray-500 mt-10">
                        {{ $t('playlists.empty') }}
                    </div>
                </div>
            </div>
            <div v-else class="flex-1 flex items-center justify-center text-gray-500">
                {{ $t('playlists.select_playlist') }}
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.play-button-icon {
    display: none;
}

.id-label {
    display: block;
}

/* Show play button and hide ID when hovering the row */
.group:hover .play-button-icon {
    display: block;
}

.group:hover .id-label {
    display: none;
}
</style>

<script setup lang="ts">
    import NewPlaylistDialog from '~/components/NewPlaylistDialog.vue';
    import AddSongsToPlaylistDialog from '~/components/AddSongsToPlaylistDialog.vue';
    import { usePlaylistsStore } from '~/stores/playlists.stores';
    import { SecondsToDuration } from '~/utils/format';
    import { PlaybackSourceType } from '~/stores/playback.stores';
    import defaultArtwork from '@/assets/img/default_artwork.png';

    const playlistStore = usePlaylistsStore();
    const playback = usePlaybackStore();

    const state = reactive({
        isLoading: true,
        newPlaylistDialog: false,
        addSongsDialog: false
    })

    const selectedPlaylistId = ref<number | null>(null);

    onMounted(async () => {
        await playlistStore.loadPlaylists();
        state.isLoading = false;
    });

    const selectPlaylist = async (id: number) => {
        selectedPlaylistId.value = id;
        await playlistStore.getPlaylist(id);
    }

    const closeNewPlaylistDialog = async () => {
        state.newPlaylistDialog = false;
        await playlistStore.loadPlaylists();
    }

    const closeAddSongsDialog = async () => {
        state.addSongsDialog = false;
        if (selectedPlaylistId.value) {
            await playlistStore.getPlaylist(selectedPlaylistId.value);
        }
    }

    const rearrangePlaylist = async (by: string) => {
        await playlistStore.rearrangePlaylist(by);
    }
</script>