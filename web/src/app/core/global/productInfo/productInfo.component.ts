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
  marketName: boolean = true
  searchPRODUCTForm: FormGroup
  test: Date = new Date();
  product = null
  model = null
  pagerNo
  pagerNo2
  pagerNo3
  focusUsername
  focustype
  searchType:any

  search_mode:any = "";

  // date counter
  date: number = new Date().getMonth() + 1

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
  
  curPageSize = 20;
  TotalCount
  tableEntries: number = 20;
  tableSelected: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  SelectionType = SelectionType;

  datafield
  datafield2

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
    // console.log("form",this.searchPRODUCTForm.value.PRODUCT, this.searchPRODUCTForm.value.MODEL)
    this.datafield = "Brand="+this.searchPRODUCTForm.value.PRODUCT
    this.datafield2 = "Brand="+this.searchPRODUCTForm.value.PRODUCT+"&MarketingName="+this.searchPRODUCTForm.value.MODEL
    // console.log("wewe",this.datafield2)
    this.loadingBar.start()
    if (this.datafield2=="Brand="+this.searchPRODUCTForm.value.PRODUCT+"&MarketingName="+null){

      // first situation (no marketing name)
    this.search_mode = "TYPE1";
    this.productCertificationService.filter(this.datafield).subscribe(
      (res) => {
        this.infoTable=res['results'];
        this.TotalCount = res["count"]
        // console.log("if loop 1");
        this.loadingBar.complete();
        if (this.infoTable.length == 0){
          this.errorMessage();
          this.searchPRODUCTForm.reset()
          this.captchaElem.reloadCaptcha()
        }
        else{
          this.openModal(this.modalRef)
          this.pagerNo=this.datafield
        }
      },
      (err) => {
        // console.log("HTTP Error", err);
        this.loadingBar.complete();
        this.errorMessage();
        this.searchPRODUCTForm.reset()
        this.captchaElem.reloadCaptcha()

      },
      // () => console.log("HTTP request completed.")
    );
    }
    else {
      this.search_mode = "TYPE2";
      this.productCertificationService.filter(this.datafield2).subscribe(
        (res) => {
          this.infoTable=res['results'];
          this.TotalCount = res["count"]
          // console.log("if loop 2");
          this.loadingBar.complete();
          if (this.infoTable.length == 0){
            this.marketName=false
            // console.log('MARKET', this.marketName)
            this.datafield2 = "Brand__icontains="+this.searchPRODUCTForm.value.PRODUCT+"&Model__icontains="+this.searchPRODUCTForm.value.MODEL
            // console.log('model data', this.datafield2)
            this. productCertificationService.filter(this.datafield2).subscribe(
              (res) => {
                this.infoTable=res['results'];
                this.TotalCount = res["count"]
                if (this.infoTable.length == 0){
                  this.loadingBar.complete();
                  this.errorMessage();
                  this.captchaElem.reloadCaptcha()
                }
                else {
                  this.loadingBar.complete();
                  this.openModal(this.modalRef)
                  this.pagerNo=this.datafield2
                }
              } 
            )
          }
          else {
            this.loadingBar.complete();
            this.openModal(this.modalRef)
            this.pagerNo=this.datafield2
          }
        },
        (err) => {
          // console.log("HTTP Error", err);
          this.loadingBar.complete();
          this.errorMessage();
          this.searchPRODUCTForm.reset()
          this.captchaElem.reloadCaptcha()
        },
        // () => console.log("HTTP request completed.")
      );
      }
  }

  productGeneration2() {
    this.loadingBar.start()
    // console.log("form",this.searchPRODUCTForm.value.PRODUCT, this.searchPRODUCTForm.value.MODEL)
    this.datafield = "Brand__icontains="+this.searchPRODUCTForm.value.PRODUCT
    this.datafield2 = "Brand__icontains="+this.searchPRODUCTForm.value.PRODUCT+"&MarketingName__icontains="+this.searchPRODUCTForm.value.MODEL
    // console.log("wewe",this.datafield, "Model="+null)
    if (this.datafield2=="Brand__icontains="+this.searchPRODUCTForm.value.PRODUCT+"&MarketingName__icontains="+null){
      this.search_mode = "TYPE1";
      this.productCertificationService.filter(this.datafield).subscribe(
      (res) => {
        this.infoTable=res['results'];
        this.TotalCount = res["count"]
        // console.log("if loop 1");
        this.loadingBar.complete();
        if (this.infoTable.length == 0){
          this.errorMessage();
          this.searchPRODUCTForm.reset()
          this.captchaElem.reloadCaptcha()
        }
        else{
          this.openModal(this.modalRef)
          this.pagerNo=this.datafield
        }
      },
      (err) => {
        // console.log("HTTP Error", err);
        this.loadingBar.complete();
        this.errorMessage();
        this.searchPRODUCTForm.reset()
        this.captchaElem.reloadCaptcha()
      },
      // () => console.log("HTTP request completed.")
    );
    }
    else {
      this.search_mode = "TYPE2";
      this.productCertificationService.filter(this.datafield2).subscribe(
        (res) => {
          this.infoTable=res['results'];
          this.TotalCount = res["count"]
          // console.log("if loop 2");
          if (this.infoTable.length == 0){
            this.marketName=false
            // console.log('MARKET', this.marketName)
            this.datafield2 = "Brand__icontains="+this.searchPRODUCTForm.value.PRODUCT+"&Model__icontains="+this.searchPRODUCTForm.value.MODEL
            // console.log('model data', this.datafield2)
            this. productCertificationService.filter(this.datafield2).subscribe(
              (res) => {
                this.infoTable=res['results'];
                this.TotalCount = res["count"]
                if (this.infoTable.length == 0){
                  this.loadingBar.complete();
                  this.errorMessage();
                  this.captchaElem.reloadCaptcha()
                }
                else {
                  this.loadingBar.complete();
                  this.openModal(this.modalRef)
                  this.pagerNo=this.datafield2
                }
              } 
            )
          }
          else {
            this.loadingBar.complete();
            this.openModal(this.modalRef)
            this.pagerNo=this.datafield2
          }

        },
        (err) => {
          // console.log("HTTP Error", err);
          this.loadingBar.complete();
          this.errorMessage();
          this.captchaElem.reloadCaptcha()
        },
        // () => console.log("HTTP request completed.")
      );
      }
  }

  onFooterPage($event) {
    this.loadingBar.start()

    // console.log("pagination = ", this.pagerNo)
    // console.log("pagination = ", this.pagerNo)

    let prefix = "";
    if (this.search_mode == "TYPE1") {
      prefix = this.datafield;
    } else {
      prefix = this.datafield2;
    }


    // console.log("prefix", prefix);
    this.productCertificationService.get_pagination("?" + prefix+"&page="+$event.page).subscribe(
      (res) => {
        this.infoTable = []
        this.infoTable = res["results"];
        this.TotalCount = res["count"];
        this.loadingBar.complete()
      },
      (err) => {
        // console.log("HTTP Error", err)
        this.loadingBar.complete()
      },
      () => {
      }
    );
  }

  LabelCounter(){
    const month = this.date
    const imeicounter = { Name:"PRODUCT", Counter:month};
    this.SearchCounterService.post(imeicounter).subscribe(
      (res) => {
        // console.log("+1 PRODUCT Counter")
      },
      (error) => {
        // console.error("err", error);
      }
    );
  }


  changeDropdown(event){
    if (event=="any"){
      // console.log(event,'any loop')
    }
    else {
      // console.log('exact loop')
    }
  }

  buttonSubmit(){
    // console.log(this.searchType)
    this.LabelCounter();
    // console.log('button pressed')
    if (this.searchType=="any"){
      this.anySearch();
      // console.log('any loop')
    }
    else {
      this.exactSearch();
      // console.log('exact loop')
    }
  }

  anySearch(){
    // console.log('anySearch')
    this.productGeneration2();
  }

  exactSearch(){
    this.productGeneration()
    // console.log('exactSearch')
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
    this.tableEntries = +$event.target.value;
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
    const obj = {
      secret: environment.reCaptchaSecretKey,
      response,
    };
    this.masterDataService.verify_recaptcha(obj).subscribe(
      (res) => {
        // console.log("res", res);
      },
      (err) => {
        // console.error('err', err);
      }
    );
  }

  disableSearch(){
    const varID = 'f4fbed11-5828-4c51-8992-50396b091aba';
    this.variableConfigureService.getOne(varID).subscribe(
      (res) => {
        this.variableTable = [res]
        this.variableTable = this.variableTable[0]
        // console.log('wewe', this.variableTable);
        // console.log('array',this.variableTable[0],[2])
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      // () => console.log('HTTP request completed.')
    );
    // console.log()

  }

}

