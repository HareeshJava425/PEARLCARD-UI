import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Journey, JourneyResponse } from '../models/journey';



@Injectable({
  providedIn: 'root'
})
export class JourneyService {

  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http:HttpClient) { 


  }

  calculateTotalFare(journeys: Journey[] ) : Observable<ApiResponse<JourneyResponse>> {
    const payload = {journeys};
    return this.http.post<ApiResponse<JourneyResponse>>(`${this.apiUrl}/calculateTotalFare`, payload);
  }


  deleteJourney(id:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/journeys/${id}`);
  }
}
