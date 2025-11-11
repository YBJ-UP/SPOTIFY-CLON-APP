import { Component, signal } from '@angular/core';
import { Song } from '../interfaces/song';
import { SpotifyAlbumService } from '../services/spotify-api/spotify-album-service';
import { SpotifySearchResponse } from '../interfaces/spotify-api/spotify-search-response';
import { debounceTime, Subject } from 'rxjs';
import { SpotifySearch } from '../services/spotify-search';
import { PlayerService } from '../services/player-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player {
  private searchSubject = new Subject<string>()
  protected selectedAlbums: any = null
  private previousPlaylist: Song[] | null = null
  protected albumCover: any = null;

  constructor(
    private search: SpotifySearch,
    private albumServ: SpotifyAlbumService,
    protected state: PlayerService,
    private router: Router
  ){
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
    this.state.showAlbum(album)
  }

  restorePlaylist(){
    if (this.previousPlaylist){
      this.playlist = [...this.previousPlaylist]
      this.previousPlaylist = null
    }
    this.selectedAlbums = null
    this.state.searchResults.set({})
  }

  selectFromPlaylist(item: Song){
    this.state.selectFromPlaylist(item)
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement
    const query = input.value
    console.log(`Término de búsqueda: ${query}`)
    this.searchSubject.next(query)
  }

  private performSearch(query: string){
    
    if (query.trim()){ this.router.navigate(["search"]) } else { this.router.navigate(['']) }

    this.search.search(query, ['track', 'artist', 'album']).subscribe({
      next: (output) => {
        console.log("Datos encontrados:", {
          songs: output.tracks?.items?.length || 0,
          artists: output.artists?.items?.length || 0,
          albums: output.albums?.items?.length || 0
        })
        this.state.searchResults.set(output)
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
