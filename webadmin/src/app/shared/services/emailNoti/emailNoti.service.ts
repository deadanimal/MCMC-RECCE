import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Form } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, tap, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { emailNoti } from './emailNoti.model';

@Injectable({
  providedIn: 'root'
})
export class EmailNotiService {

  public url: string = environment.baseUrl + "v1/emailNoti/";
  // Data
  public emailNoti: emailNoti[] = [];

  constructor(private http: HttpClient) { }

  post(body: Form): Observable<emailNoti> {
    return this.http.post<emailNoti>(this.url, body).pipe(
      tap((res) => {
        console.log("emailNoti: ", res);
      })
    );
  }
  
  get(): Observable<emailNoti[]> {
    return this.http.get<emailNoti[]>(this.url).pipe(
      tap((res) => {
        this.emailNoti = res;
        console.log("emailNoti: ", res);
      })
    );
  }

  getOne(id: string): Observable<emailNoti> {
    let urlID = this.url + id + "/";
    return this.http.get<emailNoti>(urlID).pipe(
      tap((res: emailNoti) => {
        // this.amodel = res;
      })
    );
  }
  
  update(body, id: string): Observable<emailNoti> {
    let urlUpdate = this.url + id + "/";
    console.log("urlUpdate: ", urlUpdate);
    return this.http.patch<emailNoti>(urlUpdate, body).pipe(
      tap((res) => {
        console.log("EmployeeDirectory: ", res);
      })
    );
  }
  
  delete(id: string): Observable<emailNoti> {
    let urlDelete = this.url + id + "/";
    return this.http.delete<emailNoti>(urlDelete).pipe(
      tap((res) => {
        console.log("EmployeeDirectory: ", res);
      })
    );
  }
  
  filter(field: String): Observable<emailNoti[]> {
    let urlFilter = this.url + "?" + field;
    return this.http.get<emailNoti[]>(urlFilter).pipe(
      tap((res) => {
        console.log("EmployeeDirectories: ", res);
      })
    );
  }
  
  extended(): Observable<emailNoti[]> {
    return this.http.get<emailNoti[]>(this.url + "extended").pipe(
      tap((res) => {
        this.emailNoti = res;
        console.log("EmployeeDirectories: ", res);
      })
    );
  }

  sending_mail(body): Observable<any> {
    return this.http.post<any>(this.url + 'sending_email/', body).pipe(
      tap((res) => {
        console.log("EmailTemplate: ", res);
      })
    );
  }


  }
  