import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductGenerationService } from 'src/app/shared/services/ProductRegistration/ProductGeneration.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import swal from 'sweetalert2';
import { ViewChild } from '@angular/core';
import { environment } from "src/environments/environment";
import { variableConfigureService } from 'src/app/shared/services/variableConfigure/variableConfigure.service';
import { SearchCounterService } from 'src/app/shared/services/SearchCounter/SearchCounter.service';
import { productCertificationService } from 'src/app/shared/services/productCertification/productCertification.service';
import { SLPService } from 'src/app/shared/services/SLP/SLP.service';


@Component({
  selector: 'app-imei',
  templateUrl: './imei.component.html',
  styleUrls: ['./imei.component.scss']
})
export class ImeiComponent implements OnInit {

  @ViewChild('captchaElem') captchaElem;
  @ViewChild('showResult') modalRef: any;
  infoTable = []
  variableTable : any
  TACTable = []
  SLPTable = []
  dataSLP: any
  searchIMEIForm: FormGroup
  SearchIMEIFormMore: FormGroup
  test: Date = new Date();
  date: number = new Date().getMonth() + 1
  imei
  focusImei
  cubaan : any
  is_enable = true

  siteKey: string = environment.reCaptchaSiteKey;
  size: string = "normal";
  lang: string = "en";
  theme: string = "light";
  type: string = "image";

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;


  ImeiMessages = {
    'IMEI': [
      { type: 'required', message: 'IMEI is required' },
    ],
  }

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl"
  };

  constructor(
    private router: Router,
    private productGenerationService: ProductGenerationService,
    private loadingBar: LoadingBarService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private variableConfigureService: variableConfigureService,
    private SearchCounterService: SearchCounterService,
    private productCertificationService: productCertificationService,
    private slpService: SLPService,
  ) { }

  ngOnInit() {
    this.disableSearch()
    
    this.searchIMEIForm = this.formBuilder.group({
      IMEI: new FormControl('' ,Validators.compose([
        Validators.required,
      ])),
      recaptcha: ["", Validators.required],
    }) 

    this.SearchIMEIFormMore = this.formBuilder.group({
      TAC: new FormControl('')
    })
    
  }

  navigatePage(path: String) {
    if (path == 'menu') {
      return this.router.navigate(['/global/public'])
    }
  }

  productGeneration() {
    this.loadingBar.start();
    // console.log("HTTP",this.searchIMEIForm.value.IMEI)
    let datafield = "IMEI="+this.searchIMEIForm.value.IMEI 
    this.productGenerationService.filter(datafield).subscribe(
      (res) => {
        this.loadingBar.complete();
        this.IMEICounter();
        this.infoTable=res['results']
        // console.log("wewe",this.infoTable.length)
        if (this.infoTable.length == 0){
          this.errorMessage();
          this.searchIMEIForm.reset()
          this.captchaElem.reloadCaptcha()
        }
        else {
          this.openModal(this.modalRef)
          let TACData = "TAC="+this.infoTable[0].TAC
          let SLPIDData = "SLP_ID="+this.infoTable[0].SLPID
          // console.log("SLPIDData",SLPIDData)
          this.productCertificationService.filter(TACData).subscribe(
            (res) => {
              this.TACTable = res['results'];
              // console.log(this.TACTable)
              this.searchIMEIForm.reset()
            },
            (err) => {
            }
          );

          this.slpService.filter(SLPIDData).subscribe(
            (res) => {
              this.SLPTable = res['results']
              this.dataSLP = this.SLPTable.slice(0,1)
              // console.log(this.dataSLP)
            }
          )

        }
      },
      (err) => {
        this.loadingBar.complete();
        this.errorMessage();
        this.searchIMEIForm.reset()
        this.captchaElem.reloadCaptcha()
      },
      // () => console.log("HTTP request completed.")
    );
  }

  IMEICounter(){
    let month = this.date
    let imeicounter = { Name:"IMEI", Counter:month};
    this.SearchCounterService.post(imeicounter).subscribe(
      (res) => {
        // console.log("+1 IMEI Counter")
      },
      (error) => {
        // console.error("err", error);
      }
    );
  }

  openModal(modalRef) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
    this.searchIMEIForm.reset()
    this.captchaElem.reloadCaptcha();
  }

  errorMessage() {
    swal.fire({
      title: "Oops...",
      text: "Please enter valid IMEI No.!",
      type: "error",
      timer: 3000,
    })  
  }

  // ReCaptcha
  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
    // this.cdr.detectChanges();
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
    // this.cdr.detectChanges();
    this.verifyRecaptcha(captchaResponse);
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
    // this.cdr.detectChanges();
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
    // this.cdr.detectChanges();
  }

  verifyRecaptcha(response: string) {
    let obj = {
      secret: environment.reCaptchaSecretKey,
      response: response,
    };
    this.productGenerationService.verify_recaptcha(obj).subscribe(
      (res) => {
        // console.log("res", res);
      },
      (err) => {
        // console.error("err", err);
      }
    );
  }

  disableSearch(){
    let varID = 'fcdd9cff-b8da-46b2-a36e-8701d1ada9d3';
    this.variableConfigureService.getOne(varID).subscribe(
      (res) => {
        this.variableTable = [res]
        this.variableTable = this.variableTable[0]
        // console.log("wewe", this.variableTable);
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      // () => console.log("HTTP request completed.")
    );
    // console.log()

  }
  

}
