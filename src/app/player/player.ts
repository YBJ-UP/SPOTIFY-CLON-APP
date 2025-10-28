import { Component, signal } from '@angular/core';
import { Song } from '../interfaces/song';
import { SpotifyAlbumService } from '../services/spotify-api/spotify-album-service';
import { SpotifySearchResponse } from '../interfaces/spotify-api/spotify-search-response';
import { debounceTime, Subject } from 'rxjs';
import { SpotifySearch } from '../services/spotify-search';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player {
  private searchSubject = new Subject<string>()
  protected searchResults = signal<SpotifySearchResponse>({})
  protected selectedAlbums: any = null
  private previousPlaylist: Song[] | null = null

  constructor(private search: SpotifySearch, private albumServ: SpotifyAlbumService){
    console.log("COMPONENTE APP CREADO")

    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe({
      next: query => {
        console.log('Ejecutando búsqueda para:', query);
        this.performSearch(query);
      },
      error: error => {
        console.error('Error en el observable de búsqueda:', error);
      }
    });
  }

  showAlbum(album: any): void {
    if (!album || !album.id) return;
    console.log('Cargando canciones del álbum:', album.name, album.id);
    this.albumServ.getAlbumSongs(album.id).subscribe({
      next: (response) => {
        const items = response.tracks?.items || [];
        console.log(`Pistas recibidas: ${items.length}`);
        console.log(items)

        const mapped: Song[] = items.map((t: any) => ({
          cover: t?.album?.images?.[0]?.url || 'CDeezNuts.webp',
          artist: t?.artists?.[0]?.name || 'Artista desconocido',
          name: t?.name || 'Desconocido'
        }));

        this.previousPlaylist = Array.isArray(this.playlist) ? [...this.playlist] : null;

        this.playlist = mapped;

        this.selectedAlbums = album;

        if (mapped.length) {
          this.song = {
            cover: mapped[0].cover,
            name: mapped[0].name,
            artist: mapped[0].artist
          };
        }
      },
      error: (e) => {
        console.error('Error al obtener canciones del álbum:', e);
      }
    });
  }

  restorePlaylist(){
    if (this.previousPlaylist){
      this.playlist = [...this.previousPlaylist]
      this.previousPlaylist = null
    }
    this.selectedAlbums = null
    this.searchResults.set({})
  }

  selectFromPlaylist(item: Song){
    console.log(item)
    this.song = { cover: item.cover, artist: item.artist, name: item.name }
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement
    const query = input.value
    console.log(`Término de búsqueda: ${query}`)
    this.searchSubject.next(query)
  }

  private performSearch(query: string){
    this.search.search(query, ['track', 'artist', 'album']).subscribe({
      next: (output) => {
        console.log("Datos encontrados:", {
          songs: output.tracks?.items?.length || 0,
          artists: output.artists?.items?.length || 0,
          albums: output.albums?.items?.length || 0
        })
        this.searchResults.set(output)
      }
    })
  }

  trackImg(track: any){
    try {
      return track?.album?.images?.[0]?.url || 'CDeezNuts.webp';
    } catch {
      return 'assets/default-track.png';
    }
  }

  song = {
    cover: "https://picsum.photos/200",
    name: "CANCION 1",
    artist: "ARTISTA 1"
  }

  playlist: Song[] = [
    {
      cover: "https://picsum.photos/201",
      name: "CANCION 1",
      artist: "ARTISTA 1"
    },
    {
      cover: "https://picsum.photos/202",
      name: "CANCION 2",
      artist: "ARTISTA 1"
    },
    {
      cover: "https://picsum.photos/203",
      name: "CANCION 3",
      artist: "ARTISTA 1"
    },
    {
      cover: "https://picsum.photos/204",
      name: "CANCION 4",
      artist: "ARTISTA 1"
    },
    {
      cover: "https://picsum.photos/205",
      name: "CANCION 5",
      artist: "ARTISTA 1"
    },
    {
      cover: "https://picsum.photos/206",
      name: "CANCION 6",
      artist: "ARTISTA 1"
    },
    {
      cover: "https://picsum.photos/207",
      name: "CANCION 7",
      artist: "ARTISTA 1"
    },
    {
      cover: "https://picsum.photos/208",
      name: "CANCION 8",
      artist: "ARTISTA 1"
    },
  ];


}
