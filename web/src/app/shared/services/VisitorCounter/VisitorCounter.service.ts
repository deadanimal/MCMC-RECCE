import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Form } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, tap, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { VisitorCounter } from './VisitorCounter.model';

@Injectable({
  providedIn: 'root'
})
export class VisitorCounterService {

    // URL
    public url: string = environment.baseUrl + "v1/VisitorCounter/";
    // Data
    public VisitorCounter: VisitorCounter[] = [];
  
    constructor(private http: HttpClient) {}
  
    post(body): Observable<VisitorCounter> {
      return this.http.post<VisitorCounter>(this.url, body).pipe(
        tap((res) => {
          // console.log("VisitorCounter: ", res);
        })
      );
    }
  
    get(): Observable<VisitorCounter[]> {
      return this.http.get<VisitorCounter[]>(this.url).pipe(
        tap((res) => {
          this.VisitorCounter = res;
          // console.log("VisitorCounter: ", res);
        })
      );
    }
  
    update(body, id: string): Observable<VisitorCounter> {
      let urlPatch = this.url + id + "/";
      return this.http.patch<VisitorCounter>(urlPatch, body).pipe(
        tap((res) => {
          // console.log("EmployeeDirectory: ", res);
        })
      );
    }
  
    delete(id: string): Observable<VisitorCounter> {
      let urlDelete = this.url + id + "/";
      return this.http.delete<VisitorCounter>(urlDelete).pipe(
        tap((res) => {
          // console.log("EmployeeDirectory: ", res);
        })
      );
    }
  
    filter(field: String): Observable<VisitorCounter[]> {
      let urlFilter = this.url + "?" + field;
      return this.http.get<VisitorCounter[]>(urlFilter).pipe(
        tap((res) => {
          // console.log("EmployeeDirectories: ", res);
        })
      );
    }

    filterMix(field: String): Observable<VisitorCounter[]> {
      let urlFilter = this.url+"filter_table_testing/" + "?" + field;
      return this.http.get<VisitorCounter[]>(urlFilter).pipe(
        tap((res) => {
          // console.log("EmployeeDirectories: ", res);
        })
      );
    }
  
    extended(): Observable<VisitorCounter[]> {
      return this.http.get<VisitorCounter[]>(this.url + "extended").pipe(
        tap((res) => {
          this.VisitorCounter = res;
          // console.log("EmployeeDirectories: ", res);
        })
      );
    }

    verify_recaptcha(body): Observable<VisitorCounter> {
      let urlRecaptcha = this.url + "verify_recaptcha/";
      return this.http.post<VisitorCounter>(urlRecaptcha, body).pipe(
        tap((res) => {
          // console.log("captcha response: ", res);
        })
      );
    }

    getVisitorChart() {
      let urlTemp = this.url + 'get_visitor_counter'
      return this.http.get<any>(urlTemp).pipe(
        tap((res) => {
          this.VisitorCounter = res
          // console.log('Statistics: ', this.trainingStatistics)
        })
      )
    }

  }
