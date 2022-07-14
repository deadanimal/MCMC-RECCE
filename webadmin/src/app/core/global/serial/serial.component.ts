import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MasterDataService } from 'src/app/shared/services/masterData/masterData.service';
import { environment } from "src/environments/environment";
import { LoadingBarService } from '@ngx-loading-bar/core';
import swal from 'sweetalert2';
import { variableConfigureService } from 'src/app/shared/services/variableConfigure/variableConfigure.service';
import { SearchCounterService } from 'src/app/shared/services/SearchCounter/SearchCounter.service';
import { productCertificationService } from 'src/app/shared/services/productCertification/productCertification.service';
import { ProductGenerationService } from 'src/app/shared/services/ProductRegistration/ProductGeneration.service';

@Component({
  selector: 'app-serial',
  templateUrl: './serial.component.html',
  styleUrls: ['./serial.component.scss']
})
export class SerialComponent implements OnInit {

  @ViewChild('captchaElem') captchaElem;
  @ViewChild('showResult') modalRef: any;
  infoTable = []
  variableTable: any
  TACTable = []
  searchSERIALForm: FormGroup
  test: Date = new Date();
  serial
  focusSerial
  

  siteKey: string = environment.reCaptchaSiteKey;
  size: string = "normal";
  lang: string = "en";
  theme: string = "light";
  type: string = "image";

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  SerialMessages = {
    'SERIAL': [
      { type: 'required', message: 'Serial Number is required' },
    ],
  }

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl"
  };

  constructor(
    private router: Router,
    private masterDataService: MasterDataService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
    private variableConfigureService: variableConfigureService,
    private SearchCounterService: SearchCounterService,
    private productCertificationService: productCertificationService,
    private ProductGenerationService: ProductGenerationService,

  ) { }

  ngOnInit() {
    this.disableSearch()

    this.searchSERIALForm = this.formBuilder.group({
      SERIAL: new FormControl('' ,Validators.compose([
        Validators.required,
      ])),
      recaptcha: ["", Validators.required],
    })
  }

  navigatePage(path: String) {
    if (path == 'menu') {
      return this.router.navigate(['/global/public'])
    }
  }

  productGeneration() {
    console.log("HTTP",this.searchSERIALForm.value.SERIAL)
    let datafield = "SerialNo="+this.searchSERIALForm.value.SERIAL
    this.loadingBar.start(); 
    this.SerialCounter();
    this.ProductGenerationService.filter(datafield).subscribe(
      (res) => {
        this.infoTable=res
        console.log("wewe",this.infoTable)
        this.loadingBar.complete();
        if (this.infoTable.length == 0){
          this.errorMessage();
          this.searchSERIALForm.reset()
          this.captchaElem.reloadCaptcha()
          
        }
        else {
          this.openModal(this.modalRef)
          let TACData = "TAC="+this.infoTable[0].TAC
          this.productCertificationService.filter(TACData).subscribe(
            (res) => {
              this.TACTable = res
              console.log(this.TACTable)
            }
          )
        }

      },
      (err) => {
        this.loadingBar.complete();
        this.errorMessage();
        this.searchSERIALForm.reset()
        this.captchaElem.reloadCaptcha()

      },
      () => console.log("HTTP request completed.")
    );
  }

  SerialCounter(){
    let imeicounter = { Name:"SERIAL", Counter:"4"};
    this.SearchCounterService.post(imeicounter).subscribe(
      (res) => {
        console.log("+1 SERIAL Counter")
      },
      (error) => {
        console.error("err", error);
      }
    );
  }

  openModal(modalRef) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
    this.searchSERIALForm.reset()
    this.captchaElem.reloadCaptcha()
  }

  errorMessage() {
    swal.fire({
      title: "Oops...",
      text: "Please enter valid Serial No.!",
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
    this.masterDataService.verify_recaptcha(obj).subscribe(
      (res) => {
        // console.log("res", res);
      },
      (err) => {
        console.error("err", err);
      }
    );
  }

  disableSearch(){
    let varID = '5a122e01-c6f3-494d-b5a3-3967480096df';
    this.variableConfigureService.getOne(varID).subscribe(
      (res) => {
        this.variableTable = [res]
        this.variableTable = this.variableTable[0]
        console.log("wewe", this.variableTable);
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => console.log("HTTP request completed.")
    );
    console.log()

  }

}