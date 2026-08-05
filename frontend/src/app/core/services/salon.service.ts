import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service, Stylist } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SalonService {
  private http = inject(HttpClient);
  private apiUrl = 'https://salon-backend-kxh1.onrender.com/api';

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/services`);
  }

  getStylists(): Observable<Stylist[]> {
    return this.http.get<Stylist[]>(`${this.apiUrl}/stylists`);
  }
}
