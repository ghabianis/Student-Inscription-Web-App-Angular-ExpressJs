import { Component, OnInit } from '@angular/core';
import { CanvasJS } from 'src/assets/canvasjs.angular.component';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public chart: any;
  students: any = [];
  numberStudents: any = [];

  constructor(private readonly studentService: StudentService) { }

  ngOnInit() {
    this.createChart()
    this.getAllStudents();
    this.getStudentsCount()
  }
  createChart() {
    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      theme: 'light2',
      title: {
        text: 'Data of the month',
      },
      axisX: {
        title: 'Month',
        valueFormatString: 'MMM'
      },
      axisY: {
        title: 'Number of Students',
      },
      data: [
        {
          type: 'column',
          name: 'NbrAbsense',
          showInLegend: true,
          legendText: 'NbrAbsense',
          dataPoints: [
            { x: 1501048673000, y: 35.939 },
            { x: 1501052273000, y: 40.896 },
            { x: 1501055873000, y: 56.625 },
            { x: 1501059473000, y: 26.003 },
            { x: 1501063073000, y: 20.376 },
            { x: 1501066673000, y: 19.774 },
            { x: 1501070273000, y: 23.508 },
            { x: 1501073873000, y: 18.577 },
            { x: 1501077473000, y: 15.918 },
            { x: 1501081073000, y: null }, // Null Data
            { x: 1501084673000, y: 10.314 },
            { x: 1501088273000, y: 10.574 },
            { x: 1501091873000, y: 14.422 },
            { x: 1501095473000, y: 18.576 },
            { x: 1501099073000, y: 22.342 },
            { x: 1501102673000, y: 22.836 },
            { x: 1501106273000, y: 23.220 },
            { x: 1501109873000, y: 23.594 },
            { x: 1501113473000, y: 24.596 },
            { x: 1501117073000, y: 31.947 },
            { x: 1501120673000, y: 31.142 }
          ]
        },
      ],
      exportEnabled: true, // enable export button
      exportFileName: "chart", // set export file name
    });
    // Render the chart
    chart.render();
  }

  getAllStudents(): void {
    this.studentService.getAllStudents().subscribe(
      (response) => {
        console.log(response)
        this.students = response;
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }

  getStudentsCount(): void {
    this.studentService.getStudentsCount().subscribe(
      (response) => {
        console.log(response)
          this.numberStudents = response.data[0]['COUNT(*)'];
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }
}
