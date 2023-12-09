import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from '../services/login.service';
import { StudentService } from '../services/student.service';
import { Students } from '../models/Students';
import { Observable } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit{
  
  showForm: boolean = false;
  showTable: boolean = false;
  showManagement: boolean = false;
  response : any = []
  updateForm!: FormGroup;
  createForm!: FormGroup;
  action = "Update"
  absence = {studentId:0,absent:0,present:0,date: new Date()}
  Absences : any = []
  AbsencesCount : any = []
  currentDate: Date = new Date();
  formattedDateTime:any
  constructor(private readonly authService:LoginService,private readonly studentService:StudentService , private router: Router){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.getAllStudents();
    // this.toggleTable(false,true,false)
    this.updateForm = this.updateStudentFormGroup();
    this.createForm = this.createStudentFormGroup();
    this.getAbsences()
    this.getAbsencesCount()
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  }

  toggleTable(showF: boolean,showT: boolean,showM: boolean): void {
    if(showF){
      this.action = "Add"
    }else if(showT){
      this.action = "Update"
    }else{
      this.action = "Absense"
    }
    this.showForm = showF;
    this.showTable = showT;
    this.showManagement = showM;
  }
  students: any = [];

  updateStudentFormGroup(): FormGroup {
    return new FormGroup({
      email:  new FormControl("", [Validators.required, Validators.email]),
      firstname: new FormControl("", [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl("", [Validators.required, Validators.minLength(2)]),
      classname: new FormControl("", [Validators.required, Validators.minLength(2)]),
    });
  }

  createStudentFormGroup(): FormGroup {
    return new FormGroup({
      email:  new FormControl("", [Validators.required, Validators.email]),
      firstname: new FormControl("", [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl("", [Validators.required, Validators.minLength(2)]),
      classname: new FormControl("", [Validators.required, Validators.minLength(2)]),
    });
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

  createStudent():void{
    this.studentService.createStudent(this.createForm.value);
    this.toggleTable(false,true,false)
  }
  studentId :any
  showId(student:any){
    console.log(student)
    this.studentId = student.id
    this.updateForm.setValue({
      firstname : student.firstname,
      lastname : student.lastname,
      email: student.email,
      classname: student.classname
    })
  }

  updateStudent(){
   this.studentService.updateStudent(this.updateForm.value,this.studentId)
   this.toggleTable(false,true,false)
  }


  deleteStudent(id:any){
    this.studentService.deleteStudent(id);
    this.toggleTable(false,true,false)
   }
  

   absent(event:any,student:any){
    const isChecked = event.target.checked;
    console.log('Checkbox status:', isChecked);
    console.log("student:" ,student.id +"is ",isChecked)
    const date = new Date();
    // Additional logic based on the checkbox status
    if (isChecked) {
      const absent = 1;
      this.absence.studentId = student.id,
      this.absence.absent = absent,
      this.absence.date = date;

      const response = this.studentService.addAbsences(this.absence);
      return response;      
      
      // Checkbox is checked
      // Perform your actions here
    } else {
      // Checkbox is unchecked
      const absent = 0;
      this.absence.studentId = student.id,
      this.absence.absent = absent,
      this.absence.date = date;

      const response = this.studentService.addAbsences(this.absence);
      this.toggleTable(false,false,true)
      return response; 
    }
   }

   present(event:any,student:any){
    const isChecked = event.target.checked;
    console.log('Checkbox status:', isChecked);
    console.log("student:" ,student.id +"is ",isChecked)
    const date = new Date();
    // Additional logic based on the checkbox status
    if (isChecked) {
      const present = 1;
      this.absence.studentId = student.id,
      this.absence.present = present,
      this.absence.date = date;

      const response = this.studentService.addAbsences(this.absence);
      return response;      
      
      // Checkbox is checked
      // Perform your actions here
    } else {
      // Checkbox is unchecked
      const absent = 0;
      this.absence.studentId = student.id,
      this.absence.absent = absent,
      this.absence.date = date;

      const response = this.studentService.addAbsences(this.absence);
      this.toggleTable(false,false,true)
      return response; 
    }
   }

   getAbsences(){
      const data = this.studentService.getAbsences().subscribe(
        (response) => {
          console.log(response)
          this.Absences = response;
          console.log(this.Absences.data)
          this.toggleTable(false,true,false)
        },
        (error) => {
          console.error('Error fetching students:', error);
        }
      );
   }

   isAbsentChecked(student: any): boolean {
    const item = this.Absences.data.find((absence: any) => absence.studentId === student.id);
    return item?.absent === 1;
  }
  
  isPresentChecked(student: any): boolean {
    const item = this.Absences.data.find((absence: any) => absence.studentId === student.id);
    return item?.present === 1;
  }


  getAbsencesCount(){
    this.studentService.getAbsencesCount().subscribe(
      (response) => {
        this.AbsencesCount = response;
        this.toggleTable(false,true,false)
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }

  generatePDF() {
    const element = document.getElementById('Absense');
    if (element) {
      const pdfWidth = 1000;
      const pdfHeight = 700;
  
      html2canvas(element, { width: pdfWidth, height: pdfHeight }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'px', [pdfWidth, pdfHeight]); // 'p' for portrait, 'l' for landscape
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('table.pdf');
      });
    }
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
    });
  }
}
