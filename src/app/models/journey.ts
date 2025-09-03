export interface Journey {
    id: number;
    fromZone: string;
    toZone: string;
    fare: number;
  }
  
  export interface JourneyResponse {
    journeyDetails: Journey[];
    totalFare: number;
  }
  
  export interface JourneyRequest {
    journeys: Journey[];
  }
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: JourneyResponse;
    timestamp:string;
  }
  