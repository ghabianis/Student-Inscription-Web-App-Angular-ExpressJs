import { Component } from '@angular/core';
import { CoursService } from './cours.service';
import { Observable, map } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  selectedFile: File | null = null;
  selectedOptions: string[] = [];
  formData: FormData = new FormData();

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;

  constructor(private readonly coursesService:CoursService){}
  ngOnInit(): void {
    this.fileInfos = this.coursesService.getFiles();
  }
  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    this.selectedFile = (files && files.length > 0) ? files[0] : null;
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  submitForm(): void {
    // Add your form submission logic here
    console.log('Form submitted!');
  }

  convertFormDataToObject(formData: FormData): any {
    const object: any = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    return object;
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.coursesService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.coursesService.getFiles();
              Swal.fire({
                position: "center",
                icon: "success",
                title: `File Uploaded Successfully!`,
                showConfirmButton: false,
                timer: 1000
              })
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          });

      }

      this.selectedFiles = undefined;
    }
  }


  async download(filename: string): Promise<void> {
    try {
      const blob = await this.coursesService.downloadFile(filename);

      // Create a Blob object from the response
      const blobObject = new Blob([blob]);

      // Create a download link and trigger a click
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blobObject);
      a.download = filename;
      a.click();
    } catch (error) {
      console.error('Error downloading file:', error);
      // Handle error as needed
    }
  }

  async delete(filename:string){
    try {
      const response = this.coursesService.deleteFile(filename);
      if(!response){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: `problem while deleting`,
          showConfirmButton: false,
          timer: 1000
        })
      }else{
        Swal.fire({
          position: "center",
          icon: "success",
          title: `File Deleted Successfully!`,
          showConfirmButton: false,
          timer: 1000
        })
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
