import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable,Subject } from "rxjs";
import {Students} from '../models/Students';
import { catchError, first } from "rxjs/operators";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private url = "http://localhost:3005/admin";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  private studentDeleted = new Subject<void>();


  studentDeleted$ = this.studentDeleted.asObservable();


   getAllStudents(): Observable<Students[]>{
    return this.http.get<Students[]>(`${this.url}/students`, { responseType: "json" })
    .pipe(
      catchError(this.errorHandlerService.handleError<Students[]>("students", []))
    );
  }

  getStudentsCount(): Observable<any>{
    return this.http.get<any>(`${this.url}/getStudentsCount`, { responseType: "json" })
    .pipe(
      catchError(this.errorHandlerService.handleError<any>("students", []))
    );
  }

  

  createStudent(student:Students):any{
    return this.http.post<Students[]>(`${this.url}/createStudent`, student).subscribe(
      (response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Student With Email:${student.email} Created Successfully!`,
          showConfirmButton: false,
          timer: 1000
        }).then(()=>{
          this.getAllStudents()
          location.reload()
        })
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    )
  }

  updateStudent(student:Students  , studentId: Pick<Students, "id">):any{
    return this.http.put<Students[]>(`${this.url}/updateStudent/${studentId}`, student).subscribe(
      (response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Student With Id:${studentId} Updated Successfully!`,
          showConfirmButton: false,
          timer: 1000
        }).then(()=>{
          this.getAllStudents()
          location.reload()
        })
      },
      (error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `${error.message}!`,
          showConfirmButton: false,
          timer: 5000
        })
      }
    )
  }


  
  deleteStudent(studentId: Pick<Students, "id">):any{
    return this.http.delete<Students[]>(`${this.url}/deleteStudent/${studentId}`).subscribe(
       (response) => {
        if(response){
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Student With Id:${studentId} deleted Successfully!`,
            showConfirmButton: false,
            timer: 1000
          }).then(()=>{
            this.getAllStudents()
            location.reload()
          })
        }
        

      },
      (error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `${error.message}!`,
          showConfirmButton: false,
          timer: 1000
        })
      }
    )
  }
  
  addAbsences(absence:any):any{
    return this.http.post<any[]>(`${this.url}/absences`, absence).subscribe(
      (response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Student Absence Created Successfully!`,
          showConfirmButton: false,
          timer: 1000
        }).then(()=>{
          this.getAbsences()
          location.reload()
        })
      },
      (error) => {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: `Student Absence/Presence already exist`,
          showConfirmButton: false,
          timer: 1000
        });
        console.error('Error fetching Data Absence:', error);
      }
    )
  }


  getAbsences(): Observable<any>{
    return this.http.get<any>(`${this.url}/getAbsences`, { responseType: "json" })
  }


  getAbsencesCount(): Observable<any>{
    return this.http.get<any>(`${this.url}/getAbsencesCount`, { responseType: "json" })
  }

}
