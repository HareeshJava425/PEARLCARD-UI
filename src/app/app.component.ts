import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup , ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { JourneyService } from './services/journey.service';
import { Journey, JourneyResponse } from './models/journey';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ChangeDetectorRef } from '@angular/core';
import { TicketFormComponentComponent } from "./components/ticket-form-component/ticket-form-component.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TicketFormComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PearlCard-UI';

  
}
