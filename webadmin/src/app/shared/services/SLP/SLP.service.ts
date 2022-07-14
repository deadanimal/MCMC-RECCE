import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Form } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, tap, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { SLP } from './SLP.service.model';

@Injectable({
  providedIn: 'root'
})
export class SLPService {

    // URL
    public url: string = environment.baseUrl + "v1/SLP/";
    // Data
    public SLP: SLP[] = [];
  
    constructor(private http: HttpClient) {}
  
    post(body: Form): Observable<SLP> {
      return this.http.post<SLP>(this.url, body).pipe(
        tap((res) => {
          console.log("SLP: ", res);
        })
      );
    }
  
    get(): Observable<SLP[]> {
      return this.http.get<SLP[]>(this.url).pipe(
        tap((res) => {
          this.SLP = res;
          console.log("SLP: ", res);
        })
      );
    }
  
    update(body, id: string): Observable<SLP> {
      let urlPatch = this.url + id + "/";
      return this.http.patch<SLP>(urlPatch, body).pipe(
        tap((res) => {
          console.log("EmployeeDirectory: ", res);
        })
      );
    }
  
    delete(id: string): Observable<SLP> {
      let urlDelete = this.url + id + "/";
      return this.http.delete<SLP>(urlDelete).pipe(
        tap((res) => {
          console.log("EmployeeDirectory: ", res);
        })
      );
    }
  
    filter(field: String): Observable<SLP[]> {
      let urlFilter = this.url + "?" + field;
      return this.http.get<SLP[]>(urlFilter).pipe(
        tap((res) => {
          console.log("EmployeeDirectories: ", res);
        })
      );
    }

    filterMix(field: String): Observable<SLP[]> {
      let urlFilter = this.url+"filter_table_testing/" + "?" + field;
      return this.http.get<SLP[]>(urlFilter).pipe(
        tap((res) => {
          console.log("EmployeeDirectories: ", res);
        })
      );
    }
  
    extended(): Observable<SLP[]> {
      return this.http.get<SLP[]>(this.url + "extended").pipe(
        tap((res) => {
          this.SLP = res;
          console.log("EmployeeDirectories: ", res);
        })
      );
    }

    verify_recaptcha(body): Observable<SLP> {
      let urlRecaptcha = this.url + "verify_recaptcha/";
      return this.http.post<SLP>(urlRecaptcha, body).pipe(
        tap((res) => {
          console.log("captcha response: ", res);
        })
      );
    }

    // isra is here
    filterMix_pagination(field: String): Observable<SLP[]> {
      let urlFilter = this.url+ "?" + field;
      return this.http.get<SLP[]>(urlFilter).pipe(
        tap((res) => {
          console.log("Si ANjing: ", res);
        })
      );
    }

     //pagination get
     get_pagination(page): Observable<any[]> {
      return this.http.get<SLP[]>(this.url + "?page=" + page).pipe(
        tap((res) => {
          console.log("Si Anjing Hensem: ", res);
        })
      );
    }

  }
