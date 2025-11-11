import { Injectable, signal } from '@angular/core';
import { Song } from '../interfaces/song';
import { SpotifySearchResponse } from '../interfaces/spotify-api/spotify-search-response';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  defaultSong: Song = {
    cover: "https://picsum.photos/201",
    name: "CANCION 1",
    artist: "ARTISTA 1"
  }
  currentSong = signal<Song>(this.defaultSong)
  displayMode = signal("main")
  searchResults = signal<SpotifySearchResponse>({})
}
