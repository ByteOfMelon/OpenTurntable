import { defineStore } from "pinia";
import { ChooseAndCreateSong, GetSongs, ImportSongsFromDirectory, GetSongsWithDetails, GetPlaylistWithSongs, GetPlaylists, CreatePlaylist, AddSongsToPlaylist } from "~/wailsjs/go/main/App";
import { database } from '~/wailsjs/go/models';

export const usePlaylistsStore = defineStore("playlists", {
    state: () => ({
        playlists: [] as database.Playlist[],
        currentPlaylist: null as database.PlaylistWithSongs | null,
        arrangement: {
            key: "list_order",
            asc: true
        }
    }),
    actions: {
        async ascOrReset() {
            if (this.arrangement.asc) {
                this.arrangement.asc = false;
            } else {
                this.arrangement.key = "list_order";
                this.arrangement.asc = true;
            }
        },

        async rearrangePlaylist(by: string) {
            if (!this.currentPlaylist || !this.currentPlaylist.Entries) return;

            switch (by) {
                case "title":
                    if (this.arrangement.key === "title") {
                        await this.ascOrReset();
                    } else {
                        this.arrangement.key = "title";
                        this.arrangement.asc = true;
                    }
                    break;
                case "artist":
                    if (this.arrangement.key === "artist") {
                        await this.ascOrReset();
                    } else {
                        this.arrangement.key = "artist";
                        this.arrangement.asc = true;
                    }
                    break;
                case "album":
                    if (this.arrangement.key === "album") {
                        await this.ascOrReset();
                    } else {
                        this.arrangement.key = "album";
                        this.arrangement.asc = true;
                    }
                    break;
                case "duration":
                    if (this.arrangement.key === "duration") {
                        await this.ascOrReset();
                    } else {
                        this.arrangement.key = "duration";
                        this.arrangement.asc = true;
                    }
                    break;
                case "list_order":
                    this.arrangement.key = "list_order";
                    this.arrangement.asc = !this.arrangement.asc;
                    break;
                default:
                    this.arrangement.key = "list_order";
                    this.arrangement.asc = true;
                    break;
            }

            switch (this.arrangement.key) {
                case "title":
                    this.currentPlaylist.Entries.sort((a, b) => (this.arrangement.asc ? 1 : -1) * a.Song.Title.localeCompare(b.Song.Title));
                    break;
                case "artist":
                    this.currentPlaylist.Entries.sort((a, b) => (this.arrangement.asc ? 1 : -1) * a.Song.ArtistName.String.localeCompare(b.Song.ArtistName.String));
                    break;
                case "album":
                    this.currentPlaylist.Entries.sort((a, b) => (this.arrangement.asc ? 1 : -1) * a.Song.AlbumName.String.localeCompare(b.Song.AlbumName.String));
                    break;
                case "duration":
                    this.currentPlaylist.Entries.sort((a, b) => (this.arrangement.asc ? 1 : -1) * (a.Song.Duration > b.Song.Duration ? 1 : -1));
                    break;
                case "list_order":
                    this.currentPlaylist.Entries.sort((a, b) => (this.arrangement.asc ? 1 : -1) * (a.ListOrder > b.ListOrder ? 1 : -1));
                    break;
            }
        },

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