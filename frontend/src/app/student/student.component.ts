import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from '../services/login.service';
import { StudentService } from '../services/student.service';
import { Students } from '../models/Students';
import { Observable } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
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

  constructor(private readonly authService:LoginService,private readonly studentService:StudentService , private router: Router){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.toggleTable(false,true,false)
    this.getAllStudents();
    this.updateForm = this.updateStudentFormGroup();
    this.createForm = this.createStudentFormGroup();
  }

  toggleTable(showF: boolean,showT: boolean,showM: boolean): void {
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
  }

  updateStudent(id:any){
   this.studentService.updateStudent(this.updateForm.value,id)
  }

  deleteStudent(id:any){
    this.studentService.deleteStudent(id);
   }
  
}
