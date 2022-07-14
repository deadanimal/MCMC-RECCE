import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Form } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, tap, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { FAQCategories } from './FAQCategories.model';

@Injectable({
  providedIn: 'root'
})
export class FAQCategoriesService {

  public url: string = environment.baseUrl + "v1/FAQCategory/";
  // Data
  public FAQCategories: FAQCategories[] = [];

  constructor(private http: HttpClient) { }

  post(body): Observable<FAQCategories> {
    return this.http.post<FAQCategories>(this.url, body).pipe(
      tap((res) => {
        // console.log("FAQCategories: ", res);
      })
    );
  }
  
  get(): Observable<FAQCategories[]> {
    return this.http.get<FAQCategories[]>(this.url).pipe(
      tap((res) => {
        this.FAQCategories = res;
        // console.log("FAQCategories: ", res);
      })
    );
  }

  getOne(id: string): Observable<FAQCategories> {
    let urlID = this.url + id + "/";
    return this.http.get<FAQCategories>(urlID).pipe(
      tap((res: FAQCategories) => {
        // this.amodel = res;
      })
    );
  }
  
  update(id,body: string): Observable<FAQCategories> {
    let urlPatch = this.url + id + "/";
    return this.http.patch<FAQCategories>(urlPatch, body).pipe(
      tap((res) => {
        // console.log("EmployeeDirectory: ", res);
      })
    );
  }
  
  delete(id: string): Observable<FAQCategories> {
    let urlDelete = this.url + id + "/";
    return this.http.delete<FAQCategories>(urlDelete).pipe(
      tap((res) => {
        // console.log("EmployeeDirectory: ", res);
      })
    );
  }
  
  filter(field: String): Observable<FAQCategories[]> {
    let urlFilter = this.url + "?" + field;
    return this.http.get<FAQCategories[]>(urlFilter).pipe(
      tap((res) => {
        // console.log("EmployeeDirectories: ", res);
      })
    );
  }
  
  extended(): Observable<FAQCategories[]> {
    return this.http.get<FAQCategories[]>(this.url + "extended").pipe(
      tap((res) => {
        this.FAQCategories = res;
        // console.log("EmployeeDirectories: ", res);
      })
    );
  }
  
  }
  