import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Form } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, tap, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { productCertification } from './productCertification.model';

@Injectable({
  providedIn: 'root'
})
export class productCertificationService {

    // URL
    public url: string = environment.baseUrl + "v1/productCertification/";
    // Data
    public productCertification: productCertification[] = [];
  
    constructor(private http: HttpClient) {}
  
    post(body: Form): Observable<productCertification> {
      return this.http.post<productCertification>(this.url, body).pipe(
        tap((res) => {
          // console.log("productCertification: ", res);
        })
      );
    }
  
    get(): Observable<productCertification[]> {
      return this.http.get<productCertification[]>(this.url).pipe(
        tap((res) => {
          this.productCertification = res;
          // console.log("productCertification: ", res);
        })
      );
    }
  
    update(body, id: string): Observable<productCertification> {
      let urlPatch = this.url + id + "/";
      return this.http.patch<productCertification>(urlPatch, body).pipe(
        tap((res) => {
          // console.log("EmployeeDirectory: ", res);
        })
      );
    }
  
    delete(id: string): Observable<productCertification> {
      let urlDelete = this.url + id + "/";
      return this.http.delete<productCertification>(urlDelete).pipe(
        tap((res) => {
          // console.log("EmployeeDirectory: ", res);
        })
      );
    }
  
    filter(field: String): Observable<productCertification[]> {
      let urlFilter = this.url + "?" + field;
      return this.http.get<productCertification[]>(urlFilter).pipe(
        tap((res) => {
          // console.log("EmployeeDirectories: ", res);
        })
      );
    }

    filterMix(field: String): Observable<productCertification[]> {
      let urlFilter = this.url+"filter_table_testing/" + "?" + field;
      return this.http.get<productCertification[]>(urlFilter).pipe(
        tap((res) => {
          // console.log("EmployeeDirectories: ", res);
        })
      );
    }
  
    extended(): Observable<productCertification[]> {
      return this.http.get<productCertification[]>(this.url + "extended").pipe(
        tap((res) => {
          this.productCertification = res;
          // console.log("EmployeeDirectories: ", res);
        })
      );
    }

    verify_recaptcha(body): Observable<productCertification> {
      let urlRecaptcha = this.url + "verify_recaptcha/";
      return this.http.post<productCertification>(urlRecaptcha, body).pipe(
        tap((res) => {
          // console.log("captcha response: ", res);
        })
      );
    }


    get_pagination(page): Observable<any[]> {
      return this.http.get<productCertification[]>(this.url + page).pipe(
        tap((res) => {
          // console.log("Si Anjing Hensem: ", res);
        })
      );
    }

  }
