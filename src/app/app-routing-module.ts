import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongInfo } from './song-info/song-info';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: SongInfo }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
