import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, DeleteRequest, Journey, JourneyRequest } from '../models/journey';



@Injectable({
  providedIn: 'root'
})
export class JourneyService {

  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http:HttpClient) { 

  }

  calculateTotalFare(journeyRequest: JourneyRequest ) : Observable<ApiResponse<any>> {
    //const payload = {journeyRequest};
    // In your Angular service
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      console.log('Sending payload:', JSON.stringify(journeyRequest));

    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/calculateTotalFare`, journeyRequest, {headers});
  }

  deleteJourney(deleteRequest:DeleteRequest): Observable<any> {
    const payload = {
      body:deleteRequest
    }
    return this.http.delete(`${this.apiUrl}/journeys`, payload);
  }


  
}
