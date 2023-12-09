import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calander',
  templateUrl: './calander.component.html',
  styleUrls: ['./calander.component.css']
})
export class CalanderComponent implements OnInit  {

  formattedDateTime: any;

  constructor() { }

  ngOnInit(): void {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  }
  updateDateTime() {
    const currentDate = new Date();

    // Format the date and time
    this.formattedDateTime = currentDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    });
  }
}
