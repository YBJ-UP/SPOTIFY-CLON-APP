import { Component, computed, inject, input } from '@angular/core';
import { Song } from '../interfaces/song';
import { PlayerService } from '../services/player-service';

@Component({
  selector: 'app-song-info',
  standalone: false,
  templateUrl: './song-info.html',
  styleUrl: './song-info.css',
  host:{
    '[class]': 'displayMode()',
  }
})
export class SongInfo{
  private state = inject(PlayerService)
  
  display_mode = input<string | null>();
  song = input<Song | null>();

  currentSong = computed(() => this.song() ?? this.state.currentSong())
  currentDisplay = computed(() => this.display_mode() ?? this.state.displayMode())

  displayMode(){
    return this.currentDisplay()
  }
}
