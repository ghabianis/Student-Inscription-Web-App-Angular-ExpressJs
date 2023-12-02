import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { CoursService } from '../courses/cours.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
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
    console.log(this.fileInfos)
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

}
