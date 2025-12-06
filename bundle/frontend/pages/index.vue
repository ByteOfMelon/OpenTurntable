<template>
   <div class="flex-1 overflow-hidden">
        <div class="p-4 h-full flex flex-col gap-4">
            <div class="flex-1 overflow-auto" v-if="!state.isLoading && songs.songs !== null && !songs.importing">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-gray-400 border-b border-gray-800 text-sm uppercase">
                            <th class="pb-2 w-12 cursor-pointer" @click="rearrangeSongs('id')">
                                <div class="flex flex-row items-center space-x-2">
                                    <span>#</span>
                                    <SortIcon :ascending="songs.arrangement.asc" v-if="songs.arrangement.key === 'id'" />
                                </div>
                            </th>
                            <th class="pb-2 cursor-pointer" @click="rearrangeSongs('title')">
                                <div class="flex flex-row items-center space-x-2">
                                    <span>{{ $t('general.title') }}</span>
                                    <SortIcon :ascending="songs.arrangement.asc" v-if="songs.arrangement.key === 'title'" />
                                </div>
                            </th>
                            <th class="pb-2 cursor-pointer" @click="rearrangeSongs('artist')">
                                <div class="flex flex-row items-center space-x-2">
                                    <span>{{ $t('general.artist') }}</span>
                                    <SortIcon :ascending="songs.arrangement.asc" v-if="songs.arrangement.key === 'artist'" />
                                </div>
                            </th>
                            <th class="pb-2 cursor-pointer" @click="rearrangeSongs('album')">
                                <div class="flex flex-row items-center space-x-2">
                                    <span>{{ $t('general.album') }}</span>
                                    <SortIcon :ascending="songs.arrangement.asc" v-if="songs.arrangement.key === 'album'" />
                                </div>
                            </th>
                            <th class="pb-2 cursor-pointer" @click="rearrangeSongs('genre')">
                                <div class="flex flex-row items-center space-x-2">
                                    <span>{{ $t('general.genre') }}</span>
                                    <SortIcon :ascending="songs.arrangement.asc" v-if="songs.arrangement.key === 'genre'" />
                                </div>
                            </th>
                            <th class="pb-2 cursor-pointer" @click="rearrangeSongs('year')">
                                <div class="flex flex-row items-center space-x-2">
                                    <span>{{ $t('general.year') }}</span>
                                    <SortIcon :ascending="songs.arrangement.asc" v-if="songs.arrangement.key === 'year'" />
                                </div>
                            </th>
                            <th class="pb-2 w-16 cursor-pointer" @click="rearrangeSongs('duration')">
                                <div class="flex flex-row items-center space-x-2">
                                    <fa icon="clock" />
                                    <SortIcon :ascending="songs.arrangement.asc" v-if="songs.arrangement.key === 'duration'" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="song in songs.songs" :key="song.ID" class="group hover:bg-secondary rounded-md">
                            <td class="py-3 pl-2 text-gray-400 group-hover:text-white play-btn">
                                <span class="id-label">{{ song.ID }}</span>
                                <div class="play-button-icon">
                                    <fa icon="circle-play" class="text-white cursor-pointer text-xl" @click="playback.beginPlayback(song, PlaybackSourceType.Library)"></fa>
                                </div>
                            </td>
                            <td class="py-3 text-white font-medium">
                                <div class="flex flex-row space-x-3 items-center">
                                    <div class="w-[32px] min-w-[32px]">
                                        <img class="w-[32px] shadow rounded" draggable="false" :src="song.AlbumArt.String ? song.AlbumArt.String : defaultArtwork" />
                                    </div>
                                    <span>{{ song.Title }}</span>
                                </div>
                            </td>
                            <td class="py-3 text-gray-400 group-hover:text-white">{{ song.ArtistName.String }}</td>
                            <td class="py-3 text-gray-400 group-hover:text-white">{{ song.AlbumName.String }}</td>
                            <td class="py-3 text-gray-400 group-hover:text-white">{{ song.Genre.String }}</td>
                            <td class="py-3 text-gray-400 group-hover:text-white">{{ song.Year.String == "0" ? "" : song.Year.String }}</td>
                            <td class="py-3 text-gray-400">{{ SecondsToDuration(song.Duration) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else-if="!state.isLoading && !songs.importing">
                <i>{{ $t('library.no_songs') }}</i>
            </div>
            <div v-else>
                <i>{{ $t('library.loading') }}</i>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
table th {
    position: sticky;
    top: 0;
    background: var(--component);
    z-index: 10;
}

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

<script lang="ts" setup>
    import { database } from '~/wailsjs/go/models';
    import { EventsOn } from '~/wailsjs/runtime';
    import defaultArtwork from '@/assets/img/default_artwork.png';
    import { PlaybackSourceType } from '~/stores/playback.stores';
    import { SecondsToDuration } from '~/utils/format';

    const playback = usePlaybackStore();
    const songs = useSongsStore();

    const state = reactive({
        isLoading: true,
        sortTitle: true,
        importDialog: false
    })

    onMounted(async () => {
        await songs.getAllSongs();
        state.isLoading = false;
        
        EventsOn("playbackComplete", async () => {
			playback.queueStep(true);
		});
    });

    const rearrangeSongs = async (by: string) => {
        let arrangement = await songs.rearrangeSongs(by);
        console.log(arrangement);

        if (arrangement.key === "title") {
            state.sortTitle = true;
        } else if (arrangement.key === "artist") {
            state.sortTitle = false;
        } else {
            state.sortTitle = true;
        }
    }
</script>