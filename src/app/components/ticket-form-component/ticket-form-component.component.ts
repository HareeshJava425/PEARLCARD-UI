import { ChangeDetectorRef, Component, Inject, Input, NgZone, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ApiResponse, Journey, JourneyResponse } from '../../models/journey';
import {AgGridModule} from 'ag-grid-angular';
import { ClientSideRowModelModule, ColDef, ICellRendererParams, ValidationModule } from 'ag-grid-community';
import {ModuleRegistry, AllCommunityModule} from 'ag-grid-community';
import { JourneyService } from '../../services/journey.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AgGridComponentComponent } from "../ag-grid-component/ag-grid-component.component";

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
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object) {
    this.zoneForm = this.fb.group({
      fromZone: [''],
      toZone: ['']
    }
    ),
    this.isBrowser = isPlatformBrowser(platformId);
  }

    zones = [
    { label: 'Zone 1', value: "1" },
    { label: 'Zone 2', value: "2" },
    { label: 'Zone 3', value: "3" }
    ];

    isBrowser: boolean;
    zoneForm: FormGroup | any;
 // coming from form input 
    journeys: Journey[] = [];
    totalFare:number = 0;
    MAX_TICKETS = 20;

   
    ngOnInit() {
      this.zoneForm = this.fb.group({
        fromZone: ['', Validators.required],
        toZone: ['', Validators.required]
      });
    }
    ngOnChanges(changes: SimpleChanges) {
      if (changes['journeys']) {
       // console.log("Child received new journeys:", changes['journeys'].currentValue);
        this.journeys = [...this.journeys];
        //console.log('row data after assigning in ngonChanges', this.journeys)
        //this.initColumnDefs();
      }
    }
  
    // Helper method to get label by value
    getZoneLabel(value: string): string {
      const zone = this.zones.find(z => z.value === value);
      return zone ? zone.label : '';
    }

    canAddMoreTickets(): boolean {
      return this.journeys.length < this.MAX_TICKETS;
    }


    addJourney() {
      if (this.zoneForm.invalid) {
        alert('Please select both from and to zones.');
        return;
      }
      if(this.journeys.length >20) {
        alert("Maximum limit reached for the day")
      }
      const formValue = this.zoneForm.value;
      const newJourney:Journey = {
        fromZone: formValue.fromZone,
        toZone: formValue.toZone,
        fare: formValue.fare,
        id: 0
      }
      // Add journey to local list (for table display)
      const updatedJourneys = [...this.journeys,newJourney];

      if (updatedJourneys.length > this.MAX_TICKETS) {
        alert(`Cannot add tickets! Maximum limit is ${this.MAX_TICKETS} tickets. You're trying to add ${updatedJourneys.length} tickets.`);
        return;
      }
  
      this.journeyService.calculateTotalFare(updatedJourneys).subscribe({
        next: (response: ApiResponse<any>) => {
          console.log('API response received successfully.', response);
          // The crucial line that updates the data bound to the child component
          this.journeys = response.data.journeyDetails;
          console.log('Journeys array updated:', this.journeys);
          this.totalFare = response.data.totalFare;
          this.zoneForm.reset({ fromZone: '', toZone: '' });
        },
        error: (error:any) => {
          console.error('Error in API response:', error);
          alert('An error occurred while calculating the fare. Please try again.');
        }
      });
    }


  zoneFormatter(params: any) {
    const zone = this.zones.find(z => z.value === params.value);
    return zone ? zone.label : '';
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
