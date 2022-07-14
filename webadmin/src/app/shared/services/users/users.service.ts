import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from './users.model';
import{ AD } from './users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // URL
  public urlUser: string = environment.baseUrl + 'v1/users/'
  // public url = 'https://192.168.18.113:4443/ldap_script.php'
  public url = 'http://192.168.18.113:8080/ldap_script.php'

  public AD_url = 'http://192.168.18.113:8080/test.php'
  public urlUserHistory: string = environment.baseUrl + 'v1/userHistory/'

  // Data
  public AD: AD[] = []
  public user: User
  public users: User[] = []
  public usersFiltered: User[] = []

  constructor(
    private http: HttpClient
  ) { }

  performGetEx(body: Form):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    }
    return this.http.post(this.url,body,httpOptions).pipe(
      tap((res) =>{
        console.log("AD ", res)
      })
    );
  }

  getAD(): Observable<AD[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    }
    return this.http.get<AD[]>(this.AD_url,httpOptions).pipe(
      tap((res) =>{
        console.log('User:', res)
      })
    )
  }

  create(body: Form): Observable<User> {
    return this.http.post<any>(this.urlUser, body).pipe(
      tap((res) => {
        console.log('User: ', res)
      })
    )
  }

  delete(id: string): Observable<User> {
    let urlDelete = this.urlUser + id + "/";
    return this.http.delete<User>(urlDelete).pipe(
      tap((res) => {
        console.log("delete: ", res);
      })
    );
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.urlUser).pipe(
      tap((res) => {
        console.log('Users: ', res)
      })
    )
  }

  getOne(id: String): Observable<User> {
    let urlUserOne = this.urlUser + id + '/'
    return this.http.get<User>(urlUserOne).pipe(
      tap((res) => {
        console.log('User: ', res)
      })
    )
  }

  update(id: String, body: Form): Observable<User> {
    let urlUserOne = this.urlUser + id + '/'
    return this.http.put<User>(urlUserOne, body).pipe(
      tap((res) => {
        console.log('User', res)
      })
    )
  }

  filter(field: String): Observable<User[]> {
    let urlFilter = this.urlUser + '?' + field
    return this.http.get<User[]>(urlFilter).pipe(
      tap((res) => {
        // console.log('Users', res)
      })
    )
  }

  postlogin(body): Observable<History> {
    return this.http.post<History>(this.urlUserHistory, body).pipe(
      tap((res) => {
      })
    );
  }

}
