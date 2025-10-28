import { Component, OnInit, signal } from '@angular/core';
import { SpotifyLoginService } from './services/spotify-api/spotify-login-service';
import { SpotifyPlaylistService } from './services/spotify-api/spotify-playlist-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('EXAMPLE_APP');

  constructor(
    private _spotifyLoginService: SpotifyLoginService,
    private _spotifyPlaylistService: SpotifyPlaylistService
  ) {}


  ngOnInit(): void {
    console.log("ESTE ES UN LOG DE CONTROL")
    this._spotifyLoginService.getToken().subscribe({
      next: (response) => {
        console.log("Token obtenido correctamente")
      },
      error: (e) => { console.log(`Error al obtener token: ${e}`) }
    });
  }

  doRequest(){
    this._spotifyPlaylistService.getPlaylist().subscribe((data)=>console.log(data));
  }

}
