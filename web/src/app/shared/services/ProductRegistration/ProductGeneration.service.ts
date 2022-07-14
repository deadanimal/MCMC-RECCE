import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Form } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, tap, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { ProductRegistration } from "./ProductGeneration.model";

@Injectable({
  providedIn: 'root'
})
export class ProductGenerationService {

    // URL
    public url: string = environment.baseUrl + "v1/ProductRegistration/";
    // Data
    public ProductRegistration: ProductRegistration[] = [];
  
    constructor(private http: HttpClient) {}
  
    post(body: Form): Observable<ProductRegistration> {
      return this.http.post<ProductRegistration>(this.url, body).pipe(
        tap((res) => {
          // console.log("ProductRegistration: ", res);
        })
      );
    }
  
    get(): Observable<ProductRegistration[]> {
      return this.http.get<ProductRegistration[]>(this.url).pipe(
        tap((res) => {
          this.ProductRegistration = res;
          // console.log("ProductRegistration: ", res);
        })
      );
    }
  
    update(body, id: string): Observable<ProductRegistration> {
      let urlPatch = this.url + id + "/";
      return this.http.patch<ProductRegistration>(urlPatch, body).pipe(
        tap((res) => {
          // console.log("EmployeeDirectory: ", res);
        })
      );
    }
  
    delete(id: string): Observable<ProductRegistration> {
      let urlDelete = this.url + id + "/";
      return this.http.delete<ProductRegistration>(urlDelete).pipe(
        tap((res) => {
          // console.log("EmployeeDirectory: ", res);
        })
      );
    }
  
    filter(field: String): Observable<ProductRegistration[]> {
      let urlFilter = this.url + "?" + field;
      return this.http.get<ProductRegistration[]>(urlFilter).pipe(
        tap((res) => {
          // console.log("EmployeeDirectories: ", res);
        })
      );
    }

    filterMix(field: String): Observable<ProductRegistration[]> {
      let urlFilter = this.url+"filter_table_testing/" + "?" + field;
      return this.http.get<ProductRegistration[]>(urlFilter).pipe(
        tap((res) => {
          // console.log("EmployeeDirectories: ", res);
        })
      );
    }
  
    extended(): Observable<ProductRegistration[]> {
      return this.http.get<ProductRegistration[]>(this.url + "extended").pipe(
        tap((res) => {
          this.ProductRegistration = res;
          // console.log("EmployeeDirectories: ", res);
        })
      );
    }

    verify_recaptcha(body): Observable<ProductRegistration> {
      let urlRecaptcha = this.url + "verify_recaptcha/";
      return this.http.post<ProductRegistration>(urlRecaptcha, body).pipe(
        tap((res) => {
          // console.log("captcha response: ", res);
        })
      );
    }

  }
