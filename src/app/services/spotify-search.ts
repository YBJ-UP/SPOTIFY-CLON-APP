import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retryWhen, delay, take, tap, switchMap } from 'rxjs';
import { environment } from '../../environments/environment.development'; 
import { SpotifySearchResponse } from '../interfaces/spotify-api/spotify-search-response';
import { TokenService } from './auth/token.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifySearch {
  private baseUrl = environment.URL_API;
  private maxAttempts = 3;

  constructor(private http: HttpClient, private tokenServ: TokenService) { }

  search(query: string, types: string[] = ['track', 'artist', 'album']): Observable<SpotifySearchResponse> {
   
    if (!query) {
      console.log("Petición vacía.")
      return of({} as SpotifySearchResponse); 
    }
    
    if (!this.tokenServ.getToken() || this.tokenServ.isTokenExpired()){
      console.log("Token inválido o expirado")
      return this.tokenServ.requestToken().pipe(
          tap(() => console.log('Se obtuvo el token nuevo correctamente')),
          switchMap(() => this.performSearch(query, types)),
          catchError(e => {
            console.error(`Error al obtener nuevo token: ${e}`);
            return throwError(() => new Error('Error al obtener el token'));
          })
        );
    }else{
      return this.performSearch(query, types)
    }
  }

  private performSearch(query:string, types:string[]): Observable<SpotifySearchResponse> {
    let params = new HttpParams()
        .set('q', query) 
        .set('type', types.join(',')) 
        .set('limit', '10'); 
    const url = `${this.baseUrl}/search`;

    return this.http.get<SpotifySearchResponse>(url, { params: params }).pipe(
      tap(response => {
        console.log('Respuesta de búsqueda recibida:', {
          tracks: response.tracks?.items?.length || 0,
          artists: response.artists?.items?.length || 0,
          albums: response.albums?.items?.length || 0
        });
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la búsqueda:', error);
        
        if (error.status === 401) {
          console.log('Error de autorización, intentando renovar token...');
            return this.tokenServ.requestToken().pipe(
              tap(() => console.log('Token renovado, reintentando búsqueda')),
              switchMap(() => this.performSearch(query, types)),
              catchError(tokenError => {
                console.error('Error al renovar token:', tokenError);
                return throwError(() => tokenError);
              })
            );
        }
        
        return throwError(() => error);
      }),
      retryWhen(errors => 
        errors.pipe(
          delay(1000),
          take(this.maxAttempts),
          tap(retryCount => console.log(`Reintento ${retryCount + 1}/${this.maxAttempts}`))
        )
      )
    );
  }
}
