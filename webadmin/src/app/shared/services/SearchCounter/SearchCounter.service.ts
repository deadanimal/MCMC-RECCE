import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Form } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, tap, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { SearchCounter } from './SearchCounter.model';

@Injectable({
  providedIn: 'root'
})
export class SearchCounterService {

    // URL
    public url: string = environment.baseUrl + "v1/SearchCounter/";
    // Data
    public SearchCounter: SearchCounter[] = [];
  
    constructor(private http: HttpClient) {}
  
    post(body): Observable<SearchCounter> {
      return this.http.post<SearchCounter>(this.url, body).pipe(
        tap((res) => {
          console.log("SearchCounter: ", res);
        })
      );
    }
  
    get(): Observable<SearchCounter[]> {
      return this.http.get<SearchCounter[]>(this.url).pipe(
        tap((res) => {
          this.SearchCounter = res;
          console.log("SearchCounter: ", res);
        })
      );
    }
  
    update(body, id: string): Observable<SearchCounter> {
      let urlPatch = this.url + id + "/";
      return this.http.patch<SearchCounter>(urlPatch, body).pipe(
        tap((res) => {
          console.log("EmployeeDirectory: ", res);
        })
      );
    }
  
    delete(id: string): Observable<SearchCounter> {
      let urlDelete = this.url + id + "/";
      return this.http.delete<SearchCounter>(urlDelete).pipe(
        tap((res) => {
          console.log("EmployeeDirectory: ", res);
        })
      );
    }
  
    filter(field: String): Observable<SearchCounter[]> {
      let urlFilter = this.url + "?" + field;
      return this.http.get<SearchCounter[]>(urlFilter).pipe(
        tap((res) => {
          console.log("EmployeeDirectories: ", res);
        })
      );
    }

    filterMix(field: String): Observable<SearchCounter[]> {
      let urlFilter = this.url+"filter_table_testing/" + "?" + field;
      return this.http.get<SearchCounter[]>(urlFilter).pipe(
        tap((res) => {
          console.log("EmployeeDirectories: ", res);
        })
      );
    }
  
    extended(): Observable<SearchCounter[]> {
      return this.http.get<SearchCounter[]>(this.url + "extended").pipe(
        tap((res) => {
          this.SearchCounter = res;
          console.log("EmployeeDirectories: ", res);
        })
      );
    }

    verify_recaptcha(body): Observable<SearchCounter> {
      let urlRecaptcha = this.url + "verify_recaptcha/";
      return this.http.post<SearchCounter>(urlRecaptcha, body).pipe(
        tap((res) => {
          console.log("captcha response: ", res);
        })
      );
    }

    getSearchChart() {
      let urlTemp = this.url + 'get_search_counter'
      return this.http.get<any>(urlTemp).pipe(
        tap((res) => {
          this.SearchCounter = res
          // console.log('Statistics: ', this.trainingStatistics)
        })
      )
    }

    getSearchChartNew() {
      let urlTemp = this.url + 'get_search_chart'
      return this.http.get<any>(urlTemp).pipe(
        tap((res) => {
          this.SearchCounter = res
          // console.log('Statistics: ', this.trainingStatistics)
        })
      )
    }

    getSearchCounter(){
      let urlSearch = this.url + 'get_search_counter_data'
      return this.http.get<any>(urlSearch).pipe(
        tap((res)=>{
          this.SearchCounter = res
        })
      )
    }

    getSearchMonthly(){
      let urlSearch = this.url + 'get_search_monthly'
      return this.http.get<any>(urlSearch).pipe(
        tap((res)=>{
          this.SearchCounter = res
        })
      )
    }

    getSearchMonth(){
      let urlSearch = this.url + 'get_search_month'
      return this.http.get<any>(urlSearch).pipe(
        tap((res)=>{
          this.SearchCounter = res
        })
      )
    }


  }
