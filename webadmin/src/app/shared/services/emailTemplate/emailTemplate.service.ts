import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Form } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, tap, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { emailTemplate } from './emailTemplate.model';


@Injectable({
  providedIn: 'root'
})
export class emailTemplateService {

  public url: string = environment.baseUrl + "v1/emailTemplate/";
  // Data
  public emailTemplate: emailTemplate[] = [];

  constructor(private http: HttpClient) { }

  post(body: Form): Observable<emailTemplate> {
    return this.http.post<emailTemplate>(this.url, body).pipe(
      tap((res) => {
        console.log("emailTemplate: ", res);
      })
    );
  }
  
  get(): Observable<emailTemplate[]> {
    return this.http.get<emailTemplate[]>(this.url).pipe(
      tap((res) => {
        this.emailTemplate = res;
        console.log("emailTemplate: ", res);
      })
    );
  }

  getOne(id: string): Observable<emailTemplate> {
    let urlID = this.url + id + "/";
    return this.http.get<emailTemplate>(urlID).pipe(
      tap((res: emailTemplate) => {
        // this.amodel = res;
      })
    );
  }
  
  update(body, id: string): Observable<emailTemplate> {
    let urlPatch = this.url + id + "/";
    return this.http.patch<emailTemplate>(urlPatch, body).pipe(
      tap((res) => {
        console.log("emailTemplate: ", res);
      })
    );
  }
  
  delete(id: string): Observable<emailTemplate> {
    let urlDelete = this.url + id + "/";
    return this.http.delete<emailTemplate>(urlDelete).pipe(
      tap((res) => {
        console.log("emailTemplate: ", res);
      })
    );
  }
  
  filter(field: String): Observable<emailTemplate[]> {
    let urlFilter = this.url + "?" + field;
    return this.http.get<emailTemplate[]>(urlFilter).pipe(
      tap((res) => {
        console.log("emailTemplate: ", res);
      })
    );
  }
  
  extended(): Observable<emailTemplate[]> {
    return this.http.get<emailTemplate[]>(this.url + "extended").pipe(
      tap((res) => {
        this.emailTemplate = res;
        console.log("emailTemplate: ", res);
      })
    );
  }

  send_email(body): Observable<any> {
    return this.http.post<any>(this.url + 'send_email/', body).pipe(
      tap((res) => {
        console.log("send_email: ", res);
      })
    );
  }
  }
  