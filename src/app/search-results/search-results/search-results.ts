import { Component, inject } from '@angular/core';
import { PlayerService } from '../../services/player-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-results',
  standalone: false,
  templateUrl: './search-results.html',
  styleUrl: './search-results.css'
})
export class SearchResults {
  private state = inject(PlayerService)
  results = this.state.searchResults

  constructor(private router: Router){}

  showAlbum(album: any) {
    this.state.showAlbum(album);
    this.router.navigate([''])
  }

  selectSong(track: any) {
    this.state.selectFromPlaylist(track);
    this.router.navigate([''])
  }

    trackImg(track: any){
    try {
      return track?.album?.images?.[0]?.url || 'CDeezNuts.webp';
    } catch {
      return 'assets/default-track.png';
    }
  }
}
