import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Form } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, tap, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { masterTable } from "./masterData.model";

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  public url: string = environment.baseUrl + "v1/masterTable/";
  // Data
  public masterTable: masterTable[] = [];

constructor(private http: HttpClient) { }

post(body: Form): Observable<masterTable> {
  return this.http.post<masterTable>(this.url, body).pipe(
    tap((res) => {
      console.log("masterTable: ", res);
    })
  );
}

get(): Observable<masterTable[]> {
  return this.http.get<masterTable[]>(this.url).pipe(
    tap((res) => {
      this.masterTable = res;
      console.log("masterTable: ", res);
    })
  );
}

update(body, id: string): Observable<masterTable> {
  let urlPatch = this.url + id + "/";
  return this.http.patch<masterTable>(urlPatch, body).pipe(
    tap((res) => {
      console.log("EmployeeDirectory: ", res);
    })
  );
}

delete(id: string): Observable<masterTable> {
  let urlDelete = this.url + id + "/";
  return this.http.delete<masterTable>(urlDelete).pipe(
    tap((res) => {
      console.log("EmployeeDirectory: ", res);
    })
  );
}

filter(field: String): Observable<masterTable[]> {
  let urlFilter = this.url + "?" + field;
  return this.http.get<masterTable[]>(urlFilter).pipe(
    tap((res) => {
      console.log("EmployeeDirectories: ", res);
    })
  );
}

filterMix(field: String): Observable<masterTable[]> {
  let urlFilter = this.url+"filter_table_testing/" + "?" + field;
  return this.http.get<masterTable[]>(urlFilter).pipe(
    tap((res) => {
      console.log("EmployeeDirectories: ", res);
    })
  );
}

extended(): Observable<masterTable[]> {
  return this.http.get<masterTable[]>(this.url + "extended").pipe(
    tap((res) => {
      this.masterTable = res;
      console.log("EmployeeDirectories: ", res);
    })
  );
}

verify_recaptcha(body): Observable<masterTable> {
  let urlRecaptcha = this.url + "verify_recaptcha/";
  return this.http.post<masterTable>(urlRecaptcha, body).pipe(
    tap((res) => {
      console.log("captcha response: ", res);
    })
  );
}

}
