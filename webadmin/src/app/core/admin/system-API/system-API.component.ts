import { Component, OnInit, OnDestroy, NgZone, TemplateRef } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MocksService } from 'src/app/shared/services/mocks/mocks.service';
import { ProductGenerationService } from 'src/app/shared/services/ProductRegistration/ProductGeneration.service';
import { emailTemplateService } from 'src/app/shared/services/emailTemplate/emailTemplate.service';
import { certifiedAgencyService } from 'src/app/shared/services/certifiedAgency/certifiedAgency.service';
import { CallAPIService } from 'src/app/shared/services/CallAPI/CallAPI.service';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';


am4core.useTheme(am4themes_animated);

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: 'app-system-API',
  templateUrl: './system-API.component.html',
  styleUrls: ['./system-API.component.scss']
})
export class SystemAPIComponent implements OnInit, OnDestroy {

  private chart: any
  private chart1: any
  private chart2: any
  tableTemp = [];
  tableRows = [];
  tableAgencyData = [];
  tableTemp2 = [];

  newAgencyForm: FormGroup
  editAgencyForm: FormGroup
  editTemplateForm: FormGroup

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered "
  };

  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableActiveRow: any;
  SelectionType = SelectionType;

  constructor(
    private zone: NgZone,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private mockService: MocksService,
    private modalService: BsModalService,
    private notifyService: NotifyService,
    private productGenerationService: ProductGenerationService,
    private emailTemplateService: emailTemplateService,
    private certifiedAgencyService: certifiedAgencyService,
    private CallAPIService: CallAPIService,
  ) { }

  ngOnInit() {
    // this.getCharts()
    this.getAgencyData()
    // this.getData()

    this.newAgencyForm = this.formBuilder.group({
      Id: new FormControl(""),
      ca_name: new FormControl(""),
      appoint_date: new FormControl(""),
      expiry_date: new FormControl(""),
      remarks: new FormControl(""),
      pic_name: new FormControl(""),
      ip_address: new FormControl(""),
      url: new FormControl(""),
      path: new FormControl(""),
      port: new FormControl(""),
      createdBy: new FormControl(""),
      is_active: new FormControl("")
    });

    this.editAgencyForm = this.formBuilder.group({
      Id: new FormControl(""),
      ca_name: new FormControl(""),
      ca_id: new FormControl(""),
      appoint_date: new FormControl(""),
      expiry_date: new FormControl(""),
      remarks: new FormControl(""),
      pic_name: new FormControl(""),
      ip_address: new FormControl(""),
      url: new FormControl(""),
      path: new FormControl(""),
      port: new FormControl(""),
      createdBy: new FormControl(""),
      is_active: new FormControl("")
    });

    this.editTemplateForm = this.formBuilder.group({
      Id: new FormControl(""),
      template_name: new FormControl(""),
      template_content: new FormControl(""),
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart2) {
        this.chart2.dispose()
      }
    })
  }

  openModal(modalRef: TemplateRef<any>, process: string, row) {
    if (process == "template"){
      console.log("loop template")
      this.editTemplateForm.patchValue({
        ...row,
      });
    }
    if (process == "create") {
      this.newAgencyForm.reset(); 
    } 
    if (process == "configure") {
      console.log("loop update")
      this.editAgencyForm.patchValue({...row,});
    }
    if (process == "update") {
      console.log("loop update")
      this.editAgencyForm.patchValue({...row,});
    }
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
  }

  addNewAgency() {
    // console.log(this.newAgencyForm.value)
    let expiryDate = new Date(this.newAgencyForm.value.expiry_date).toLocaleDateString();
    let appointDate = new Date(this.newAgencyForm.value.appoint_date).toLocaleDateString();
    this.newAgencyForm.value.expiry_date = expiryDate
    this.newAgencyForm.value.appoint_date = appointDate
    console.log(this.newAgencyForm.value)
    this.certifiedAgencyService.post(this.newAgencyForm.value).subscribe(
      (res) => {
        // Success
        // this.isLoading = false
        // this.successMessage();
        // this.loadingBar.complete();
        // this.successAlert("create project");
        console.log(res)
        this.addSuccessMessage()
        console.log("success")
      },
      (err) => {
        console.log(err)
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

  

  NewData() {
    console.log()
    this.tableRows.forEach(
      ((row) => {
        this.productGenerationService.post(row).subscribe(
          () => {

            console.log("success")
          },
          () => {

          },
          () => {

          }
        );
      })
      )
  }


  testSendEmail(){
    let obj= {
      template_code: "2",
      context: null,
    }
    console.log("Send Email function", obj)
    this.emailTemplateService.send_email(obj).subscribe(
      (res) => {
        console.log("Fail email has been sent");
      },
      (err) => {
        console.error("err", err);
      }
    );
  }

  getAgencyData() {
    this.loadingBar.start();
    this.certifiedAgencyService.get().subscribe(
      (res) => {
        // Success
        this.tableAgencyData = [...res]
        console.log("wewe",this.tableAgencyData.length);
        this.tableTemp2 = this.tableAgencyData.map((prop, key) => {
          return {
            ...prop,
            id: key
          };
        });
        // console.log
        this.loadingBar.complete();
      },
      () => {
        // Unsuccess
      },
      () => {
      })
  }

  configure(){
    console.log(this.editAgencyForm.value)
    console.log(this.editAgencyForm.value.Id)
    this.certifiedAgencyService.update(this.editAgencyForm.value,this.editAgencyForm.value.Id).subscribe(
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

  update(){
    console.log(this.editAgencyForm.value)
    console.log(this.editAgencyForm.value.Id)
    this.certifiedAgencyService.update(this.editAgencyForm.value,this.editAgencyForm.value.Id).subscribe(
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
        this.certifiedAgencyService.delete(row.Id).subscribe(
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
      text: "An email has been deleted!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.getAgencyData()
      }
    })
  }

  addSuccessMessage() {
    swal.fire({
      title: "Success",
      text: "A new agency has been created!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.modal.hide()
        this.getAgencyData()
        this.newAgencyForm.reset()
      }
    })
  }

  editMessage() {
    swal.fire({
      title: "Success",
      text: "An Agency Info has been update!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.modal.hide()
        this.getAgencyData()
        this.editAgencyForm.reset()
      }
    })
  }

  entryChange($event) {
    this.tableEntries = $event.target.value;
  }

  apitest(){
    let data = 'dummy-api/serial2.json'
    this.certifiedAgencyService.getAll(data).subscribe(
      (res)=>{
        console.log(res)
      }
    )
  }

  Test(){
    // buat foreach tuk ambil semua row dari datatable - buat masa skang dah mmg ada 1
    // buat 1 object untuk simpan body
    this.tableAgencyData.forEach (
      (row)=>{
        let body = {
          url: row['url']
        }
        console.log(body)
        this.certifiedAgencyService.APIcall(body).subscribe(
          (res)=> {
            console.log(res)
          },
          (err)=> {
            console.log(err)
          }
        )
      }
    )
  }

  errorMessage() {
    let title = 'Error'
    let message = 'cant connect with API '
    this.notifyService.openToastrHttp(title, message)
  }

}
