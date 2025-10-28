import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { SpotifySearchResponse } from '../../interfaces/spotify-api/spotify-search-response';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAlbumService {
  constructor(private http: HttpClient){}

  getAlbumSongs(albumId: string): Observable<SpotifySearchResponse>{
    const url = `${environment.URL_API}/albums/${albumId}/tracks`
    return this.http.get<any>(url).pipe(
      map((response) => {
        return {
          tracks: {
            href: response.href,
            items: response.items,
            limit: response.limit || response.items.length,
            next: response.next || null,
            offset: response.offset || 0,
            previous: response.previous || null,
            total: response.total || response.items.length
          }
        } as SpotifySearchResponse
      })
    )
  }
}
