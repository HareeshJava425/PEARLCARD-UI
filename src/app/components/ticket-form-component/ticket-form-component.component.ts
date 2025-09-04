import { ChangeDetectorRef, Component, Inject, Input, NgZone, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ApiResponse, Journey } from '../../models/journey';
import {AgGridModule} from 'ag-grid-angular';
import { ClientSideRowModelModule, ColDef, ICellRendererParams, ValidationModule } from 'ag-grid-community';
import {ModuleRegistry, AllCommunityModule} from 'ag-grid-community';
import { JourneyService } from '../../services/journey.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AgGridComponentComponent } from "../ag-grid-component/ag-grid-component.component";
import { StationService } from '../../services/station.service';

// Register the modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule
]);

@Component({
  selector: 'app-ticket-form-component',
  imports: [ReactiveFormsModule, AgGridModule, AgGridComponentComponent,CommonModule],
  templateUrl: './ticket-form-component.component.html',
  styleUrl: './ticket-form-component.component.css'
})
export class TicketFormComponentComponent {
 

  constructor(private fb: FormBuilder, 
    private journeyService: JourneyService,
    private stationService :StationService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object) {
    this.stationForm = this.fb.group({
      fromStation: [''],
      toStation: ['']
    }
    ),
    this.isBrowser = isPlatformBrowser(platformId);
  }

    isBrowser: boolean;
    stationForm: FormGroup | any;

 // coming from form input 
    journeys: Journey[] = [];

    totalFare:number = 0;
    MAX_TICKETS = 20;
    userId:string ="";
    stations: any[] =[];

   
    ngOnInit() {
      this.stationService.getStations().subscribe({
        next: (response:any) => {
          this.stations=response.data;
        },
        error:() => {
          console.error('error gett stations from backend ')
        }
      });
      let storedId = sessionStorage.getItem("userId");

      if(storedId == null || storedId == '') {
          this.userId = "USER123";
      }
      else {
        this.userId = "USER123";
      }
      this.stationForm = this.fb.group({
        fromStation: ['', Validators.required],
        toStation: ['', Validators.required]
      });
      
      
    }
    ngOnChanges(changes: SimpleChanges) {
      if (changes['journeys']) {
        this.journeys = [...this.journeys];
      }
    }
  
    addJourney() {
      if (this.stationForm.invalid) {
        alert('Please select both from and to zones.');
        return;
      }
      if(this.journeys.length >20) {
        alert("Maximum limit reached for the day")
      }
      const formValue = this.stationForm.value;
      const newJourney:Journey = {
        fromStation: formValue.fromStation,
        toStation: formValue.toStation,
        timestamp:'',
        fromZone:0,
        toZone:0,
        journeyId: 0,
        fare:0,
        userId:this.userId
      }

     
      // Add journey to local list (for table display)

      const latestJourney = {
        fromStation: this.stationForm.value.fromStation,
        toStation: this.stationForm.value.toStation
      };

      const flattenedJourneys = this.journeys.flat(); // [][] becomes []
      const updatedJourneys = [...flattenedJourneys, latestJourney];
      const addPayload = {
        userId: this.userId,
        journeys: updatedJourneys// Send only the new journey
      };

     

      if (updatedJourneys.length > this.MAX_TICKETS) {
        alert(`Cannot add tickets! Maximum limit is ${this.MAX_TICKETS} tickets. You're trying to add ${updatedJourneys.length} tickets.`);
        return;
      }
  
      this.journeyService.calculateTotalFare(addPayload).subscribe({
        next: (response: ApiResponse<any>) => {
          console.log('API response received successfully.', response);
          // The crucial line that updates the data bound to the child component
         // this.journeys = [...response.data.journeys];
          this.ngZone.run(() => {
            this.journeys = [...response.data.journeys];
          });
          console.log('Journeys array updated:', this.journeys);
          this.totalFare = response.data.totalFare;
          this.stationForm.reset({ fromStation: '', toStation: '' });
        },
        error: (error:any) => {
          console.error('Error in API response:', error);
          alert('An error occurred while calculating the fare. Please try again.');
        }
      });
    }


  handleTotalFare(fare:number) {
    this.totalFare = fare;
    console.log('total fare received from child ag grid component ',fare);
    this.cdr.detectChanges();
    this.ngZone.run(() => {
      this.totalFare = fare;
    })
  }
  onJourneysChange(updatedJourneys: Journey[]) {
    console.log('Parent received updated journeys:', updatedJourneys);
    this.journeys = updatedJourneys;
    this.cdr.detectChanges();
  }


}
