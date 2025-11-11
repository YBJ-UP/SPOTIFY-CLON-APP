import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongInfo } from './song-info/song-info';
import { SearchResults } from './search-results/search-results/search-results';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: SongInfo },
  { path: 'search', component: SearchResults }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
