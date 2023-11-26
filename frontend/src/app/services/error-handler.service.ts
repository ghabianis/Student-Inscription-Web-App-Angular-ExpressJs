import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      if(error.status == 401){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: `<a href="#">User Doesn't Exist Please Register And Try Again!</a>`
        });
      }else if(error.status == 500){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: `<a href="#">There Is An Error In Or Server Please Try Again Later!</a>`
        });
      }

      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
