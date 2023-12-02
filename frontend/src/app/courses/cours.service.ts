import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursService {

  constructor(private http: HttpClient) { }
  private url = "http://localhost:3005";

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.url}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.url}/files`);
  }

  async downloadFile(fileName: string): Promise<any> {
    const url = `${this.url}/download/${fileName}`;
    return this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
  }

  async deleteFile(fileName: string): Promise<any> {
    const url = `${this.url}/delete/${fileName}`;
    return this.http.delete(url).toPromise();
  }
}
