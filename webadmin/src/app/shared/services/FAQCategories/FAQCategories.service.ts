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
  public urlHistory: string = environment.baseUrl + "v1/FAQCategoryHistory/"
  public urlHistory2: string = environment.baseUrl + "v1/emailNotiHistory/"
  public urlHistory3: string = environment.baseUrl + "v1/emailTemplateHistory/"
  public urlHistory4: string = environment.baseUrl + "v1/variableConfigureHistory/"
  public urlHistory5: string = environment.baseUrl + "v1/certifiedAgencyHistory/"
  public urlHistory6: string = environment.baseUrl + "v1/userHistory/"
  public urlHistory7: string = environment.baseUrl + "v1/usersLog/"
  public urlHistory8: string = environment.baseUrl + "v1/DataHistory/"

  constructor(private http: HttpClient) { }

  post(body): Observable<FAQCategories> {
    return this.http.post<FAQCategories>(this.url, body).pipe(
      tap((res) => {
        console.log("FAQCategories: ", res);
      })
    );
  }

  get(): Observable<FAQCategories[]> {
    return this.http.get<FAQCategories[]>(this.url).pipe(
      tap((res) => {
        this.FAQCategories = res;
        console.log("FAQCategories: ", res);
      })
    );
  }

  getHistory(): Observable<FAQCategories[]> {
    return this.http.get<FAQCategories[]>(this.urlHistory).pipe(
      tap((res) => {
        this.FAQCategories = res;
      })
    );
  }

  getHistory2(): Observable<FAQCategories[]> {
    return this.http.get<FAQCategories[]>(this.urlHistory2).pipe(
      tap((res) => {
        this.FAQCategories = res;
      })
    );
  }

  getHistory3(): Observable<FAQCategories[]> {
    return this.http.get<FAQCategories[]>(this.urlHistory3).pipe(
      tap((res) => {
        this.FAQCategories = res;
      })
    );
  }

  getHistory4(): Observable<FAQCategories[]> {
    return this.http.get<FAQCategories[]>(this.urlHistory4).pipe(
      tap((res) => {
        this.FAQCategories = res;
      })
    );
  }

  getHistory5(): Observable<FAQCategories[]> {
    return this.http.get<FAQCategories[]>(this.urlHistory5).pipe(
      tap((res) => {
        this.FAQCategories = res;
      })
    );
  }

  getHistory6(): Observable<FAQCategories[]> {
    return this.http.get<FAQCategories[]>(this.urlHistory6).pipe(
      tap((res) => {
        this.FAQCategories = res;
      })
    );
  }

  getHistory7(): Observable<FAQCategories[]> {
    return this.http.get<FAQCategories[]>(this.urlHistory7).pipe(
      tap((res) => {
        this.FAQCategories = res;
      })
    );
  }

  getHistory8(): Observable<FAQCategories[]> {
    return this.http.get<FAQCategories[]>(this.urlHistory8).pipe(
      tap((res) => {
        this.FAQCategories = res;
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
        console.log("EmployeeDirectory: ", res);
      })
    );
  }

  delete(id: string): Observable<FAQCategories> {
    let urlDelete = this.url + id + "/";
    return this.http.delete<FAQCategories>(urlDelete).pipe(
      tap((res) => {
        console.log("EmployeeDirectory: ", res);
      })
    );
  }

  searchHistory(field: String): Observable<FAQCategories[]> {
    let History = this.urlHistory + "?" + field;
    return this.http.get<FAQCategories[]>(History).pipe(
      tap((res) => {

      })
    );
  }

  searchHistory2(field: String): Observable<FAQCategories[]> {
    let History2 = this.urlHistory + "?" + field;
    return this.http.get<FAQCategories[]>(History2).pipe(
      tap((res) => {

      })
    );
  }

  searchHistory3(field: String): Observable<FAQCategories[]> {
    let History3 = this.urlHistory3 + "?" + field;
    return this.http.get<FAQCategories[]>(History3).pipe(
      tap((res) => {

      })
    );
  }

  searchHistory4(field: String): Observable<FAQCategories[]> {
    let History4 = this.urlHistory4 + "?" + field;
    return this.http.get<FAQCategories[]>(History4).pipe(
      tap((res) => {

      })
    );
  }

  searchHistory5(field: String): Observable<FAQCategories[]> {
    let History5 = this.urlHistory5 + "?" + field;
    return this.http.get<FAQCategories[]>(History5).pipe(
      tap((res) => {

      })
    );
  }

  searchHistory6(field: String): Observable<FAQCategories[]> {
    let History6 = this.urlHistory6 + "?" + field;
    return this.http.get<FAQCategories[]>(History6).pipe(
      tap((res) => {

      })
    );
  }

  searchHistory7(field: String): Observable<FAQCategories[]> {
    let History7 = this.urlHistory6 + "?" + field;
    return this.http.get<FAQCategories[]>(History7).pipe(
      tap((res) => {

      })
    );
  }

  searchHistory8(field: String): Observable<FAQCategories[]> {
    let History8 = this.urlHistory8 + "?" + field;
    return this.http.get<FAQCategories[]>(History8).pipe(
      tap((res) => {

      })
    );
  }

  filter(field: String): Observable<FAQCategories[]> {
    let urlFilter = this.url + "?" + field;
    return this.http.get<FAQCategories[]>(urlFilter).pipe(
      tap((res) => {
        console.log("EmployeeDirectories: ", res);
      })
    );
  }

  extended(): Observable<FAQCategories[]> {
    return this.http.get<FAQCategories[]>(this.url + "extended").pipe(
      tap((res) => {
        this.FAQCategories = res;
        console.log("EmployeeDirectories: ", res);
      })
    );
  }

  }
