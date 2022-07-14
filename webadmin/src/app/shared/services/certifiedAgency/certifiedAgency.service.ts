import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Form } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, tap, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { certifiedAgency } from './certifiedAgency.model';


@Injectable({
  providedIn: 'root'
})
export class certifiedAgencyService {

  public url: string = environment.baseUrl + "v1/certifiedAgency/"
  // Data
  public API: string = 'assets/mock/';
  public certifiedAgency: certifiedAgency[] = [];
  public datas: any = []

  constructor(private http: HttpClient) { }

  post(body: Form): Observable<certifiedAgency> {
    return this.http.post<certifiedAgency>(this.url, body).pipe(
      tap((res) => {
        console.log("certifiedAgency: ", res);
      })
    );
  }
  
  get(): Observable<certifiedAgency[]> {
    return this.http.get<certifiedAgency[]>(this.url).pipe(
      tap((res) => {
        this.certifiedAgency = res;
        console.log("certifiedAgency: ", res);
      })
    );
  }

  getOne(id: string): Observable<certifiedAgency> {
    let urlID = this.url + id + "/";
    return this.http.get<certifiedAgency>(urlID).pipe(
      tap((res: certifiedAgency) => {
        // this.amodel = res;
      })
    );
  }
  
  update(body, id: string): Observable<certifiedAgency> {
    let urlPatch = this.url + id + "/";
    return this.http.patch<certifiedAgency>(urlPatch, body).pipe(
      tap((res) => {
        console.log("certifiedAgency: ", res);
      })
    );
  }
  
  delete(id: string): Observable<certifiedAgency> {
    let urlDelete = this.url + id + "/";
    return this.http.delete<certifiedAgency>(urlDelete).pipe(
      tap((res) => {
        console.log("certifiedAgency: ", res);
      })
    );
  }
  
  filter(field: String): Observable<certifiedAgency[]> {
    let urlFilter = this.url + "?" + field;
    return this.http.get<certifiedAgency[]>(urlFilter).pipe(
      tap((res) => {
        console.log("certifiedAgency: ", res);
      })
    );
  }
  
  extended(): Observable<certifiedAgency[]> {
    return this.http.get<certifiedAgency[]>(this.url + "extended").pipe(
      tap((res) => {
        this.certifiedAgency = res;
        console.log("certifiedAgency: ", res);
      })
    );
  }

  send_email(body): Observable<any> {
    return this.http.post<any>(this.url + 'send_email/', body).pipe(
      tap((res) => {
        console.log("send_email:", res);
      })
    );
  }

  getAll(path: string): Observable<any> {
    let urlPath = this.API + path
    return this.http.get<any>(urlPath).pipe(
      tap((res) => {
        this.datas = res
        console.log('Data: ', this.datas)
      })
    )
  }

  APIcall(body): Observable<certifiedAgency> {
    return this.http.post<certifiedAgency>(this.url+"script/", body).pipe(
      tap((res) => {
        console.log("api call: ", res);
      })
    );
  }
  }