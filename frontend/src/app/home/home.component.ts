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
  fullName:any
  AbsencesCount:any

  constructor(private readonly studentService: StudentService) { }

  ngOnInit() {
    this.createChart(this.AbsencesCount, this.AbsencesCount)
    this.getAllStudents();
    this.getStudentsCount()
    this.getAbsencesCount()
    this.user()
  }
  createChart(absence:any , Presnece:any) {
    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      theme: 'light2',
      title: {
        text: 'Data of the month',
      },
      axisX: {
        title: 'Day',
        valueFormatString: 'DD'
      },
      axisY: {
        title: 'Number of Students',
      },
      data: [
        {
          type: 'column',
          name: 'Number of Absences',
          showInLegend: true,
          legendText: 'Number of Absences',
          dataPoints: [
            { x: new Date() , y: absence}
          ]
        },
        {
          type: 'column',
          name: 'Number of Presnces',
          showInLegend: true,
          legendText: 'Number of Presnces',
          dataPoints: [
            { x: new Date() , y: Presnece}
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

  user(){
    const user = localStorage.getItem('user')
    const jsonObject = JSON.parse(user!);
    this.fullName = jsonObject.name +" "+jsonObject.username 
  }


  getAbsencesCount(){
    this.studentService.getAbsencesCount().subscribe(
      (response) => {
        this.AbsencesCount = response;
        console.log("ffffffff",this.AbsencesCount.data.absent_count)
        this.createChart(this.AbsencesCount.data.absent_count ,this.AbsencesCount.data.present_count )
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }
}
