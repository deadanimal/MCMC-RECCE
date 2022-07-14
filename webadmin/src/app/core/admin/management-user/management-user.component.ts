import { Component, OnInit, OnDestroy, NgZone, TemplateRef } from '@angular/core';
import { User } from 'src/assets/mock/admin-user/users.model'
import { MocksService } from 'src/app/shared/services/mocks/mocks.service';
UsersService

import * as moment from 'moment';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
am4core.useTheme(am4themes_animated);

import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { error } from 'selenium-webdriver';
import { JwtHelperService } from '@auth0/angular-jwt';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-management-user',
  templateUrl: './management-user.component.html',
  styleUrls: ['./management-user.component.scss']
})
export class ManagementUserComponent implements OnInit, OnDestroy {


  newUserForm: FormGroup
  editUserForm: FormGroup
  // Table
  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableTemp = []
  infoTable = []
  tableActiveRow: any;
  tableRows: User[] = []
  SelectionType = SelectionType;

  UserID
  userData


  // Chart
  chart: any
  chartJan: number = 0
  chartFeb: number = 0
  chartMar: number = 0
  chartApr: number = 0
  chartMay: number = 0
  chartJun: number = 0
  chartJul: number = 0
  chartAug: number = 0
  chartSep: number = 0
  chartOct: number = 0
  chartNov: number = 0
  chartDec: number = 0

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-sm"
  };

  // Form
  registerForm: FormGroup
  registerFormMessages = {
    'name': [
      { type: 'required', message: 'Name is required' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'A valid email is required' }
    ]
  }

  constructor(
    private mockService: MocksService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private zone: NgZone
  ) {
    // this.getData()
    this.getToken()
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ]))
    })

    this.newUserForm = this.formBuilder.group({
      id: new FormControl(""),
      username: new FormControl(""),
      name: new FormControl(""),
      user_type: new FormControl(""),
      is_active: new FormControl("")
    })

    this.editUserForm = this.formBuilder.group({
      id: new FormControl(""),
      username: new FormControl(""),
      name: new FormControl(""),
      user_type: new FormControl(""),
      is_active: new FormControl("")
    })

  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose()
      }
    })
  }

  openModal(modalRef: TemplateRef<any>, process: string, row) {
    if (process == "update") {
      console.log("loop update")
      this.editUserForm.patchValue({...row,});
    }
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  openModal2(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
    this.registerForm.reset()
  }

  // confirm() {
  //   swal.fire({
  //     title: "Confirmation",
  //     text: "Are you sure to create this new user?",
  //     type: "info",
  //     buttonsStyling: false,
  //     confirmButtonClass: "btn btn-info",
  //     confirmButtonText: "Confirm",
  //     showCancelButton: true,
  //     cancelButtonClass: "btn btn-danger",
  //     cancelButtonText: "Cancel"
  //   }).then((result) => {
  //     if (result.value) {
  //       this.register()
  //     }
  //   })
  // }

  confirm(row) {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure to delete this user?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.value) {
        console.log(row.id)
        this.usersService.delete(row.id).subscribe(
        (res) => {
        console.log("res", res);
        this.deleteMessage()
        },
        (err) => {
        },
        );
      }
    })
  }
  
  deleteMessage() {
    swal.fire({
      title: "Success",
      text: "An user has been deleted!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.GetUser()
      }
    })
  }

  register() {
    swal.fire({
      title: "Success",
      text: "A new user has been created!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.modal.hide()
        this.registerForm.reset()
      }
    })
  }

  GetUser(){
    console.log("GetUser",this.userData)
    if(this.userData == "AD"){
      this.usersService.getAll().subscribe(
        (res) =>{
          this.infoTable=res
        }
      ) 
    }
    else{
      this.usersService.filter('user_type=US').subscribe(
        (res) =>{
          this.infoTable=res
        }
      )
    }
  }

  update(){
    console.log(this.editUserForm.value)
    console.log(this.editUserForm.value.id)
    this.usersService.update(this.editUserForm.value.id, this.editUserForm.value).subscribe(
      (res) => {
        console.log("success",res)
        this.editMessage()
      },
      () => {
  
      },
      () => {
        // After
        // this.notifyService.openToastr("Success", "Welcome back");
        // this.navigateHomePage();
      }
    );
  
  }

  editMessage() {
    swal.fire({
      title: "Success",
      text: "An User Info has been update!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.modal.hide()
        this.GetUser()
        this.editUserForm.reset()
      }
    })
  }

  AssignUser(){
    console.log(this.newUserForm.value)
    this.usersService.create(this.newUserForm.value).subscribe(
      () => {
        // Success
        // this.isLoading = false
        // this.successMessage();
        // this.loadingBar.complete();
        // this.successAlert("create project");
        this.register()
        console.log("success")
      },
      () => {
        // Failed
        // this.isLoading = false
        // this.successMessage();
        // this.errorAlert("edit");
      },
      () => {
        // this.notifyService.openToastr("Success", "Welcome back");
        // this.navigateHomePage();
      }
    );
  }

  entryChange($event) {
    this.tableEntries = +$event.target.value;
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  getToken() {
    let jwtHelper: JwtHelperService = new JwtHelperService()
    const token = localStorage.getItem('accessToken');
    console.log('token = ', token)

    let decodedToken = jwtHelper.decodeToken(token)
    this.UserID = decodedToken.user_id
    console.log('user ID = ', this.UserID)

    this.usersService.getOne(this.UserID).subscribe(
      (res)=>{
        this.userData = res['user_type']
        console.log (this.userData)

      },
      (err) => {

      },
      () =>{
        this.GetUser()
      }
    )

  }
  

}
