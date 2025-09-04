import { Component, Input, Output , EventEmitter, SimpleChanges, PLATFORM_ID, Inject, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, NgZone} from '@angular/core';
import {AgGridModule} from 'ag-grid-angular';
import { ApiResponse, DeleteRequest, FareCalculationResponse, Journey } from '../../models/journey';
import { ColDef, GetRowIdParams, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { JourneyService } from '../../services/journey.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-ag-grid-component',
  imports: [AgGridModule,CommonModule],
  templateUrl: './ag-grid-component.component.html',
  styleUrl: './ag-grid-component.component.css'
})
export class AgGridComponentComponent {

  @ViewChild('gridContainer', { static: false }) gridContainer!: ElementRef;
  isBrowser: boolean;
  gridApi!: GridApi;

  @Input() journeys: Journey[] = [];
  @Output() totalFare = new EventEmitter<number>();
  @Output() journeysChange = new EventEmitter<Journey[]>();



  //gridData: Journey[] = [];


   constructor(private journeyService:JourneyService,
    private cdr:ChangeDetectorRef,
    private ngZone:NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
   ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

  }
  async ngOnInit() {
   
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    console.log('Grid API ready, setting initial data');
    
    // Set initial data when grid is ready
    if (this.journeys.length > 0) {
      this.gridApi.setGridOption('rowData', this.journeys);
    }
  }

  //@Input() colDefs:ColDef[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['journeys'] && changes['journeys'].currentValue) {
      console.log("Child received new journeys:", changes['journeys'].currentValue);
      
      // Update local grid data
      this.journeys = [...changes['journeys'].currentValue];
      
      // Update grid if API is available
      if (this.gridApi) {
        console.log('Updating grid with new data:', this.journeys);
        this.gridApi.setGridOption('rowData', this.journeys);
      }
      
      console.log('Grid data updated:', this.journeys);
    }
  }


  //  columnDefs:ColDef<Journey>[] = [
  //         {
  //           headerName: 'No',
  //           field: 'id',
  //           filter: 'agNumberColumnFilter'
  //         },
  //         {
  //           headerName: 'From',
  //           field: 'fromZone',
  //           valueFormatter: (params) => this.zoneFormatter(params),
  //           filter: 'agTextColumnFilter',
  //         },
  //         {
  //           headerName: 'To',
  //           field: 'toZone',
  //           valueFormatter: (params) => this.zoneFormatter(params),
  //           filter: 'agTextColumnFilter',
  //         },
  //         {
  //           headerName: 'Fare',
  //           field: 'fare',
  //           filter: 'agNumberColumnFilter'
  //         },
  //         {
  //           headerName: 'Actions',
  //           cellRenderer: (params: ICellRendererParams) => {
  //             const button = document.createElement('button');
  //             button.innerText = 'Delete';
  //             button.style.backgroundColor = 'red';
  //             button.style.color = 'white';
  //             button.style.border = 'none';
  //             button.style.padding = '5px 10px';
  //             button.style.cursor = 'pointer';
  //             button.style.borderRadius = '4px';
  //             button.addEventListener('click', () => {
  //               event?.stopPropagation();
  //               if (params.data && params.data.id !== undefined) {
  //                this.onDeleteJourney(params.data.id);
  //               }
  //             }); 
  //             return button;
  //           },
  //           width: 100,
  //           sortable:false,
  //           filter:false

  //         }
  //       ];


        columnDefs: ColDef<Journey>[] = [
          {
            headerName: 'No',
            field: 'journeyId',
            width: 80,
            pinned: 'left',
            cellStyle: { 
              fontWeight: '600',
              color: '#0ea5e9',
              textAlign: 'center'
            }
          },
          {
            headerName: 'Departure',
            field: 'fromStation',
            flex: 1,
            minWidth: 120,
           // valueFormatter: (params) => this.zoneFormatter(params),
            cellStyle: { fontWeight: '500' }
          },
          {
            headerName: 'Arrival',
            field: 'toStation',
            flex: 1,
            minWidth: 120,
            //valueFormatter: (params) => this.zoneFormatter(params),
            cellStyle: { fontWeight: '500' }
          },
          {
            headerName: 'Zone(From)',
            field: 'fromZone',
            flex: 1,
            minWidth: 120,
           // valueFormatter: (params) => this.zoneFormatter(params),
            cellStyle: { fontWeight: '500' }
          },
          {
            headerName: 'Zone(To)',
            field: 'toZone',
            flex: 1,
            minWidth: 120,
            //valueFormatter: (params) => this.zoneFormatter(params),
            cellStyle: { fontWeight: '500' }
          },
          {
            headerName: 'Fare',
            field: 'fare',
            width: 100,
            type: 'numericColumn',
            valueFormatter: (params) => params.value ? `$${params.value}` : '$0',
            cellStyle: { 
              fontWeight: '600',
              color: '#059669'
            }
          },
          {
            headerName: 'Actions',
            width: 100,
            pinned: 'right',
            sortable: false,
            filter: false,
            cellRenderer: (params: ICellRendererParams) => {
              const button = document.createElement('button');
              button.innerText = 'Delete';
              button.className = 'delete-button';
              button.style.cssText = `
                background: #ef4444;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: background 0.2s;
              `;
              
              button.addEventListener('mouseover', () => {
                button.style.background = '#dc2626';
              });
              
              button.addEventListener('mouseout', () => {
                button.style.background = '#ef4444';
              });
              
              button.addEventListener('click', (event) => {
                event.stopPropagation();
                if (params.data && params.data.journeyId !== undefined) {
                  console.log("params.data.id", params.data.journeyId);
                  this.onDeleteJourney(params.data.journeyId);
                }
              });
              
              return button;
            }
          }
        ];

        defaultColDef = {
          sortable: true,
          filter: true,
          resizable: true
        };
        getRowId = (params: GetRowIdParams) => {
          console.log("params.data.id", params.data.journeyId);
          return params.data.journeyId;
        };
        gridOptions = {
          animateRows: true, // Smooth animations for row operations
          getRowId: this.getRowId,
          defaultColDef: this.defaultColDef,
          suppressMenuHide: true,
          onGridReady: (params: GridReadyEvent) => this.onGridReady(params)
        };

        onDeleteJourney(journeyId: number) {
          if (!this.isBrowser) {
            console.warn('Cannot access sessionStorage in SSR');
            return;
          }
          
          const userId: string | null = sessionStorage.getItem("userId");
          if (userId) { // This check ensures userId is not null
            const deleteRequest: DeleteRequest = {
              userId: "USER123", // Now TypeScript knows userId is a string
              journeyId: journeyId
            };
            // Send the request
          this.journeyService.deleteJourney(deleteRequest).subscribe({
            next: (response: ApiResponse<FareCalculationResponse>) => {

              if(response.success) {
              const journeyToDeleteFromGrid = this.journeys.find(j => j.journeyId === journeyId);
              if (journeyToDeleteFromGrid) {
                // Remove from AG Grid
                this.gridApi.applyTransaction({ remove: [journeyToDeleteFromGrid] });
                console.log('Grid data after delete:', this.journeys);
                //console.log('Journeys after delete:', this.journeys);
                const newTotal = this.journeys.reduce((sum, j) => sum + (j.fare || 0), 0);
               // this.totalFare.emit(newTotal);
                console.log('New total fare:', newTotal);
                console.log('Delete operation completed successfully');
                this.ngZone.run(() => {
                  this.journeysChange.emit([...response.data.journeys]);
                  this.totalFare.emit(response.data.totalFare);
                });
              }
            }
          },
            error: (error) => {
              console.error(' Delete HTTP error:', error);
              let errorMessage = 'Failed to delete journey. Please try again.';
              
              if (error.status === 404) {
                errorMessage = 'Journey not found.';
              } else if (error.status === 500) {
                errorMessage = 'Server error. Please try again later.';
              } else if (error.error?.message) {
                errorMessage = error.error.message;
              }
              
              alert(errorMessage);
            }
          });
        } else {
          // Handle the case where userId is null
          console.error("User ID is missing, cannot perform deletion.");
          alert(' User ID is missing , cannot delete ');
        }

         
        }
 

}
