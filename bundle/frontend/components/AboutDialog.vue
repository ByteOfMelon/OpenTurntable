<template>
	<Teleport to="body">
		<div class="fixed inset-0 flex items-center justify-center bg-black/70 z-[1000]" @click="$emit('close')">
			<div class="bg-[#252525] p-6 rounded-lg shadow-lg w-128 max-w-128 z-[1000]" @click.stop>
                <div class="flex flex-row items-start mb-4">
                    <img src="@/assets/img/wordmark.png" class="w-2/3" alt="OpenTurntable logo" />
                    <div class="flex-grow"></div>
                    <fa icon="x" @click="emit('close')" class="cursor-pointer"></fa>
                </div>
                <div class="flex flex-col">
                    <span>{{ $t('about.version', { version: config.public.appVersion }) }}</span>
                    <div class="border-t border-gray-600 my-4"></div>
                    <span>&copy; Michael Webb, 2025. All rights reserved.</span>
                    <span class="mt-1">Made with ❤️ by Michael Webb and <span class="underline cursor-pointer hover:no-underline transition-all" @click="BrowserOpenURL('https://github.com/ByteOfMelon/OpenTurntable/graphs/contributors')">open source contributors</span></span>
                </div>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
const config = useRuntimeConfig();
const emit = defineEmits(['close']);
</script>