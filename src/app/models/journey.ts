export interface Journey {
  journeyId: number;
  fromZone: number;
  toZone: number;
  fromStation: string;
  toStation: string;
  userId: string;
  fare: number;
  timestamp: string;
}
  
export interface JourneyRequest {
  userId: string;
  journeys: JourneyRequestItem[];
}

export interface JourneyRequestItem {
  fromStation: string;
  toStation: string;
}
  export interface DeleteRequest {
    userId: string;
    journeyId:number;
  }
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    timestamp: string;
    data: FareCalculationResponse;
    errors: any | null;
  }

  export interface FareCalculationResponse {
    journeys: Journey[];
    totalFare: number;
    totalJourneys: number;
  }
  