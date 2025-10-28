import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { TokenResponse } from '../../interfaces/api/token-response';
import { CookieStorageService } from '../cookie-storage-service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyLoginService {

  constructor(
    private _http:HttpClient,
    private _cookieService: CookieStorageService
  ) {  }

  getToken(): Observable<TokenResponse> {
    const body = new HttpParams().set('grant_type', 'client_credentials')
    const basic = btoa(`${environment.CLIENT_ID}:${environment.CLIENT_SECRET}`)

    return this._http.post<TokenResponse>(
      environment.AUTH_API_URL, 
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basic}`
        }
      }
    ).pipe(
      tap(response => {
        this._cookieService.createCookie('access-token', response.access_token)
        const expireTime = Date.now() + response.expires_in * 1000
        this._cookieService.createCookie('token_expiry', expireTime.toString())
      }),
      catchError(e => {
        console.error(`Error al obtener token: ${e}`)
        return throwError(() => e)
      })
    )

  }
}
