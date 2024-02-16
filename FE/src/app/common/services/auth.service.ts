import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly httpClient: HttpClient) {}

  login(body: { username: string; password: string }) {
    return this.httpClient.post(`${environment.host}/auth/login`, body);
  }

  logout() {
    return this.httpClient.get(`${environment.host}/auth/logout`);
  }

  validateToken() {
    return this.httpClient.get(`${environment.host}/auth/validate`, {
      responseType: 'text',
    });
  }
}
