import { Injectable, signal } from '@angular/core';
import { Song } from '../interfaces/song';
import { SpotifySearchResponse } from '../interfaces/spotify-api/spotify-search-response';
import { SpotifyAlbumService } from './spotify-api/spotify-album-service';

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
  playlist = signal<Song[]>([])
  searchResults = signal<SpotifySearchResponse>({})
  albumCover = signal<string | null>(null)

  constructor(private albumServ: SpotifyAlbumService) {}

  selectFromPlaylist(item: Song) {
    console.log('Seleccionando canción:', item);
    this.currentSong.set(item);
  }

  showAlbum(album: any): void {
    if (!album || !album.id) return;
    console.log('Cargando canciones del álbum:', album.name, album.id);

    this.albumCover.set(album.images?.[0]?.url ?? 'CDeezNuts.webp');
    this.albumServ.getAlbumSongs(album.id).subscribe({
      next: (response) => {
        const items = response.tracks?.items || [];
        const mapped: Song[] = items.map((t: any) => ({
          cover: this.albumCover() ?? 'CDeezNuts.webp',
          artist: t?.artists?.[0]?.name || 'Artista desconocido',
          name: t?.name || 'Desconocido'
        }));

        this.playlist.set(mapped);
        if (mapped.length) {
          this.currentSong.set(mapped[0]);
        }
      },
      error: (e) => console.error('Error al obtener canciones del álbum:', e)
    });
  }
}
