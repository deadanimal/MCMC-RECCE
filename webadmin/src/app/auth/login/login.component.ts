import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { JwtService } from 'src/app/shared/handler/jwt/jwt.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Image
  imgLogo = 'assets/img/logo/MCMC New Logo_Colour.png'

  // Form
  focusUsername
  focusPassword
  userData
  
  dataUser=[]
  user_type: any
  active: any
  loginForm: FormGroup
  loginFormMessages = {
    'username': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email'}
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minLength', message: 'Password must have at least 8 characters' }
    ]
  }

  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private router: Router,
    private jwtService: JwtService,
    private UsersService: UsersService,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ]))
    })

    
  }

  

  login() {
    this.loadingBar.start()
    //this.loadingBar.complete()
    //this.successMessage()
    this.authService.obtainToken(this.loginForm.value).subscribe(
      (res) => {
        this.loadingBar.complete();
        this.successMessage();
        
        this.navigatePage("dashboard-admin");
      },
      (err) => {
        this.loadingBar.complete();
        this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => console.log("HTTP request completed.")
    );
    // if (this.loginForm.value.username == 'admin') {
    //   this.authService.userRole = 1
    //   this.navigatePage('dashboard-admin')
    // }
    // else if (this.loginForm.value.username == 'user') {
    //   this.authService.userRole = 2
    //   this.navigatePage('dashboard-user')
    // }
    
  }

  ad_login(){
    let data =this.loginForm.value
    this.jwtService.destroyToken()
    this.UsersService.performGetEx(data).subscribe(
      (res) =>{
        let test = {success:1, userId:123}
        // console.log("response ",test)
        // console.log(res,test)
        if (JSON.stringify(res) === JSON.stringify(test)){
          this.loginRoles()
        }
        else {
          this.errorMessage()
        }
      },
      (err) => {
        console.log(err)
        this.errorMessage()
      }
    );
  }

  loginRoles(){
    let username="name="+this.loginForm.value.username
    this.authService.customLogin(this.loginForm.value) .subscribe(
    (res)=>{
      
    },
    (err)=>{
      console.log(err)
    },
    ()=>{
      this.authService.getUserDetail().subscribe((res) => {
        this.dataUser=res
        console.log("loginroles",this.dataUser)
        this.user_type = this.dataUser['user_type']
        this.active = this.dataUser['is_active']
      if (this.user_type == 'AD' && this.active == true ){
        this.authService.userRole = 1
        this.successMessage()
        this.navigatePage("dashboard-admin")
      }
      else if (this.user_type == 'US' && this.active == true){
        this.authService.userRole = 2
        this.successMessage()
        this.navigatePage("dashboard-admin")
      }
      }, (err) => {},
      () => {
        this.UsersService.getOne(this.authService.userID).subscribe(
          (res)=>{
            this.userData = res
            console.log('userdata',this.userData)
            const obj = {
              history_user:this.userData,
              history_type:'++'
            }
            console.log("test",obj)
            this.UsersService.postlogin(obj).subscribe(
              (data) => {
                console.log(data)
              },
              (err) => {
                console.log("err", err)
              },
            )
          }
        )
      })
    }
    )
    this.OO()
  }

  OO(){

    if(this.dataUser==[0]){
      this.errorMessage2() 
    }
    else {
      console.log("no prob")
    }
  }

  navigatePage(path: String) {
    if (path == 'login') {
      return this.router.navigate(['/auth/login'])
    }
    else  if (path == 'forgot') {
      return this.router.navigate(['/auth/forgot'])
    }
    else  if (path == 'register') {
      return this.router.navigate(['/auth/register'])
    }
    else if (path == 'dashboard-admin') {
      return this.router.navigate(['/admin/dashboard'])
    }
    else if (path == 'dashboard-user') {
      return this.router.navigate(['/user/dashboard'])
    }
  }

  successMessage() {
    let title = 'Success'
    let message = 'Logging in...'
    this.notifyService.openToastr(title, message)
  }


  errorMessage() {
    let title = 'Error'
    let message = 'Cant Logging in'
    this.notifyService.openToastrHttp(title, message)
  }

  errorMessage2() {
    let title = 'Unauthorized'
    let message = 'Contact admin for more information'
    this.notifyService.openToastrHttp(title, message)
  }
  

}
function $http(arg0: { url: string; method: string; data: { id: number; name: string; }; }) {
  throw new Error('Function not implemented.');
}

function $httpParamSerializerJQLike(data: { ada: any; }) {
  throw new Error('Function not implemented.');
}

function success(arg0: (response: any) => void) {
  throw new Error('Function not implemented.');
}

