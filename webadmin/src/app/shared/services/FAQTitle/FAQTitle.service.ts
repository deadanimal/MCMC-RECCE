import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Form } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, tap, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { FAQTitle } from "./FAQTitle.model";

@Injectable({
  providedIn: 'root'
})
export class FAQTitleService {

  public url: string = environment.baseUrl + "v1/FAQTitle/";
  // Data
  public FAQTitle: FAQTitle[] = [];

  constructor(private http: HttpClient) { }

  post(body): Observable<FAQTitle> {
    return this.http.post<FAQTitle>(this.url, body).pipe(
      tap((res) => {
        console.log("FAQTitle: ", res);
      })
    );
  }
  
  get(): Observable<FAQTitle[]> {
    return this.http.get<FAQTitle[]>(this.url).pipe(
      tap((res) => {
        this.FAQTitle = res;
        console.log("FAQTitle: ", res);
      })
    );
  }
  
  update(body, id: string): Observable<FAQTitle> {
    let urlPatch = this.url + id + "/";
    return this.http.patch<FAQTitle>(urlPatch, body).pipe(
      tap((res) => {
        console.log("FAQTitle: ", res);
      })
    );
  }
  
  delete(id: string): Observable<FAQTitle> {
    let urlDelete = this.url + id + "/";
    return this.http.delete<FAQTitle>(urlDelete).pipe(
      tap((res) => {
        console.log("FAQTitle: ", res);
      })
    );
  }
  
  filter(field: String): Observable<FAQTitle[]> {
    let urlFilter = this.url + "?" + field;
    return this.http.get<FAQTitle[]>(urlFilter).pipe(
      tap((res) => {
        console.log("FAQTitle: ", res);
      })
    );
  }
  
  extended(): Observable<FAQTitle[]> {
    return this.http.get<FAQTitle[]>(this.url + "extended").pipe(
      tap((res) => {
        this.FAQTitle = res;
        console.log("FAQTitle: ", res);
      })
    );
  }
  
  }
  