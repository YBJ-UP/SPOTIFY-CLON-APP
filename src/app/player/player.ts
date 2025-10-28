import { Component } from '@angular/core';
import { Song } from '../interfaces/song';
import { SpotifyPlaylistService } from '../services/spotify-api/spotify-playlist-service';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player {

  constructor(public playlista: SpotifyPlaylistService){
    this.playlista.getPlaylist().subscribe(data => {
      console.log(data)
    })
    console.log("COMPONENTE APP CREADO")
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
