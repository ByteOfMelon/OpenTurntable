import { defineStore } from "pinia";
import { ChooseAndCreateSong, GetSongs, ImportSongsFromDirectory, GetSongsWithDetails, GetPlaylistWithSongs, GetPlaylists, CreatePlaylist, AddSongsToPlaylist } from "~/wailsjs/go/main/App";
import { database } from '~/wailsjs/go/models';

export const usePlaylistsStore = defineStore("playlists", {
    state: () => ({
        playlists: [] as database.Playlist[],
        currentPlaylist: null as database.PlaylistWithSongs | null
    }),
    actions: {
        async loadPlaylists() {
            try {
                const playlists = await GetPlaylists();
                this.playlists = playlists || [];
            } catch (err) {
                console.error(err);
                this.playlists = [];
            }
        },

        async getPlaylist(playlist_id: number) {
            try {
                this.currentPlaylist = await GetPlaylistWithSongs(playlist_id);
            } catch (err) {
                console.error(err);
            }
        },

        async createPlaylist(name: string, description: string, picture: string) {
            try {
                let playlist = {
                    ID: -1,
                    Name: name,
                    Description: description,
                    Picture: picture
                }

                let playlist_id = await CreatePlaylist(playlist);
                playlist.ID = playlist_id;
                
                this.playlists.push(playlist);
            } catch (err) {
                console.error(err);
            }
        },

        async addSongsToPlaylist(playlistID: number, songIDs: number[]) {
            try {
                await AddSongsToPlaylist(playlistID, songIDs);
                // Refresh current playlist if it's the one we modified
                if (this.currentPlaylist && this.currentPlaylist.Playlist.ID === playlistID) {
                    await this.getPlaylist(playlistID);
                }
            } catch (err) {
                console.error(err);
            }
        }
    }
})