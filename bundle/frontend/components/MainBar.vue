<template>
    <div class="flex items-center w-full shadow-lg space-x-2 p-2" style="background: #252525;">
		<AboutDialog v-if="state.showAboutDialog" @close="state.showAboutDialog = false" />
		<div @click="navigateTo('/')" :class="`flex items-center justify-center space-x-2 px-4 py-2 rounded-md cursor-pointer thing ${route.path === '/' ? 'bg-[#151515]' : ''}`">
			<fa icon="book" size="lg"></fa>
			<span class="font-bold">{{ $t('general.library') }}</span>
		</div>
		<div @click="navigateTo('/nowplaying')" :class="`flex items-center justify-center space-x-2 px-4 py-2 rounded-md cursor-pointer thing ${route.path === '/nowplaying' ? 'bg-[#151515]' : ''}`">
			<fa icon="circle-play" size="lg"></fa>
			<span class="font-bold">{{ $t('general.now_playing') }}</span>
		</div>
		<div @click="navigateTo('/playlists')" :class="`flex items-center justify-center space-x-2 px-4 py-2 rounded-md cursor-pointer thing ${route.path === '/playlists' ? 'bg-[#151515]' : ''}`">
			<fa icon="file-audio" size="lg"></fa>
			<span class="font-bold">{{ $t('general.playlist', 2) }}</span>
		</div>
		<div class="flex-grow"></div>
        
        <Dropdown class="mr-2">
            <template #trigger>
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-[#d42046] transition-colors shadow-md text-white cursor-pointer">
                    <fa icon="plus" size="lg"></fa>
                </div>
            </template>
            <template #content="{ close }">
                <div @click="songs.chooseSong(); close()" class="block px-4 py-2 text-sm text-white hover:bg-[#353535] cursor-pointer flex items-center">
                    <fa icon="square-plus" class="mr-2 w-4"></fa> {{ $t("library.add_song") }}
                </div>
                <div @click="songs.importSongsFromDirectory(); close()" class="block px-4 py-2 text-sm text-white hover:bg-[#353535] cursor-pointer flex items-center">
                    <fa icon="folder-plus" class="mr-2 w-4"></fa> {{ $t("library.import_songs") }}
                </div>
            </template>
        </Dropdown>

        <Dropdown>
            <template #trigger>
                <div class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#353535] transition-colors cursor-pointer text-white">
                    <fa icon="bars" size="lg"></fa>
                </div>
            </template>
            <template #content="{ close }">
                <div @click="close()" class="block px-4 py-2 text-sm text-white hover:bg-[#353535] cursor-pointer flex items-center">
                    <fa icon="gear" class="mr-2 w-4"></fa> Settings
                </div>
                <div @click="state.showAboutDialog = true; close()" class="block px-4 py-2 text-sm text-white hover:bg-[#353535] cursor-pointer flex items-center">
                    <fa icon="circle-info" class="mr-2 w-4"></fa> About OpenTurntable
                </div>
                <div class="border-t border-gray-600 my-1"></div>
                <div class="px-4 py-2 text-xs text-gray-400">
					<span class="block mb-2">
                    	<b>OpenTurntable</b> v{{ config.public.appVersion }}
					</span>
                    &copy; Michael Webb, 2025<br>
					See all contributors <span class="underline cursor-pointer hover:no-underline transition-all" @click="BrowserOpenURL('https://github.com/ByteOfMelon/OpenTurntable/graphs/contributors')">here</span>
                </div>
            </template>
        </Dropdown>
	</div>
</template>

<script lang="ts" setup>
    const config = useRuntimeConfig();
	const route = useRoute();
    const songs = useSongsStore();

	const state = reactive({
		showAboutDialog: false
	});
</script>

<style scoped>
	.thing {
		transition: all 200ms ease;
	}

	.thing:hover {
		background: #151515;
	}
</style>