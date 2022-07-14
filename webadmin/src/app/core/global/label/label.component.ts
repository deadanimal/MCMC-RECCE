import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { masterTable } from 'src/app/shared/services/masterData/masterData.model';
import { MasterDataService } from 'src/app/shared/services/masterData/masterData.service';
import Swal from 'sweetalert2';
import { environment } from "src/environments/environment";
import { variableConfigureService } from 'src/app/shared/services/variableConfigure/variableConfigure.service';
import { SearchCounterService } from 'src/app/shared/services/SearchCounter/SearchCounter.service';
import { SLPService } from 'src/app/shared/services/SLP/SLP.service';

export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {

  @ViewChild('captchaElem') captchaElem;
  @ViewChild('showResult') modalRef: any;
  infoTable = []
  variableTable : any
  searchLABELForm: FormGroup
  test: Date = new Date();
  label
  focusLabel

  siteKey: string = environment.reCaptchaSiteKey;
  size: string = "normal";
  lang: string = "en";
  theme: string = "light";
  type: string = "image";

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  LabelMessages = {
    'LABEL': [
      { type: 'required', message: 'Self Label is required' },
    ],
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
    private productGenerationService: MasterDataService,
    private formBuilder: FormBuilder,
    private loadingBar: LoadingBarService,
    private modalService: BsModalService,
    private variableConfigureService: variableConfigureService,
    private SearchCounterService: SearchCounterService,
    private SLPService: SLPService
  ) { }

  ngOnInit() {
    this.disableSearch()

    this.searchLABELForm = this.formBuilder.group({
      LABEL: new FormControl('' ,Validators.compose([
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
    this.loadingBar.start();
    console.log("HTTP",this.searchLABELForm.value.LABEL)
    let datafield = "SLP_ID="+this.searchLABELForm.value.LABEL 
    this.LabelCounter();
    this.SLPService.filter(datafield).subscribe(
      (res) => {
        this.infoTable=res
        console.log("wewe",this.infoTable)
        this.loadingBar.complete();
        if (this.infoTable.length == 0){
          this.errorMessage();
          this.searchLABELForm.reset()
          this.captchaElem.reloadCaptcha()
        }
        else{
          this.openModal(this.modalRef)
        }
      },
      (err) => {
        this.loadingBar.complete();
        this.errorMessage();
        this.searchLABELForm.reset()
        this.captchaElem.reloadCaptcha()

      },
      () => console.log("HTTP request completed.")
    );
  }

  LabelCounter(){
    let imeicounter = { Name:"LABEL", Counter:"4"};
    this.SearchCounterService.post(imeicounter).subscribe(
      (res) => {
        console.log("+1 LABEL Counter")
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
    this.searchLABELForm.reset()
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
      text: "Please enter valid SLP ID!",
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
        console.error("err", err);
      }
    );
  }

  disableSearch(){
    let varID = '22476c26-cc1b-4770-86f8-87a631bc8c35';
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
