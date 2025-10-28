import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { CookieStorageService } from '../cookie-storage-service';

export interface SpotifyTokenResponse {
  access_token: string,
  token_type: string,
  expires_in: number
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN = 'spotify_acces_token';
  private readonly EXPIRES = 'spotify-token-expiry'

  constructor( private http: HttpClient, private cookieService: CookieStorageService){}

  isTokenExpired(){
    const expired = this.cookieService.getCookieValue(this.EXPIRES)
    if (!expired) return true;
    return new Date().getTime() > parseInt(expired)
  }

  clearToken(){
    this.cookieService.deleteCookie(this.TOKEN)
    this.cookieService.deleteCookie(this.EXPIRES)
  }

  getToken(){
    if (this.isTokenExpired()){
      this.clearToken()
      return null
    }
    return this.cookieService.getCookieValue(this.TOKEN)
  }

  private storeToken(response: SpotifyTokenResponse){
    const expireTime = new Date().getTime() + response.expires_in * 1000
    this.cookieService.createCookie(this.TOKEN, response.access_token)
    this.cookieService.createCookie(this.EXPIRES, expireTime.toString())
  }

  requestToken(): Observable<string> {
    const credentials = btoa(`${environment.CLIENT_ID}:${environment.CLIENT_SECRET}`)
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Basic ${credentials}`)
    
    const body = 'grant-type=client_credentials'

    return this.http.post<SpotifyTokenResponse>(
      environment.AUTH_API_URL,
      body, { headers }
    ).pipe(
      tap(response => this.storeToken(response)),
      map(response => response.access_token),
      catchError(e => {
        console.error(`Error al conseguir el token: ${e}`)
        return throwError(() => e)
      })
    )
  }
}
