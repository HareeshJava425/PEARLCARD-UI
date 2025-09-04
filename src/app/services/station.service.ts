import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http:HttpClient) { 

  }

  getStations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllStations`);
  }


}
