import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TicketFormComponentComponent } from "./components/ticket-form-component/ticket-form-component.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TicketFormComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  userId:string = '';
  ngOnInit(): void {

    let storedId = sessionStorage.getItem('userId');
   
    if (!storedId) {
      this.userId = crypto.randomUUID();
      sessionStorage.setItem('userId', this.userId);
    } else {
      this.userId = storedId;
    }
  }
  title = 'PearlCard-UI';

  
}
