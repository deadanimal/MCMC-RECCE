import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { MasterDataService } from 'src/app/shared/services/masterData/masterData.service';
import { environment } from "src/environments/environment";
import { NotifyService } from 'src/app/shared/handler/notify/notify.service';
import Swal from 'sweetalert2';
import { variableConfigureService } from 'src/app/shared/services/variableConfigure/variableConfigure.service';
import { SearchCounterService } from 'src/app/shared/services/SearchCounter/SearchCounter.service';
import { productCertificationService } from 'src/app/shared/services/productCertification/productCertification.service';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-productInfo',
  templateUrl: './productInfo.component.html',
  styleUrls: ['./productInfo.component.scss']
})
export class ProductInfoComponent implements OnInit {

  @ViewChild('captchaElem') captchaElem;
  @ViewChild('showResult') modalRef: any;
  infoTable = []
  variableTable: any
  searchPRODUCTForm: FormGroup
  test: Date = new Date();
  product = null
  model = null 
  focusUsername
  focustype
  searchType:any

  siteKey: string = environment.reCaptchaSiteKey;
  size: string = "normal";
  lang: string = "en";
  theme: string = "light";
  type: string = "image";

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  loginFormMessages = {
    'PRODUCT': [
      { type: 'required', message: "Brand is required"},
    ],
    'TYPE': [
      { type: 'required', message: 'Please choose type' },
    ]
  }

  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  SelectionType = SelectionType;

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-xl"
  };

  

  constructor(
    private router: Router,
    private masterDataService: MasterDataService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
    private variableConfigureService: variableConfigureService,
    private SearchCounterService: SearchCounterService,
    private productCertificationService: productCertificationService,
  ) { }

  ngOnInit() {

    this.disableSearch()

    this.searchPRODUCTForm = this.formBuilder.group({
      PRODUCT: new FormControl('' ,Validators.compose([
        Validators.required,
      ])),
      MODEL: new FormControl(''),
      captcha: new FormControl(),
      TYPE: new FormControl('', Validators.compose([
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
    console.log("form",this.searchPRODUCTForm.value.PRODUCT, this.searchPRODUCTForm.value.MODEL)
    let datafield = "Brand="+this.searchPRODUCTForm.value.PRODUCT
    let datafield2 = "Brand="+this.searchPRODUCTForm.value.PRODUCT+"&Model="+this.searchPRODUCTForm.value.MODEL
    console.log("wewe",datafield2)
    this.loadingBar.start()
    if (datafield2=="Brand="+this.searchPRODUCTForm.value.PRODUCT+"&Model="+null){
    this.productCertificationService.filter(datafield).subscribe(
      (res) => {
        this.infoTable=res;
        console.log("if loop 1");
        this.loadingBar.complete();
        if (this.infoTable.length == 0){
          this.errorMessage();
          this.searchPRODUCTForm.reset()
          this.captchaElem.reloadCaptcha()
        }
        else{
          this.openModal(this.modalRef)
        }
      },
      (err) => {
        console.log("HTTP Error", err);
        this.loadingBar.complete();
        this.errorMessage();
        this.searchPRODUCTForm.reset()
        this.captchaElem.reloadCaptcha()

      },
      () => console.log("HTTP request completed.")
    );
    }
    else {
      this.productCertificationService.filter(datafield2).subscribe(
        (res) => {
          this.infoTable=res;
          console.log("if loop 2");
          this.loadingBar.complete();
          if (this.infoTable.length == 0){
            this.errorMessage();
            this.searchPRODUCTForm.reset()
            this.captchaElem.reloadCaptcha()
          }
          else{
            this.openModal(this.modalRef)
          }
        },
        (err) => {
          console.log("HTTP Error", err);
          this.loadingBar.complete();
          this.errorMessage();
          this.searchPRODUCTForm.reset()
          this.captchaElem.reloadCaptcha()
        },
        () => console.log("HTTP request completed.")
      );
      }   
  }

  productGeneration2() {
    this.loadingBar.start()
    console.log("form",this.searchPRODUCTForm.value.PRODUCT, this.searchPRODUCTForm.value.MODEL)
    let datafield = "Brand="+this.searchPRODUCTForm.value.PRODUCT
    let datafield2 = "Brand="+this.searchPRODUCTForm.value.PRODUCT+"&Model="+this.searchPRODUCTForm.value.MODEL
    console.log("wewe",datafield, "Model="+null)
    if (datafield2=="Brand="+this.searchPRODUCTForm.value.PRODUCT+"&Model="+null){
    this.productCertificationService.filterMix(datafield).subscribe(
      (res) => {
        this.infoTable=res;
        console.log("if loop 1");
        this.loadingBar.complete();
        if (this.infoTable.length == 0){
          this.errorMessage();
          this.searchPRODUCTForm.reset()
          this.captchaElem.reloadCaptcha()
        }
        else{
          this.openModal(this.modalRef)
        }
      },
      (err) => {
        console.log("HTTP Error", err);
        this.loadingBar.complete();
        this.errorMessage();
        this.searchPRODUCTForm.reset()
        this.captchaElem.reloadCaptcha()
      },
      () => console.log("HTTP request completed.")
    );
    }
    else {
      this.productCertificationService.filterMix(datafield2).subscribe(
        (res) => {
          this.infoTable=res;
          console.log("if loop 2");
          this.loadingBar.complete();
          if (this.infoTable.length == 0){
            this.errorMessage();
            this.captchaElem.reloadCaptcha()
          }
          else {
            this.openModal(this.modalRef)
          }
          
        },
        (err) => {
          console.log("HTTP Error", err);
          this.loadingBar.complete();
          this.errorMessage();
          this.captchaElem.reloadCaptcha()
        },
        () => console.log("HTTP request completed.")
      );
      }   
  }

  LabelCounter(){
    let imeicounter = { Name:"PRODUCT", Counter:"4"};
    this.SearchCounterService.post(imeicounter).subscribe(
      (res) => {
        console.log("+1 PRODUCT Counter")
      },
      (error) => {
        console.error("err", error);
      }
    );
  }


  changeDropdown(event){
    if (event=="any"){
      console.log(event,'any loop')
    }
    else {
      console.log('exact loop')
    }
  }

  buttonSubmit(){
    console.log(this.searchType)
    this.LabelCounter();
    console.log('button pressed')
    if (this.searchType=="any"){
      this.anySearch();
      console.log('any loop')
    }
    else {
      this.exactSearch();
      console.log('exact loop')
    }
  }

  anySearch(){
    console.log('anySearch')
    this.productGeneration2();
  }

  exactSearch(){
    this.productGeneration()
    console.log('exactSearch')
  }

  openModal(modalRef) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
    this.searchPRODUCTForm.reset()
    this.captchaElem.reloadCaptcha()
 

  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }


  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  errorMessage() {
    Swal.fire({
      title: "Oops...",
      text: "Please enter valid brand/model!",
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
    let varID = 'd8991bb4-07be-4264-8dfb-3da69a4d2bf7';
    this.variableConfigureService.getOne(varID).subscribe(
      (res) => {
        this.variableTable = [res]
        this.variableTable = this.variableTable[0]
        console.log("wewe", this.variableTable);
        console.log("array",this.variableTable[0],[2])
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
