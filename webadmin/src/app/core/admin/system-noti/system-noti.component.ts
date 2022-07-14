import { UsersService } from './../../../shared/services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, OnDestroy, NgZone, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EmailNotiService } from 'src/app/shared/services/emailNoti/emailNoti.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { emailTemplateService } from 'src/app/shared/services/emailTemplate/emailTemplate.service';
import swal from "sweetalert2";
UsersService

am4core.useTheme(am4themes_animated);

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: 'app-system-noti',
  templateUrl: './system-noti.component.html',
  styleUrls: ['./system-noti.component.scss']
})
export class SystemNotiComponent implements OnInit {

  editEnabled: boolean = false
  newEmailForm: FormGroup
  editEmailForm: FormGroup
  editTemplateForm: FormGroup
  searchNOTIForm: FormGroup
  editForm = {email:"", Id:''}
  infoTable = []
  emailTable= []
  templateTable = []
  entries: number = 10;
  new: boolean = false
  exist: boolean = false

  private chart: any
  private chart1: any
  private chart2: any

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-lg"
  };

  modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button

      ["link"], // link and image, video
    ],
  };

  // Table
  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  tableRows: any[] = [];
  SelectionType = SelectionType;

  constructor(
    private formBuilder: FormBuilder,
    private EmailNotiService: EmailNotiService,
    private zone: NgZone,
    private modalService: BsModalService,
    private emailTemplateService: emailTemplateService,
    private spinner: NgxSpinnerService,
    private userService: UsersService,
  ) {
    this.emailGet()
    this.emailTemplateGet()
  }

  ngOnInit() {
    this.newEmailForm = this.formBuilder.group({
      Id: new FormControl(""),
      email: new FormControl(""),
    });

    this.editEmailForm = this.formBuilder.group({
      Id: new FormControl(""),
      email: new FormControl(""),
    });
    
    this.editTemplateForm = this.formBuilder.group({
      Id: new FormControl(""),
      template_name: new FormControl(""),
      template_content: new FormControl(""),
    });
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose()
      }
      if (this.chart1) {
        this.chart1.dispose()
      }
      if (this.chart2) {
        this.chart2.dispose()
      }
    })
  }


  emailGet() {
    this.EmailNotiService.get().subscribe(
      (res) => {
        this.infoTable=res
        console.log("wewe",this.infoTable)
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => console.log("HTTP request completed.")
    );
  }

  getUserList(){
    this.userService.getAll().subscribe(
      (res)=> {
        this.emailTable = res
      },
      (err) => {
        console.log(err)
      }
    )
  }

  toggleEmail(event){
    this.getUserList()
    console.log(event)
    if(event ==='new'){
      this.new = true
      this.exist = false
    }
    else{
      this.exist = true
      this.new = false
    }
  }

  emailTemplateGet() {
    this.emailTemplateService.get().subscribe(
      (res) => {
        this.templateTable=res
        console.log("wewe",this.templateTable)
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => console.log("HTTP request completed.")
    );
  }

  newEmail() {
    console.log("qqqq");
    console.log(this.newEmailForm.value)
    this.spinner.show()
    this.EmailNotiService.post(this.newEmailForm.value).subscribe(
      () => {
        // Success
        // this.isLoading = false
        // this.successMessage();
        // this.loadingBar.complete();
        // this.successAlert("create project");
        this.spinner.hide()
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

  update(){
    console.log(this.editEmailForm.value.email)
    console.log(this.editEmailForm.value.Id)
    this.spinner.show
    this.EmailNotiService.update({'email': this.editEmailForm.value.email},this.editEmailForm.value.Id).subscribe(
      (res) => {
        console.log("success",res)
        this.spinner.hide()
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

  template(){
    console.log(this.editTemplateForm.value.template_name)
    console.log(this.editTemplateForm.value.Id)
    this.spinner.show()
    this.emailTemplateService.update({ 'template_content': this.editTemplateForm.value.template_content },this.editTemplateForm.value.Id).subscribe(
      (res) => {
        // Success
        // this.isLoading = false
        // this.successMessage();
        // this.loadingBar.complete();
        // this.successAlert("create project");
        // this.editMessage()
        console.log("success",res)
        this.spinner.hide()
        this.editTemplateMessage()
      },
      () => {
        // Failed
        // this.isLoading = false
        // this.successMessage();
        // this.errorAlert("edit");
      },
      () => {
        // After
        // this.notifyService.openToastr("Success", "Welcome back");
        // this.navigateHomePage();
      }
    );
  
  }

  openModal(modalRef: TemplateRef<any>, process: string, row) {
    if (process == "template"){
      console.log("loop template")
      this.editTemplateForm.patchValue({
        ...row,
      });
    }
    if (process == "create") {
      this.newEmailForm.reset(); 
    } 
    if (process == "update") {
      console.log("loop update")
      this.editEmailForm.patchValue({...row,});
    }
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
  }

  // delete email function
  confirm(row) {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure to delete this title?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.value) {
        console.log(row.Id)
        this.spinner.show()
        this.EmailNotiService.delete(row.Id).subscribe(
        (res) => {
        console.log("res", res);
        this.spinner.hide()
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
      text: "An email has been deleted!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.emailGet()
      }
    })
  }

  editMessage() {
    swal.fire({
      title: "Success",
      text: "An email has been update!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.modal.hide()
        this.emailGet()
        this.editEmailForm.reset()
      }
    })
  }

  editTemplateMessage() {
    swal.fire({
      title: "Success",
      text: "A template has been update!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.modal.hide()
        this.emailTemplateGet()
        this.editEmailForm.reset()
      }
    })
  }

  register() {
    swal.fire({
      title: "Success",
      text: "A new title has been created!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.modal.hide()
        this.emailGet()
        this.newEmailForm.reset()
      }
    })
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }
  
  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  testSendEmail(){
    let obj= {
      template_code: "1",
      context: null,
    }
    console.log("Send Email function", obj)
    this.emailTemplateService.send_email(obj).subscribe(
      (res) => {
        console.log("success email has been sent");
      },
      (err) => {
        console.error("err", err);
      }
    );
  }
}
