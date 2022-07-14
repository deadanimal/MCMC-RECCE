import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Form } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, tap, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { variableConfigure } from './variableConfigure.model';

@Injectable({
  providedIn: 'root'
})
export class variableConfigureService {

  public url: string = environment.baseUrl + "v1/variableConfigure/";
  // Data
  public variableConfigure: variableConfigure[] = [];

  constructor(private http: HttpClient) { }

  post(body: Form): Observable<variableConfigure> {
    return this.http.post<variableConfigure>(this.url, body).pipe(
      tap((res) => {
        console.log("variableConfigure: ", res);
      })
    );
  }
  
  get(): Observable<variableConfigure[]> {
    return this.http.get<variableConfigure[]>(this.url).pipe(
      tap((res) => {
        this.variableConfigure = res;
        console.log("variableConfigure: ", res);
      })
    );
  }

  getOne(id: string): Observable<variableConfigure> {
    let urlID = this.url + id + "/";
    return this.http.get<variableConfigure>(urlID).pipe(
      tap((res: variableConfigure) => {
        // this.amodel = res;
      })
    );
  }
  
  update(body, id: string): Observable<variableConfigure> {
    let urlPatch = this.url + id + "/";
    return this.http.patch<variableConfigure>(urlPatch, body).pipe(
      tap((res) => {
        console.log("variableConfigure: ", res);
      })
    );
  }
  
  delete(id: string): Observable<variableConfigure> {
    let urlDelete = this.url + id + "/";
    return this.http.delete<variableConfigure>(urlDelete).pipe(
      tap((res) => {
        console.log("variableConfigure: ", res);
      })
    );
  }
  
  filter(field: String): Observable<variableConfigure[]> {
    let urlFilter = this.url + "?" + field;
    return this.http.get<variableConfigure[]>(urlFilter).pipe(
      tap((res) => {
        console.log("variableConfigure: ", res);
      })
    );
  }
  
  extended(): Observable<variableConfigure[]> {
    return this.http.get<variableConfigure[]>(this.url + "extended").pipe(
      tap((res) => {
        this.variableConfigure = res;
        console.log("variableConfigure: ", res);
      })
    );
  }
  }
  